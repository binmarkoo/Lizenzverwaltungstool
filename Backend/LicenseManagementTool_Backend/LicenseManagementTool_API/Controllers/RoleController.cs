using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LicenseManagementTool_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;
        private readonly ILogger<RolesController> _logger;

        public RolesController(IRoleService roleService, ILogger<RolesController> logger)
        {
            _roleService = roleService;
            _logger = logger;
        }

        /// <summary>
        /// Gibt alle Rollen zurück (Read-Only)
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<RoleResponseDto>>> GetAll()
        {
            try
            {
                var roles = await _roleService.GetAllRolesAsync();
                return Ok(roles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting roles");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gibt eine spezifische Rolle zurück (Read-Only)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleResponseDto>> GetById(int id)
        {
            try
            {
                var role = await _roleService.GetRoleByIdAsync(id);
                if (role == null)
                    return NotFound(new { message = $"Role with ID {id} not found" });
                return Ok(role);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting role");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}
