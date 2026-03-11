using LicenseManagementTool_API.Data;
using LicenseManagementTool_API.Models;
using Microsoft.EntityFrameworkCore;

namespace LicenseManagementTool_API.Repositories
{
    public interface ILicenseDocumentRepository
    {
        Task<List<LicenseDocument>> GetByLicenseIdAsync(int licenseId);
        Task<LicenseDocument?> GetByIdAsync(int id);
        Task<LicenseDocument> CreateAsync(LicenseDocument document);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }

    public class LicenseDocumentRepository : ILicenseDocumentRepository
    {
        private readonly ApplicationDbContext _context;

        public LicenseDocumentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<LicenseDocument>> GetByLicenseIdAsync(int licenseId)
        {
            return await _context.LicenseDocuments
                .Where(d => d.LicenseId == licenseId)
                .OrderByDescending(d => d.UploadedAt)
                .ToListAsync();
        }

        public async Task<LicenseDocument?> GetByIdAsync(int id)
        {
            return await _context.LicenseDocuments.FindAsync(id);
        }

        public async Task<LicenseDocument> CreateAsync(LicenseDocument document)
        {
            _context.LicenseDocuments.Add(document);
            await _context.SaveChangesAsync();
            return document;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var document = await _context.LicenseDocuments.FindAsync(id);
            if (document == null)
            {
                return false;
            }
            _context.LicenseDocuments.Remove(document);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.LicenseDocuments.AnyAsync(d => d.Id == id);
        }
    }
}
