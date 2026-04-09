namespace BloodBridge.DTOs.BloodRequestDTOS
{
    public class BloodRequestDto
    {
        public string ?BloodType { get; set; }
        public long ?Quantity { get; set; }
        public string? Urgency { get; set; }
        public string ?Status { get; set; }
        public DateTime? CreatedAt { get; set; }
        public long? HospitalId { get; set; }
    }
}
