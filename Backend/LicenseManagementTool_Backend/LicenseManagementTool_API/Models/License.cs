using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.Models
{
    public class License
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string LicenseName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LicenseKey { get; set; }

        [Required]
        public int PurchasedCount { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [ForeignKey(nameof(DepartmentId))]
        public Department Department { get; set; } = null!;

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required]
        public int LicenseDurationMonths { get; set; }

        [Required]
        public DateTime ExpirationDate { get; set; }

        [Required]
        [MaxLength(50)]
        public string RenewalType { get; set; } = string.Empty; // Manual, Automatic, Subscription

        [MaxLength(200)]
        public string? ExecutableFile { get; set; }

        [MaxLength(500)]
        public string? SearchKeywords { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Active"; // Active, Expired, ExpiringSoon

        public int CreatedBy { get; set; }

        [ForeignKey(nameof(CreatedBy))]
        public User Creator { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<LicenseDocument> Documents { get; set; } = new List<LicenseDocument>();
        //public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
