using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.Models
{
    public class Role
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty; // Admin, Editor, Viewer

        // Navigation Properties -> One Role has multiple Users
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}
