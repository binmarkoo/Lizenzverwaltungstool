using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Repositories;
using LicenseManagementTool_API.Models;

namespace LicenseManagementTool_API.Services
{
    public interface ILicenseService
    {
        Task<List<LicenseResponseDto>> GetAllLicensesAsync();
        Task<LicenseResponseDto?> GetLicenseByIdAsync(int id);
        Task<List<LicenseResponseDto>> GetFilteredLicensesAsync(LicenseFilterDto filter);
        Task<LicenseResponseDto> CreateLicenseAsync(CreateLicenseDto dto);
        Task<LicenseResponseDto?> UpdateLicenseAsync(int id, UpdateLicenseDto dto);
        Task<bool> DeleteLicenseAsync(int id);
        Task UpdateLicenseStatusesAsync(); // Background Job - für später
    }

    public class LicenseService : ILicenseService
    {
        private readonly ILicenseRepository _repository;

        public LicenseService(ILicenseRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<LicenseResponseDto>> GetAllLicensesAsync()
        {
            var licenses = await _repository.GetAllAsync();
            return licenses.Select(MapToDto).ToList();
        }

        public async Task<LicenseResponseDto?> GetLicenseByIdAsync(int id)
        {
            var license = await _repository.GetByIdAsync(id);
            return license != null ? MapToDto(license) : null;
        }

        public async Task<List<LicenseResponseDto>> GetFilteredLicensesAsync(LicenseFilterDto filter)
        {
            var licenses = await _repository.GetFilteredAsync(filter);
            return licenses.Select(MapToDto).ToList();
        }

        public async Task<LicenseResponseDto> CreateLicenseAsync(CreateLicenseDto dto)
        {
            // Ablaufdatum berechnen
            var expirationDate = dto.PurchaseDate.AddMonths(dto.LicenseDurationMonths);

            // Status bestimmen
            var status = GetStatus(expirationDate);

            var license = new License
            {
                LicenseName = dto.LicenseName,
                LicenseKey = dto.LicenseKey,
                PurchasedCount = dto.PurchasedCount,
                DepartmentId = dto.DepartmentId,
                PurchaseDate = dto.PurchaseDate,
                LicenseDurationMonths = dto.LicenseDurationMonths,
                ExpirationDate = expirationDate,
                RenewalType = dto.RenewalType,
                ExecutableFile = dto.ExecutableFile,
                SearchKeywords = dto.SearchKeywords,
                Description = dto.Description,
                Status = status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(license);
            var full = await _repository.GetByIdAsync(created.Id);
            return MapToDto(full!);
        }

        public async Task<LicenseResponseDto?> UpdateLicenseAsync(int id, UpdateLicenseDto dto)
        {
            var license = await _repository.GetByIdAsync(id);
            if (license == null) return null;

            // Nur Felder updaten die mitgegeben wurden
            if (dto.LicenseName != null) license.LicenseName = dto.LicenseName;
            if (dto.LicenseKey != null) license.LicenseKey = dto.LicenseKey;
            if (dto.PurchasedCount.HasValue) license.PurchasedCount = dto.PurchasedCount.Value;
            if (dto.DepartmentId.HasValue) license.DepartmentId = dto.DepartmentId.Value;
            if (dto.PurchaseDate.HasValue) license.PurchaseDate = dto.PurchaseDate.Value;

            if (dto.LicenseDurationMonths.HasValue)
            {
                license.LicenseDurationMonths = dto.LicenseDurationMonths.Value;
                license.ExpirationDate = license.PurchaseDate.AddMonths(dto.LicenseDurationMonths.Value);
            }

            if (dto.RenewalType != null) license.RenewalType = dto.RenewalType;
            if (dto.ExecutableFile != null) license.ExecutableFile = dto.ExecutableFile;
            if (dto.SearchKeywords != null) license.SearchKeywords = dto.SearchKeywords;
            if (dto.Description != null) license.Description = dto.Description;

            // Status neu berechnen
            license.Status = dto.Status ?? GetStatus(license.ExpirationDate);
            license.UpdatedAt = DateTime.UtcNow;

            var updated = await _repository.UpdateAsync(id, license);
            return updated != null ? MapToDto(updated) : null;
        }

        public async Task<bool> DeleteLicenseAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        public async Task UpdateLicenseStatusesAsync()
        {
            // Background Job: Alle Lizenz-Status aktualisieren
            var licenses = await _repository.GetAllAsync();

            foreach (var license in licenses)
            {
                var newStatus = GetStatus(license.ExpirationDate);
                if (license.Status != newStatus)
                {
                    license.Status = newStatus;
                    license.UpdatedAt = DateTime.UtcNow;
                    await _repository.UpdateAsync(license.Id, license);
                }
            }
        }

        // Helper: Status berechnen
        private string GetStatus(DateTime expirationDate)
        {
            var daysUntil = (expirationDate - DateTime.UtcNow).TotalDays;

            if (daysUntil < 0) return "Expired";
            if (daysUntil <= 30) return "ExpiringSoon";
            return "Active";
        }

        // Helper: Entity zu DTO
        private LicenseResponseDto MapToDto(License license)
        {
            return new LicenseResponseDto
            {
                Id = license.Id,
                LicenseName = license.LicenseName,
                LicenseKey = license.LicenseKey,
                PurchasedCount = license.PurchasedCount,
                DepartmentId = license.DepartmentId,
                DepartmentName = license.Department?.Name ?? "Unknown",
                PurchaseDate = license.PurchaseDate,
                LicenseDurationMonths = license.LicenseDurationMonths,
                ExpirationDate = license.ExpirationDate,
                RenewalType = license.RenewalType,
                ExecutableFile = license.ExecutableFile,
                SearchKeywords = license.SearchKeywords,
                Description = license.Description,
                Status = license.Status,
                CreatedAt = license.CreatedAt,
                UpdatedAt = license.UpdatedAt,
                DocumentCount = license.Documents?.Count ?? 0
            };
        }
    }
}   
