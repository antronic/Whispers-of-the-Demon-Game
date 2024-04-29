using System.Net.Http.Json;
using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Unicode;
using Azure;
using Azure.AI.OpenAI;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Ranger.AIvsDemon
{
    public class AvatarGenerator
    {
        private readonly ILogger<AvatarGenerator> _logger;
        private readonly OpenAIClient AOAIclient;
        private bool useAzureOpenAI = true; // or false depending on your requirement
        private BlobServiceClient blobServiceClient;

        public AvatarGenerator(ILogger<AvatarGenerator> logger, BlobServiceClient blobService)
        {
            _logger = logger;
            blobServiceClient = blobService;
            AOAIclient = useAzureOpenAI
                    ? new OpenAIClient(
                        new Uri(Environment.GetEnvironmentVariable("AOAIUri")),
                        new AzureKeyCredential(Environment.GetEnvironmentVariable("AOAIAzureKeyCredential")))
                    : new OpenAIClient("sk-");
        }

        [Function("IsekaiAvatarGenerator-direct")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {

            AvatarIsekaiGenDTO isekaiDTO = await req.ReadFromJsonAsync<AvatarIsekaiGenDTO>();
            var systemPrompt =
            """
            You are an AI assistant that provide the ready to use prompt for dall-e 3 model to generates the avatar images in cute chibi pixelate style
            Replace all weapon-like inputs with either sports equipment or sweet desserts.
            Image should have white background.
            Image should generate with circle.
            """;
            var completionOptions = new ChatCompletionsOptions
            {
                DeploymentName = "gpt-4-32k",
                MaxTokens = 400,
                Temperature = 2.0f,
                FrequencyPenalty = 0.0f,
                PresencePenalty = 0.0f,
                NucleusSamplingFactor = 0.95f // Top P
            };
            completionOptions.Messages.Add(new ChatRequestSystemMessage(systemPrompt));
            completionOptions.Messages.Add(new ChatRequestUserMessage(isekaiDTO.data.prompt));
            ChatCompletions response = await AOAIclient.GetChatCompletionsAsync(completionOptions);
            _logger.LogInformation(response.Choices[0].Message.Content.ToString());
            var imageprompt = response.Choices[0].Message.Content.ToString();


            try
            {
                Response<ImageGenerations> imagerespond = await AOAIclient.GetImageGenerationsAsync(
                    new ImageGenerationOptions()
                    {
                        DeploymentName = "dall-e-3",
                        // Prompt = $"create 3d anime chibi avatar of {imageprompt}, white background, pixel art, round circle.",
                        Prompt = $"{imageprompt}",
                        Size = ImageSize.Size1024x1024,
                        Quality = ImageGenerationQuality.Standard,
                    });

                ImageGenerationData generatedImage = imagerespond.Value.Data[0];
                _logger.LogWarning($"{generatedImage.PromptFilterResults.Violence.Severity}");
                _logger.LogWarning(generatedImage.PromptFilterResults.Violence.Filtered ?
                "Filtered" : "Not Filtered");
                Console.WriteLine($"Generated image available at: {generatedImage.Url.AbsoluteUri}");

                //download Image from Url and to upload to azure blob storage
                using (HttpClient client = new HttpClient())
                {
                    var imgcontent = await client.GetAsync(generatedImage.Url.AbsoluteUri);
                    var content = await imgcontent.Content.ReadAsByteArrayAsync();
                    var blobClient = blobServiceClient.GetBlobContainerClient("isekai-avatar").GetBlobClient($"{isekaiDTO.data.signalr_id}.png");
                    await blobClient.UploadAsync(new MemoryStream(content), true);
                }

                IsekaiSignalRResponse responseMessage = new IsekaiSignalRResponse
                {
                    data = new IsekaiNameResponse
                    {
                        message = $"https://herograveyard.azureedge.net/isekai-avatar/{isekaiDTO.data.signalr_id}.png",
                        Signalr_id = isekaiDTO.data.signalr_id,
                        type = "GENERATED_AVATAR"
                    }
                };

                using (HttpClient client = new HttpClient())
                {
                    var options1 = new JsonSerializerOptions
                    {
                        Encoder = JavaScriptEncoder.Create(UnicodeRanges.All),
                        WriteIndented = true
                    };
                    var json = JsonSerializer.Serialize(responseMessage, options1);
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
            catch (System.Exception e)
            {
                return new OkObjectResult(e.Message);
            }
        }
    }
}
