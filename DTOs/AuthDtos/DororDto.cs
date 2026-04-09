namespace BloodBridge.DTOs.AuthDtos
{
    public class DororDto
    {
        public string? BloodType { get; set; }
        public string? City { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime? LastDonation { get; set; }
    }
}
