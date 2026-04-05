using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBridge.Model
{
    public class Donors
    {
        public long Id { get; set; }

        [ForeignKey("User")]
        public long? UserId { get; set; }
        public User? User { get; set; } 

        public string BloodType { get; set; }
        public string City { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime? LastDonation { get; set; }
    }
}
