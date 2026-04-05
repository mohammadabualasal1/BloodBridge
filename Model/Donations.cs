using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace BloodBridge.Model
{
    public class Donations
    {
        public long Id { get; set; }

        [ForeignKey("Donor")]
        public long? DonorId { get; set; }
        public Donors? Donor { get; set; }


        [ForeignKey("BloodRequests")]
        public long? RequestId { get; set; }
        public BloodRequests? BloodRequests { get; set; }

        public DateTime DonationDate { get; set; }
        public string Status { get; set; }
        public string Notes { get; set; }

    }
}
