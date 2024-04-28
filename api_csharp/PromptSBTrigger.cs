using System;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Ranger.AIvsDemon
{
    public class PromptSBTrigger
    {
        private readonly ILogger<PromptSBTrigger> _logger;

        public PromptSBTrigger(ILogger<PromptSBTrigger> logger)
        {
            _logger = logger;
        }

        [Function(nameof(PromptSBTrigger))]
        public async Task Run(
            [ServiceBusTrigger("CharPrompt", Connection = "AzureServiceBus")]
            ServiceBusReceivedMessage message,
            ServiceBusMessageActions messageActions)
        {
            _logger.LogInformation("Message ID: {id}", message.MessageId);
            _logger.LogInformation("Message Body: {body}", message.Body);
            _logger.LogInformation("Message Content-Type: {contentType}", message.ContentType);

            // Complete the message
            await messageActions.CompleteMessageAsync(message);
        }
    }
}
