using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.Repositories;

namespace LicenseManagementTool_API.Services
{
    public interface ILicenseDocumentService
    {
        Task<List<LicenseDocumentResponseDto>> GetDocumentsByLicenseIdAsync(int licenseId);
        Task<LicenseDocumentResponseDto?> UploadDocumentAsync(int licenseId, UploadDocumentDto dto);
        Task<LicenseDocumentResponseDto?> GetDocumentInfoAsync(int id);
        Task<(byte[] FileData, string FileName)?> DownloadDocumentAsync(int id);
        Task<bool> DeleteDocumentAsync(int id);
    }

    public class LicenseDocumentService : ILicenseDocumentService
    {
        private readonly ILicenseDocumentRepository _documentRepository;
        private readonly ILicenseRepository _licenseRepository;

        public LicenseDocumentService(ILicenseDocumentRepository documentRepository, ILicenseRepository licenseRepository)
        {
            _documentRepository = documentRepository;
            _licenseRepository = licenseRepository;
        }

        public async Task<List<LicenseDocumentResponseDto>> GetDocumentsByLicenseIdAsync(int licenseId)
        {
            var docs = await _documentRepository.GetByLicenseIdAsync(licenseId);
            return docs.Select(MapToDto).ToList();
        }

        public async Task<LicenseDocumentResponseDto?> UploadDocumentAsync(int licenseId, UploadDocumentDto dto)
        {
            //Check if license exists
            if (!await _licenseRepository.ExistsAsync(licenseId))
                return null;

            if (dto.File == null || dto.File.Length == 0)
                return null;

            // Check Filesize (max. 5 MB)
            if (dto.File.Length > 5 * 1024 * 1024)
                throw new InvalidOperationException("File too large (max 5 MB)");

            //Allowed formats
            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(dto.File.FileName).ToLowerInvariant();
            if (!allowedExtensions.Contains(fileExtension))
                throw new InvalidOperationException("Only PDF, JPG, JPEG, PNG allowed");

            using var memoryStream = new MemoryStream();
            await dto.File.CopyToAsync(memoryStream);

            var document = new LicenseDocument
            {
                LicenseId = licenseId,
                FileName = dto.File.FileName,
                FileData = memoryStream.ToArray(),
                FileSize = dto.File.Length,
                UploadedAt = DateTime.UtcNow
            };

            var created = await _documentRepository.CreateAsync(document);
            return MapToDto(created);
        }

        public async Task<LicenseDocumentResponseDto?> GetDocumentInfoAsync(int id)
        {
            var doc = await _documentRepository.GetByIdAsync(id);
            return doc != null ? MapToDto(doc) : null;
        }

        public async Task<(byte[] FileData, string FileName)?> DownloadDocumentAsync(int id)
        {
            var doc = await _documentRepository.GetByIdAsync(id);
            if (doc == null) return null;

            return (doc.FileData, doc.FileName);
        }

        public async Task<bool> DeleteDocumentAsync(int id)
        {
            return await _documentRepository.DeleteAsync(id);
        }

        private LicenseDocumentResponseDto MapToDto(LicenseDocument doc)
        {
            return new LicenseDocumentResponseDto
            {
                Id = doc.Id,
                LicenseId = doc.LicenseId,
                FileName = doc.FileName,
                FileSize = doc.FileSize,
                UploadedAt = doc.UploadedAt
            };
        }
    }
}
