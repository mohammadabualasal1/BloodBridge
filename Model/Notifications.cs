using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBridge.Model
{
    public class Notifications
    {
        public long NotificationId { get; set; }

        [ForeignKey("User")]
        public long? UserId { get; set; }
        public User? User { get; set; }

        public string Message { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
