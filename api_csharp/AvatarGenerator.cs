using System.Net.Http.Json;
using Azure;
using Azure.AI.OpenAI;
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

        public AvatarGenerator(ILogger<AvatarGenerator> logger)
        {
            _logger = logger;
            
            AOAIclient = useAzureOpenAI
                    ? new OpenAIClient(
                        new Uri(Environment.GetEnvironmentVariable("AOAIUri")),
                        new AzureKeyCredential(Environment.GetEnvironmentVariable("AOAIAzureKeyCredential")))
                    : new OpenAIClient("sk-");
        }

        [Function("AvatarGenerator")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            string imageprompt = req.Query["prompt"].ToString() ?? string.Empty;
            

            if (imageprompt == string.Empty)
            {
                AvatarGenDTO data = await req.ReadFromJsonAsync<AvatarGenDTO>();
                imageprompt = data.Prompt;
            }
            try
            {
                Response<ImageGenerations> response = await AOAIclient.GetImageGenerationsAsync(
                    new ImageGenerationOptions()
                    {
                        DeploymentName = useAzureOpenAI ? "dalle-3" : "dall-e-3",
                        // Prompt = $"create 3d anime chibi avatar of {imageprompt}, white background, pixel art, round circle.",
                        Prompt = $"Create an anime character {imageprompt}, white background, pixelate, round circle.",
                        Size = ImageSize.Size1024x1024,
                        Quality = ImageGenerationQuality.Standard,
                    });

                ImageGenerationData generatedImage = response.Value.Data[0];
                _logger.LogWarning($"{generatedImage.PromptFilterResults.Violence.Severity}");
                _logger.LogWarning(generatedImage.PromptFilterResults.Violence.Filtered ?
                "Filtered" : "Not Filtered");
                Console.WriteLine($"Generated image available at: {generatedImage.Url.AbsoluteUri}");

                return new OkObjectResult(generatedImage.Url.AbsoluteUri);
            }
            catch (System.Exception e)
            {
                return new OkObjectResult(e.Message);
            }
        }
    }

    public record AvatarGenDTO
    {
        public string Prompt { get; set; }
    }
}
