using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.Models
{
    public class LicenseDocument
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LicenseId { get; set; }

        [ForeignKey(nameof(LicenseId))]
        public License License { get; set; } = null!;

        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;

        [Required]
        public byte[] FileData { get; set; } = Array.Empty<byte>(); // BLOB Storage

        [Required]
        public long FileSize { get; set; }

        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
