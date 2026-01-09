using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.DTOs
{
    public class UserDtos
    {
    }

    public class CreateUserDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [MaxLength(100)]
        public string Password { get; set; } = string.Empty;

        [Required]
        public int RoleId { get; set; }

        [Required]
        public int DepartmentId { get; set; }
    }

    // Request DTO zum Aktualisieren eines Users
    public class UpdateUserDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }

        [EmailAddress]
        [MaxLength(200)]
        public string? Email { get; set; }

        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        [MaxLength(100)]
        public string? Password { get; set; }

        public int? RoleId { get; set; }

        public int? DepartmentId { get; set; }
    }

    // Response DTO für User-Abfragen
    public class UserResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
