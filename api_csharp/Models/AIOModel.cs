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
        public string signalr_id { get; set; }
        public Guid guid { get; set; }
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
        public string name { get; set; }
        public Guid guid { get; set; }

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
        public Guid guid { get; set; }

    }

    public record PalungIsekaiGenDTO
    {
        [JsonProperty("Data")]
        public PalungIsekaiData data { get; set; }
    }

    public record PalungIsekaiData
    {
        public string signalr_id { get; set; }
        public string prompt { get; set; }
        public string charactor { get; set; }
        public List<palungHistory> history { get; set; }
        public Guid guid { get; set; }

    }

    public record palungHistory
    {
        public string role { get; set; }
        public string content { get; set; }
    }

    public record PalungData
    {
        public string signalr_id { get; set; }
        public string prompt { get; set; }
        public Guid guid { get; set; }

    }

    public record PalungDataReturn
    {
        public string message { get; set; }
        public string type { get; set; }
        public double damage { get; set; }
        public Guid guid { get; set; }

    }

    public record EquipmentExtractor
    {
        public string character { get; set; }

        public string equipment_weapon { get; set; }
    }



}