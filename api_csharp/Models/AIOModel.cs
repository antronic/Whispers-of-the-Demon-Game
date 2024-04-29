using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace Ranger.AIvsDemon
{
    public record AvatarGenDTO
    {
        public string Prompt { get; set; }
    }

    public record isSuccessResponse
    {
        public bool success { get; set; }
    }

    public record IsekaiNameDTO
    {
        public IsekaiNameResponse IsekaiName { get; set; }
    }

    public record IsekaiNameResponse
    {
        public string message { get; set; }
        public string generatedName { get; set; }
        [JsonProperty("signalr_id")]
        public string Signalr_id { get; set; }
        public string type { get; set; }
    }

    public record IsekaiSignalRResponse
    {
        public IsekaiNameResponse data { get; set; }
    }
    public record NameForIsekaiGenDTO
    {
        [JsonProperty("Data")]
        public NameData data { get; set; }
    }

    public record NameData
    {
        [JsonProperty("signalr_id")]
        public string Signalr_id { get; set; }
        public string Name { get; set; }
    }

    public record AvatarIsekaiGenDTO
    {
        [JsonProperty("Data")]
        public AvatarData data { get; set; }
    }

    public record AvatarData
    {
        public string signalr_id { get; set; }
        public string prompt { get; set; }
    }


}