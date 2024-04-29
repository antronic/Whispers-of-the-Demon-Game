using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace Ranger.AIvsDemon
{
    public class signalR2U
    {
        private readonly ILogger<signalR2U> _logger;

        public signalR2U(ILogger<signalR2U> logger)
        {
            _logger = logger;
        }

        // [Function(nameof(SendToUser))]
        // [SignalROutput(HubName = "serverless")]
        // public static async Task<SignalRMessageAction> SendToUser([HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequestData req)
        // {
        //     using var bodyReader = new StreamReader(req.Body);

        //     return new SignalRMessageAction("newMessage", new object[] { $"Current star count of https://github.com/Azure/azure-signalr is:" });
        // }
    }
}
