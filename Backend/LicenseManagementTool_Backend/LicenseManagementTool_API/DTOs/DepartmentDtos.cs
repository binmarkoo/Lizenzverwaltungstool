using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.DTOs
{
    public class CreateDepartmentDto
    {
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateDepartmentDto
    {
        [MaxLength(100)]
        public string? Name { get; set; }
    }

    public class DepartmentResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UserCount { get; set; }
        public int LicenseCount { get; set; }
    }
}
