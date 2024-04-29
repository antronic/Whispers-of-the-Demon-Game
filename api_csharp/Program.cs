using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        services.AddSignalR();
        services.AddHttpClient();
        services.AddAzureClients(builder =>
        {
            builder.AddServiceBusClient(Environment.GetEnvironmentVariable("AzureServiceBus"));
        });
    })
    .Build();

host.Run();


