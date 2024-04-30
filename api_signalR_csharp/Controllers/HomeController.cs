using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using api_signalR_csharp.Models;
using Microsoft.AspNetCore.SignalR;
using api_signalR_csharp.SignalRHub;
using api_signalR_csharp.DTOs;
using System.Text.Json;
using Redisconn;
using StackExchange.Redis;
using Newtonsoft.Json.Linq;

namespace api_signalR_csharp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<IsekaiHub> _hubContext;
    private readonly RedisConnection _redisConnection;

    public HomeController(ILogger<HomeController> logger, IHubContext<IsekaiHub> hubContext, RedisConnection redis)
    {
        _logger = logger;
        _hubContext = hubContext;
        _redisConnection = redis;
    }

    public IActionResult Index()
    {
        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [HttpPost("broadcastMessage")]
    public async Task<IActionResult> broadcastMessage([FromBody] broadcastMessageDTO messages)
    {
        await _hubContext.Clients.All.SendAsync("broadcastMessage", "Server", messages.message);
        return Ok("Message sent");
    }


    [HttpPost("sendToUser")]
    public async Task<IActionResult> sendToUser([FromBody] message2UserDTO messages)
    {
        var serialized = JsonSerializer.Serialize(messages.data);

        if (messages.data.type == "GENERATED_PALUNG")
        {
            await _hubContext.Clients.All.SendAsync("PROJECTOR_ATTACK", "Server", serialized);
        }
        await _hubContext.Clients.Client(messages.data.signalr_id).SendAsync(messages.data.type, "Server", serialized);

        return Ok("Message sent");
    }

    [HttpPost("registerUsers")]
    public async Task<IActionResult> registerSignalR([FromBody] UserConnection user)
    {
        var serialized = JsonSerializer.Serialize(user);

        await _hubContext.Clients.All.SendAsync("PROJECTOR_JOIN", "Server", serialized);

        return Ok("User Joined");
    }
}
