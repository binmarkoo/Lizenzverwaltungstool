using Microsoft.EntityFrameworkCore;
using LicenseManagementTool_API.Models;

namespace LicenseManagementTool_API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<License> Licenses { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<LicenseDocument> LicenseDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed Roles
            modelBuilder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Editor" },
                new Role { Id = 3, Name = "Viewer" }
            );

            // Seed Departments
            modelBuilder.Entity<Department>().HasData(
                new Department { Id = 1, Name = "IT" },
                new Department { Id = 2, Name = "LIS" },
                new Department { Id = 3, Name = "ITM" }
            );

            // Seed Admin User - mit Username
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@liebherr.com",
                    Username = "admin",
                    PasswordHash = "$2a$11$5xKxq3yJZQ8gZJZGX8YxLORjqmJ3HJMJvC7hX7GZ7fKqwXMJXQZWS", // Admin123!
                    RoleId = 1,
                    DepartmentId = 1,
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
                    IsActive = true
                }
            );
        }
    }
}

