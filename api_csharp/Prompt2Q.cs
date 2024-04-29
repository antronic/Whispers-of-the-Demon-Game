using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Azure.Messaging.ServiceBus;

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

        [Function("Prompt2Q")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {

            //get prompt from request
            string prompt = req.Query["prompt"].ToString() ?? string.Empty;

            if (prompt == string.Empty)
            {
                //get prompt from request body
                Prompt2QDTO data = await req.ReadFromJsonAsync<Prompt2QDTO>();
                prompt = data.Prompt;
            }
            // add prompt to azure services bus 
            ServiceBusMessage message = new ServiceBusMessage(prompt);
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

            return new OkObjectResult("Prompt added to queue.");
        }
    }
}
