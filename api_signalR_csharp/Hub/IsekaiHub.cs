
using api_signalR_csharp.DTOs;
using Microsoft.AspNetCore.SignalR;


namespace api_signalR_csharp.SignalRHub
{
    public class IsekaiHub : Hub
    {
        List<UserConnection> uList = new List<UserConnection>();
        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("broadcastMessage", "Server", $"{Context.ConnectionId}");
            await base.OnConnectedAsync();
        }
        public Task BroadcastMessage(string name, string message) =>
        Clients.All.SendAsync("broadcastMessage", name, message);

        public Task Echo(string name, string message) =>
            Clients.Client(Context.ConnectionId)
                    .SendAsync("echo", name, $"{message} (echo from server)");
    }
}