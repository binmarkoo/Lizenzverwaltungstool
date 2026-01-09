using LicenseManagementTool_API.Data;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace LicenseManagementTool_API.Repositories
{
    public interface ILicenseRepository
    {
        Task<List<License>> GetAllAsync();
        Task<License?> GetByIdAsync(int id);
        Task<List<License>> GetFilteredAsync(LicenseFilterDto filter);
        Task<License> CreateAsync(License license);
        Task<License?> UpdateAsync(int id, License license);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

    public class LicenseRepository : ILicenseRepository
    {
        private readonly ApplicationDbContext _context;

        public LicenseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<License>> GetAllAsync()
        {
            return await _context.Licenses
                .Include(l => l.Department)
                .Include(l => l.Documents)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync();
        }

        public async Task<License?> GetByIdAsync(int id)
        {
            return await _context.Licenses
                .Include(l => l.Department)
                .Include(l => l.Documents)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<List<License>> GetFilteredAsync(LicenseFilterDto filter)
        {
            var query = _context.Licenses
                .Include(l => l.Department)
                .Include(l => l.Documents)
                .AsQueryable();

            // Filter nach Lizenzname
            if (!string.IsNullOrWhiteSpace(filter.LicenseName))
            {
                query = query.Where(l => l.LicenseName.Contains(filter.LicenseName));
            }

            // Filter nach Abteilung
            if (filter.DepartmentId.HasValue)
            {
                query = query.Where(l => l.DepartmentId == filter.DepartmentId.Value);
            }

            // Filter nach ausführbarer Datei
            if (!string.IsNullOrWhiteSpace(filter.ExecutableFile))
            {
                query = query.Where(l => l.ExecutableFile != null &&
                                        l.ExecutableFile.Contains(filter.ExecutableFile));
            }

            // Filter nach Suchbegriff
            if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
            {
                query = query.Where(l => l.SearchKeywords != null &&
                                        l.SearchKeywords.Contains(filter.SearchKeyword));
            }

            // Filter nach Verlängerungstyp
            if (!string.IsNullOrWhiteSpace(filter.RenewalType))
            {
                query = query.Where(l => l.RenewalType == filter.RenewalType);
            }

            // Filter nach Status
            if (!string.IsNullOrWhiteSpace(filter.Status))
            {
                query = query.Where(l => l.Status == filter.Status);
            }

            // Filter nach Kaufdatum (von)
            if (filter.PurchaseDateFrom.HasValue)
            {
                query = query.Where(l => l.PurchaseDate >= filter.PurchaseDateFrom.Value);
            }

            // Filter nach Kaufdatum (bis)
            if (filter.PurchaseDateTo.HasValue)
            {
                query = query.Where(l => l.PurchaseDate <= filter.PurchaseDateTo.Value);
            }

            return await query.OrderByDescending(l => l.CreatedAt).ToListAsync();
        }

        public async Task<License> CreateAsync(License license)
        {
            _context.Licenses.Add(license);
            await _context.SaveChangesAsync();
            return license;
        }

        public async Task<License?> UpdateAsync(int id, License license)
        {
            var existingLicense = await _context.Licenses.FindAsync(id);
            if (existingLicense == null)
                return null;

            // Update properties
            existingLicense.LicenseName = license.LicenseName;
            existingLicense.LicenseKey = license.LicenseKey;
            existingLicense.PurchasedCount = license.PurchasedCount;
            existingLicense.DepartmentId = license.DepartmentId;
            existingLicense.PurchaseDate = license.PurchaseDate;
            existingLicense.LicenseDurationMonths = license.LicenseDurationMonths;
            existingLicense.ExpirationDate = license.ExpirationDate;
            existingLicense.RenewalType = license.RenewalType;
            existingLicense.ExecutableFile = license.ExecutableFile;
            existingLicense.SearchKeywords = license.SearchKeywords;
            existingLicense.Description = license.Description;
            existingLicense.Status = license.Status;
            existingLicense.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existingLicense;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var license = await _context.Licenses.FindAsync(id);
            if (license == null)
                return false;

            _context.Licenses.Remove(license);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Licenses.AnyAsync(l => l.Id == id);
        }
    }
}