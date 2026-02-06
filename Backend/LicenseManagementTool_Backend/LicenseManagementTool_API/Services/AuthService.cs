using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Models;
using LicenseManagementTool_API.Repositories;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace LicenseManagementTool_API.Services
{
    public interface IAuthService
    {
        Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginDto);
        string GenerateJwtToken(User user);
    }

    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto loginDto)
        {
            // Find the User by his Email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
            {
                return null; // User not found
            }

            // Check Password (BCrypt)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password);
            if (!isPasswordValid)
            {
                return null; // wrong Password
            }

            // Generate JWT Token
            var token = GenerateJwtToken(user);
            var expiresAt = DateTime.UtcNow.AddHours(
                _configuration.GetValue<int>("JwtSettings:ExpirationHours")
            );

            // Response with Token and User Info
            return new LoginResponseDto
            {
                Token = token,
                ExpiresAt = expiresAt,
                User = new UserInfoDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    RoleName = user.Role?.Name ?? "Unknown",
                    RoleId = user.RoleId,
                    DepartmentName = user.Department?.Name,
                    DepartmentId = user.DepartmentId
                }
            };
        }

        public string GenerateJwtToken(User user)
        {
            // JWT Claims (Payload)
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? "Viewer"),
                new Claim("DepartmentId", user.DepartmentId.ToString())
            };

            // Secret Key aus appsettings.json
            var secretKey = _configuration["JwtSettings:Secret"]
                ?? throw new InvalidOperationException("JWT Secret not configured");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Token erstellen
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(
                    _configuration.GetValue<int>("JwtSettings:ExpirationHours")
                ),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
