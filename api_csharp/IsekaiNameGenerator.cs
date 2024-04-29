using System.Text;
using System.Text.Json;
using Azure;
using Azure.AI.OpenAI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
namespace Ranger.AIvsDemon
{
    public class IsekaiNameGenerator
    {
        private readonly ILogger<IsekaiNameGenerator> _logger;
        private readonly OpenAIClient AOAIclient;
        private bool useAzureOpenAI = true; // or false depending on your requirement
        public IsekaiNameGenerator(ILogger<IsekaiNameGenerator> logger)
        {
            _logger = logger;
            AOAIclient = useAzureOpenAI
        ? new OpenAIClient(
            new Uri(Environment.GetEnvironmentVariable("AOAIUri")),
            new AzureKeyCredential(Environment.GetEnvironmentVariable("AOAIAzureKeyCredential")))
        : new OpenAIClient("sk-");
        }

        [Function("IsekaiNameGenerator")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
        {

            NameForIsekaiGenDTO isekaiDTO = await req.ReadFromJsonAsync<NameForIsekaiGenDTO>();
            var humanName = isekaiDTO.data.Name;

            var systemPrompt =
            """
            You are an AI assistant that convert the name of the user to an Japanese Isekai Anime name.
            The name must not contain any special characters.
            Anime and manga character names typically fall into one of three categories: real names, fake names and unique or nicknames. Real names are usually just regular Japanese names, but can be from other cultures too depending on the anime. Nicknames and unique names tend to be very specific and often belong to the main character, like Ichigo from Bleach, Light from Death Note, or Naruto from Naruto.
            The fake names, which this generator focuses on, are similar to regular Japanese names, but you generally wouldn't find them in real life. Sometimes they're used to add a fantasy feeling to a story, sometimes they're used to avoid (accidental) matches with real life people, especially if a character is portrayed in a negative way, and other times it may be a more personal choice of the writer. Either way, this generator will generate a whole range of fake Japanese name fit for those types of anime and manga characters.
            Like regular Japanese names, the names in this generator are in personal name.
            Return only one name.
            Return firstname only.
            Return in JSON format: "{IsekaiName:{name}}"
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
            completionOptions.Messages.Add(new ChatRequestUserMessage(humanName));

            ChatCompletions response = await AOAIclient.GetChatCompletionsAsync(completionOptions);
            _logger.LogInformation(response.Choices[0].Message.Content.ToString());
            var isekaiName = JsonSerializer.Deserialize<IsekaiNameDTO>(response.Choices[0].Message.Content.ToString());
            IsekaiNameSignalRresponse responseMessage = new IsekaiNameSignalRresponse
            {
                data = new IsekaiNameres
                {
                    message = isekaiName.IsekaiName.name,
                    Signalr_id = isekaiDTO.data.Signalr_id
                }
            };

            using (HttpClient client = new HttpClient())
            {
                var json = JsonSerializer.Serialize(responseMessage);
                _logger.LogInformation(json);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                _logger.LogInformation(content.ToString());
                await client.PostAsync("http://localhost:5230/sendToUser", content);
            }

            isSuccessResponse isSuccess = new isSuccessResponse
            {
                success = true
            };
            return new OkObjectResult(isSuccess);
        }
    }

}
