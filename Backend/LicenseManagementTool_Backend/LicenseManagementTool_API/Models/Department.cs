using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.Models
{
    public class Department
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        // Navigation Properties
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<License> Licenses { get; set; } = new List<License>();
    }
}
