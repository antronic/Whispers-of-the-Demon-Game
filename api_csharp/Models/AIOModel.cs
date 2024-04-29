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
        public IsekaiNameres IsekaiName { get; set; }
    }

    public record IsekaiNameres
    {
        public string message { get; set; }
        public string name { get; set; }
        public string Signalr_id { get; set; }
    }

    public record IsekaiNameSignalRresponse
    {
        public IsekaiNameres data { get; set; }
    }
    public record NameForIsekaiGenDTO
    {
        [JsonProperty("Data")]
        public NameData data { get; set; }
    }

    public record NameData
    {
        public string Signalr_id { get; set; }
        public string Name { get; set; }
    }
}