using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.Repositories;

namespace LicenseManagementTool_API.Services
{
    public interface IDepartmentService
    {
        Task<List<DepartmentResponseDto>> GetAllDepartmentsAsync();
        Task<DepartmentResponseDto?> GetDepartmentByIdAsync(int id);
        Task<DepartmentResponseDto> CreateDepartmentAsync(CreateDepartmentDto dto);
        Task<DepartmentResponseDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto);
        Task<bool> DeleteDepartmentAsync(int id);
    }

    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _repository;

        public DepartmentService(IDepartmentRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<DepartmentResponseDto>> GetAllDepartmentsAsync()
        {
            var departments = await _repository.GetAllAsync();
            return departments.Select(MapToDto).ToList();
        }

        public async Task<DepartmentResponseDto?> GetDepartmentByIdAsync(int id)
        {
            var department = await _repository.GetByIdAsync(id);
            return department != null ? MapToDto(department) : null;
        }

        public async Task<DepartmentResponseDto> CreateDepartmentAsync(CreateDepartmentDto dto)
        {
            var department = new Department
            {
                Name = dto.Name
            };

            var created = await _repository.CreateAsync(department);
            var full = await _repository.GetByIdAsync(created.Id);
            return MapToDto(full!);
        }

        public async Task<DepartmentResponseDto?> UpdateDepartmentAsync(int id, UpdateDepartmentDto dto)
        {
            var department = await _repository.GetByIdAsync(id);
            if (department == null)
                return null;

            if (dto.Name != null)
                department.Name = dto.Name;

            var updated = await _repository.UpdateAsync(id, department);
            return updated != null ? MapToDto(updated) : null;
        }

        public async Task<bool> DeleteDepartmentAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        private DepartmentResponseDto MapToDto(Department department)
        {
            return new DepartmentResponseDto
            {
                Id = department.Id,
                Name = department.Name,
                UserCount = department.Users?.Count ?? 0,
                LicenseCount = department.Licenses?.Count ?? 0
            };
        }
    }
}
