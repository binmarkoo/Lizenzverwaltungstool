using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.Repositories;

namespace LicenseManagementTool_API.Services
{
    public interface IRoleService
    {
        Task<List<RoleResponseDto>> GetAllRolesAsync();
        Task<RoleResponseDto?> GetRoleByIdAsync(int id);
    }

    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _repository;

        public RoleService(IRoleRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<RoleResponseDto>> GetAllRolesAsync()
        {
            var roles = await _repository.GetAllAsync();
            return roles.Select(MapToDto).ToList();
        }

        public async Task<RoleResponseDto?> GetRoleByIdAsync(int id)
        {
            var role = await _repository.GetByIdAsync(id);
            return role != null ? MapToDto(role) : null;
        }

        private RoleResponseDto MapToDto(Role role)
        {
            return new RoleResponseDto
            {
                Id = role.Id,
                Name = role.Name,
                UserCount = role.Users?.Count ?? 0
            };
        }
    }
}
