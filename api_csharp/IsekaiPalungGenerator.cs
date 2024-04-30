using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Ranger.AIvsDemon
{
    public class IsekaPalungGenerator
    {
        private readonly ILogger<IsekaPalungGenerator> _logger;
        private readonly OpenAIClient AOAIclient;
        private bool useAzureOpenAI = true; // or false depending on your requirement

        public IsekaPalungGenerator(ILogger<IsekaPalungGenerator> logger)
        {
            _logger = logger;
            AOAIclient = new OpenAIClient(new Uri(Environment.GetEnvironmentVariable("AOAIUri")),
            new AzureKeyCredential(Environment.GetEnvironmentVariable("AOAIAzureKeyCredential")));
        }

        [Function("IsekaiPalungGenerator")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            PalungIsekaiGenDTO isekaiDTO = await req.ReadFromJsonAsync<PalungIsekaiGenDTO>();
            var palungPrompt = isekaiDTO.data.prompt;

            var systemPrompt =
            """
            You need to calculate the attack damage based on user input, ensuring that it does not too overestimate. The calculated damage must be reasonable and justifiable, avoiding any overestimations. It's important to note that achieving 100% of enemy damage is unrealistic.
            The damage calculation should be consistent with the player's role and equipment. The damage should not be zero. Additionally, consider the enemy's characteristics if they are provided.
            Repeated use of the same attack method should result in decreased damage due to wear or diminishing effectiveness.
            User role alway as a attacker.
            The enemy is a monster that have very high defense and healh. but not more than 10000.
            If user equipment is not provided, or not resonable the damage must be between 10 and 50.
            Minimum damage must grater than 10, and maximum damage is 1000.
            if user ask out of scope, the output must be in JSON format as well same as below only:
            { "message": "return message", damage: 0,"type": "OUT_OF_SCOPE" }
            The output must be in JSON format as shown below only:
            { "message": "example reason", damage: 0,"type": "ATTACK" }
            """;
            var completionOptions = new ChatCompletionsOptions
            {
                DeploymentName = "gpt-35-turbo",
                MaxTokens = 400,
                Temperature = 1f,
                FrequencyPenalty = 0.0f,
                PresencePenalty = 0.0f,
                NucleusSamplingFactor = 0.95f // Top P
            };
            completionOptions.Messages.Add(new ChatRequestSystemMessage(systemPrompt));
            completionOptions.Messages.Add(new ChatRequestSystemMessage($"user's role and equipment. detail is: {isekaiDTO.data.charactor}"));
            completionOptions.Messages.Add(new ChatRequestSystemMessage("Below is attack history:"));
            // History of the conversation
            foreach (var item in isekaiDTO.data.history)
            {
                _logger.LogInformation($"Adding {item.role}: {item.content}");
                switch (item.role)
                {
                    case "user":
                        completionOptions.Messages.Add(new ChatRequestUserMessage(item.content));
                        break;
                    case "assistant":
                        completionOptions.Messages.Add(new ChatRequestAssistantMessage(item.content));
                        break;
                    default:
                        break;
                }
            }

            // var systemPrompt2 =
            // """

            // """;
            // completionOptions.Messages.Add(new ChatRequestSystemMessage(systemPrompt2));

            completionOptions.Messages.Add(new ChatRequestUserMessage(palungPrompt));
            var isError = true;
            var palungData = "";
            var responseMessage = new object();
            while (isError)
            {
                try
                {
                    ChatCompletions response = await AOAIclient.GetChatCompletionsAsync(completionOptions);
                    _logger.LogInformation(response.Choices[0].Message.Content.ToString());
                    palungData = response.Choices[0].Message.Content.ToString();
                    var palung64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(palungData));
                    responseMessage = new
                    {
                        data = new
                        {
                            message = palung64,
                            signalr_id = isekaiDTO.data.signalr_id,
                            type = "GENERATED_PALUNG",
                            guid = isekaiDTO.data.guid
                        }
                    };
                }
                catch (System.Exception)
                {
                    isError = true;
                }
                finally
                {
                    isError = false;
                }
            }
            var serializeOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };


            using (HttpClient client = new HttpClient())
            {

                var json = JsonSerializer.Serialize(responseMessage, serializeOptions);
                _logger.LogInformation(json);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                _logger.LogInformation(content.ToString());
                var signalrHandlerEndpoint = Environment.GetEnvironmentVariable("signalrHandlerEndpoint");
                await client.PostAsync($"{signalrHandlerEndpoint}/sendToUser", content);
            }

            isSuccessResponse isSuccess = new isSuccessResponse
            {
                success = true
            };
            return new OkObjectResult(isSuccess);
        }
    }
    public class PalungDataModel
    {
        public string message { get; set; }
        public string damage { get; set; }
        public string type { get; set; }
    }
}