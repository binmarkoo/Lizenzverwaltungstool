using LicenseManagementTool_API.Data;
using LicenseManagementTool_API.Models;
using Microsoft.EntityFrameworkCore;

namespace LicenseManagementTool_API.Repositories
{
    public interface IRoleRepository
    {
        Task<List<Role>> GetAllAsync();
        Task<Role?> GetByIdAsync(int id);
    }

    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;

        public RoleRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Role>> GetAllAsync()
        {
            return await _context.Roles
                .Include(r => r.Users)
                .OrderBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<Role?> GetByIdAsync(int id)
        {
            return await _context.Roles
                .Include(r => r.Users)
                .FirstOrDefaultAsync(r => r.Id == id);
        }
    }
}
