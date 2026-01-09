using System.ComponentModel.DataAnnotations;

namespace LicenseManagementTool_API.DTOs
{
    public class LicenseDtos
    {
    }

    public class CreateLicenseDto
    {
        [Required]
        [MaxLength(200)]
        public string LicenseName { get; set; } = string.Empty;

        [MaxLength(500)]
        public string? LicenseKey { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int PurchasedCount { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required]
        [Range(1, 1200)] // 1 Monat bis 100 Jahre
        public int LicenseDurationMonths { get; set; }

        [Required]
        [RegularExpression("^(Manual|Automatic|Subscription)$")]
        public string RenewalType { get; set; } = "Manual";

        [MaxLength(200)]
        public string? ExecutableFile { get; set; }

        [MaxLength(500)]
        public string? SearchKeywords { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }
    }

    // Request DTO zum Aktualisieren einer Lizenz
    public class UpdateLicenseDto
    {
        [MaxLength(200)]
        public string? LicenseName { get; set; }

        [MaxLength(500)]
        public string? LicenseKey { get; set; }

        [Range(1, int.MaxValue)]
        public int? PurchasedCount { get; set; }

        public int? DepartmentId { get; set; }

        public DateTime? PurchaseDate { get; set; }

        [Range(1, 1200)]
        public int? LicenseDurationMonths { get; set; }

        [RegularExpression("^(Manual|Automatic|Subscription)$")]
        public string? RenewalType { get; set; }

        [MaxLength(200)]
        public string? ExecutableFile { get; set; }

        [MaxLength(500)]
        public string? SearchKeywords { get; set; }

        [MaxLength(2000)]
        public string? Description { get; set; }

        [RegularExpression("^(Active|Expired|ExpiringSoon)$")]
        public string? Status { get; set; }
    }

    // Response DTO für Lizenz-Abfragen
    public class LicenseResponseDto
    {
        public int Id { get; set; }
        public string LicenseName { get; set; } = string.Empty;
        public string? LicenseKey { get; set; }
        public int PurchasedCount { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public DateTime PurchaseDate { get; set; }
        public int LicenseDurationMonths { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string RenewalType { get; set; } = string.Empty;
        public string? ExecutableFile { get; set; }
        public string? SearchKeywords { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int DocumentCount { get; set; }
    }

    // DTO für Lizenz-Filter
    public class LicenseFilterDto
    {
        public string? LicenseName { get; set; }
        public int? DepartmentId { get; set; }
        public string? ExecutableFile { get; set; }
        public string? SearchKeyword { get; set; }
        public string? RenewalType { get; set; }
        public string? Status { get; set; } // Active, Expired, ExpiringSoon
        public DateTime? PurchaseDateFrom { get; set; }
        public DateTime? PurchaseDateTo { get; set; }
    }
}
