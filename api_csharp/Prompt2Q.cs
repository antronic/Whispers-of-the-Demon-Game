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

        public Prompt2Q(ILogger<Prompt2Q> logger)
        {
            _logger = logger;
            // get connectionstring from env name AzureServiceBus
            string connectionString = Environment.GetEnvironmentVariable("AzureServiceBus");


            ServiceBusClient sbclient = new ServiceBusClient(connectionString);
            

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


            _logger.LogInformation("C# HTTP trigger function processed a request.");
            return new OkObjectResult("Welcome to Azure Functions!");
        }
    }

        public record Prompt2QDTO
    {
        public string Prompt { get; set; }
    }
}
