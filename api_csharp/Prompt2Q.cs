using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Messaging.ServiceBus;
using System.Text.Json;
using System.Text.Encodings.Web;
using System.Text.Unicode;

namespace Ranger.AIvsDemon
{
    public class Prompt2Q
    {
        private readonly ILogger<Prompt2Q> _logger;
        private readonly ServiceBusClient sbclient;
        private readonly ServiceBusSender sbsender;


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

        }

        [Function("IsekaiAvatarGenerator")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            AvatarIsekaiGenDTO isekaiDTO = await req.ReadFromJsonAsync<AvatarIsekaiGenDTO>();
            var options1 = new JsonSerializerOptions
            {
                Encoder = JavaScriptEncoder.Create(UnicodeRanges.All),
                WriteIndented = true
            };
            var json = JsonSerializer.Serialize(isekaiDTO, options1);
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
