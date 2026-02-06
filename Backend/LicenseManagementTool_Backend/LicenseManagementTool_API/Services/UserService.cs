using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.Repositories;

namespace LicenseManagementTool_API.Services
{
    public interface IUserService
    {
        Task<List<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto?> GetUserByIdAsync(int id);
        Task<UserResponseDto?> GetUserByEmailAsync(string email);
        Task<UserResponseDto> CreateUserAsync(CreateUserDto dto);
        Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto);
        Task<bool> DeleteUserAsync(int id);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserResponseDto>> GetAllUsersAsync()
        {
            var users = await _repository.GetAllAsync();
            return users.Select(MapToDto).ToList();
        }

        public async Task<UserResponseDto?> GetUserByIdAsync(int id)
        {
            var user = await _repository.GetByIdAsync(id);
            return user != null ? MapToDto(user) : null;
        }

        public async Task<UserResponseDto?> GetUserByEmailAsync(string email)
        {
            var user = await _repository.GetByEmailAsync(email);
            return user != null ? MapToDto(user) : null;
        }

        public async Task<UserResponseDto> CreateUserAsync(CreateUserDto dto)
        {
            // Check if E-Mail already exists
            if (await _repository.EmailExistsAsync(dto.Email))
            {
                throw new InvalidOperationException($"Email '{dto.Email}' already exists");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password), //Hashing the password on creation
                RoleId = dto.RoleId,
                DepartmentId = dto.DepartmentId,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _repository.CreateAsync(user);
            var full = await _repository.GetByIdAsync(created.Id);
            return MapToDto(full!);
        }

        public async Task<UserResponseDto?> UpdateUserAsync(int id, UpdateUserDto dto)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null)
                return null;

            // Email-Check bei Änderung
            if (dto.Email != null && dto.Email != user.Email)
            {
                if (await _repository.EmailExistsAsync(dto.Email))
                {
                    throw new InvalidOperationException($"Email '{dto.Email}' already exists");
                }
                user.Email = dto.Email;
            }

            if (dto.Name != null) user.Name = dto.Name;
            if (dto.Password != null) user.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            if (dto.RoleId.HasValue) user.RoleId = dto.RoleId.Value;
            if (dto.DepartmentId.HasValue) user.DepartmentId = dto.DepartmentId.Value;

            var updated = await _repository.UpdateAsync(id, user);
            return updated != null ? MapToDto(updated) : null;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        private UserResponseDto MapToDto(User user)
        {
            return new UserResponseDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                RoleId = user.RoleId,
                RoleName = user.Role?.Name ?? "Unknown",
                DepartmentId = user.DepartmentId,
                DepartmentName = user.Department?.Name ?? "Unknown",
                CreatedAt = user.CreatedAt
            };
        }
    }
}
