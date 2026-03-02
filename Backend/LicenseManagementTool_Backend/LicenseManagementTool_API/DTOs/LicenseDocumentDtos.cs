namespace LicenseManagementTool_API.DTOs
{
    public class UploadDocumentDto
    {
        public IFormFile File { get; set; } = null!;
    }

    public class LicenseDocumentResponseDto
    {
        public int Id { get; set; }
        public int LicenseId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
