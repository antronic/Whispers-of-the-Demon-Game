using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using api_signalR_csharp.Models;
using Microsoft.AspNetCore.SignalR;
using api_signalR_csharp.SignalRHub;
using api_signalR_csharp.DTOs;

namespace api_signalR_csharp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IHubContext<IsekaiHub> _hubContext;

    public HomeController(ILogger<HomeController> logger, IHubContext<IsekaiHub> hubContext)
    {
        _logger = logger;
        _hubContext = hubContext;
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

        await _hubContext.Clients.Client(messages.data.Signalr_id).SendAsync("broadcastMessage", "Server", messages.data.message);

        // await _hubContext.Clients.Client(messages.UserconnectionId).SendAsync("broadcasttoclient",messages.message);

        return Ok("Message sent");
    }
}
