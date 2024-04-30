using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Messaging.ServiceBus;
using System.Text.Json;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using Azure.AI.OpenAI;
using Azure;
using System.Text;

namespace Ranger.AIvsDemon
{
    public class Prompt2Q
    {
        private readonly ILogger<Prompt2Q> _logger;
        private readonly ServiceBusClient sbclient;
        private readonly ServiceBusSender sbsender;
        private readonly OpenAIClient AOAIclient;

        public Prompt2Q(ILogger<Prompt2Q> logger)
        {
            _logger = logger;
            // get connectionstring from env name AzureServiceBus
            string SBconnectionString = Environment.GetEnvironmentVariable("AzureServiceBus") ?? string.Empty;

            var clientOptions = new ServiceBusClientOptions()
            {
                TransportType = ServiceBusTransportType.AmqpWebSockets
            };
            // init azure servicesbus client
            sbclient = new ServiceBusClient(SBconnectionString, clientOptions);
            sbsender = sbclient.CreateSender("CharPrompt");
            AOAIclient = new OpenAIClient(new Uri(Environment.GetEnvironmentVariable("AOAIUri")),
new AzureKeyCredential(Environment.GetEnvironmentVariable("AOAIAzureKeyCredential")));


        }

        [Function("IsekaiAvatarGenerator")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            AvatarIsekaiGenDTO isekaiDTO = await req.ReadFromJsonAsync<AvatarIsekaiGenDTO>();
            var serializeOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            var json = JsonSerializer.Serialize(isekaiDTO, serializeOptions);
            // add prompt to azure services bus 
            ServiceBusMessage message = new ServiceBusMessage(json);
            try
            {
                await sbsender.SendMessageAsync(message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message to Azure Service Bus.");
                // Handle the exception or log the error message
            }
            finally
            {
                await sbclient.DisposeAsync();
                await sbsender.DisposeAsync();
            }

            //Extract weapon from prompt
            var systemPrompt =
            """
            You are the intelligence AI assistant to Convert the user's input into JSON format.
            User will provide the input prompt about the character that they want to create.
            It may include the equipment or weapon that the character has.
            If the character's equipment does not include a weapon, suggest one that they might have had since birth. For instance, a spider could use its web as a weapon.
            The output must be in the following sample JSON format:
            { character: "", equipment_weapon: "" }
            Ensure that all fields are provided in the output.
            """;
            var completionOptions = new ChatCompletionsOptions
            {
                DeploymentName = "gpt-4-32k",
                MaxTokens = 400,
                Temperature = 1f,
                FrequencyPenalty = 0.0f,
                PresencePenalty = 0.0f,
                NucleusSamplingFactor = 0.95f // Top P
            };
            completionOptions.Messages.Add(new ChatRequestSystemMessage(systemPrompt));
            completionOptions.Messages.Add(new ChatRequestUserMessage(isekaiDTO.data.prompt));
            ChatCompletions response = await AOAIclient.GetChatCompletionsAsync(completionOptions);
            _logger.LogInformation(response.Choices[0].Message.Content.ToString());
            var extractedData = JsonSerializer.Deserialize<EquipmentExtractor>(response.Choices[0].Message.Content.ToString());

            //base64 encode the extracted data
            var extractedData64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(response.Choices[0].Message.Content.ToString()));


            var responseMessage = new 
            {
                data = new 
                {
                    message = extractedData64,
                    signalr_id = isekaiDTO.data.signalr_id,
                    type = "EXTRACT_CHARACTER"
                }
            };

            using (HttpClient client = new HttpClient())
            {
                var json2 = JsonSerializer.Serialize(responseMessage.ToString(), serializeOptions);
                _logger.LogInformation(json2);
                var content = new StringContent(json2, Encoding.UTF8, "application/json");
                _logger.LogInformation(content.ToString());
                var signalrHandlerEndpoint = Environment.GetEnvironmentVariable("signalrHandlerEndpoint");
                await client.PostAsync($"{signalrHandlerEndpoint}/sendToUser", content);
                // await client.PostAsync($"http://localhost:5230/sendToUser", content);
            }

            isSuccessResponse isSuccess = new isSuccessResponse
            {
                success = true
            };
            return new OkObjectResult(isSuccess);
        }
    }

    public record Prompt2QDTO
    {
        public string Prompt { get; set; }
    }
}
