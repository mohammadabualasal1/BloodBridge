using BloodBridge.Model;
using Microsoft.EntityFrameworkCore;

namespace BloodBridge
{
    public class BloodBridgeDbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Donors> Donors { get; set; }

        public DbSet<Hospitals> Hospitals { get; set; }

        public DbSet<Notifications> Notifications { get; set; }

        public DbSet<Donations> Donations { get; set; }

        public DbSet<BloodRequests> BloodRequests { get; set; }
    }
}
}
