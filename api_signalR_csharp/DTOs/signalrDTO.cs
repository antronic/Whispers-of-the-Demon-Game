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
        public string message { get; set; }
        public string signalr_id { get; set; }
        public string type { get; set; }
        public Guid guid { get; set; }
    }

    public record UserConnection
    {
        public string signalr_id { set; get; }
        public Guid guid { set; get; }
        public string name { get; set; }
        public string avatar_url { get; set; }
    }
}