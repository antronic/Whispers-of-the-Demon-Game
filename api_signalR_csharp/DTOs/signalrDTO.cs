using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_signalR_csharp.DTOs
{
    public record broadcastMessageDTO
    {
        public required string message { get; set; }
    }

    public record message2UserDTO
    {
        public required message2User data { get; set; }
    }
    public record message2User
    {
        public required string message { get; set; }
        public required string signalr_id { get; set; }
        public required string type { get; set; }
    }

    public record UserConnection
    {
        public string UserName { set; get; }
        public string ConnectionID { set; get; }
    }
}