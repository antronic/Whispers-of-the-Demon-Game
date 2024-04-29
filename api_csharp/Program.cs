using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services => {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();
        //add azure storage account
        services.AddAzureClients(builder =>
        {
            builder.AddBlobServiceClient(Environment.GetEnvironmentVariable("heroGraveYardSorage"));
        });
    })
    .Build();

host.Run();