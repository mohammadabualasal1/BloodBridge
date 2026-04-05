using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBridge.Model
{
    public class Hospitals
    {
        public long Id { get; set; }


        [ForeignKey("User")]
        public long? UserId { get; set; }
        public User? User { get; set; }

        public string HospitalName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public bool IsVerified { get; set; }

    }
}
