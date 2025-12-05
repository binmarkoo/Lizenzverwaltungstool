using Microsoft.EntityFrameworkCore;
using LicenseManagementTool_API.Models;

namespace LicenseManagementTool_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<License> Licenses { get; set; }
    }   
}
