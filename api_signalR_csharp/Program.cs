using api_signalR_csharp.SignalRHub;
using Microsoft.AspNetCore.SignalR;
using Redisconn;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSignalR().AddAzureSignalR();

//register redis as a singleton
builder.Services.AddSingleton<RedisConnection>(await RedisConnection.InitializeAsync(builder.Configuration.GetValue<String>("REDIS_CONNECTION_STRING")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();


app.UseAuthorization();

app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowAnyOrigin()
    .SetIsOriginAllowed(origin => true)
    );

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.MapHub<IsekaiHub>("/serverless");

app.Run();
