using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBridge.Model
{
    public class BloodRequests
    {
        public long RequestId { get; set; }

        [ForeignKey("Hospital")]
        public long? HospitalId { get; set; }
        public Hospitals? Hospital { get; set; }

        public string BloodType { get; set; }
        public long Quantity { get; set; }
        public string Urgency { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
