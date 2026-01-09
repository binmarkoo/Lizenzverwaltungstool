using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace LicenseManagementTool_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LicensesController : ControllerBase
    {
        private readonly ILicenseService _licenseService;
        private readonly ILogger<LicensesController> _logger;

        public LicensesController(
            ILicenseService licenseService,
            ILogger<LicensesController> logger)
        {
            _licenseService = licenseService;
            _logger = logger;
        }

        /// <summary>
        /// Gibt alle Lizenzen zurück
        /// </summary>
        /// <returns>Liste aller Lizenzen</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<LicenseResponseDto>>> GetAllLicenses()
        {
            try
            {
                var licenses = await _licenseService.GetAllLicensesAsync();
                return Ok(licenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all licenses");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gibt eine spezifische Lizenz anhand der ID zurück
        /// </summary>
        /// <param name="id">Lizenz ID</param>
        /// <returns>Lizenz Details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<LicenseResponseDto>> GetLicenseById(int id)
        {
            try
            {
                var license = await _licenseService.GetLicenseByIdAsync(id);

                if (license == null)
                    return NotFound(new { message = $"License with ID {id} not found" });

                return Ok(license);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting license by ID {LicenseId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Sucht und filtert Lizenzen basierend auf verschiedenen Kriterien
        /// </summary>
        /// <param name="filter">Filter-Parameter</param>
        /// <returns>Gefilterte Lizenzen</returns>
        [HttpPost("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<LicenseResponseDto>>> SearchLicenses(
            [FromBody] LicenseFilterDto filter)
        {
            try
            {
                var licenses = await _licenseService.GetFilteredLicensesAsync(filter);
                return Ok(licenses);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error searching licenses");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Erstellt eine neue Lizenz
        /// Requires: Admin oder Editor Rolle
        /// </summary>
        /// <param name="dto">Lizenz Daten</param>
        /// <returns>Erstellte Lizenz</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LicenseResponseDto>> CreateLicense(
            [FromBody] CreateLicenseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var createdLicense = await _licenseService.CreateLicenseAsync(dto);

                return CreatedAtAction(
                    nameof(GetLicenseById),
                    new { id = createdLicense.Id },
                    createdLicense
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating license");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Aktualisiert eine bestehende Lizenz
        /// Requires: Admin oder Editor Rolle
        /// </summary>
        /// <param name="id">Lizenz ID</param>
        /// <param name="dto">Aktualisierte Daten</param>
        /// <returns>Aktualisierte Lizenz</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<LicenseResponseDto>> UpdateLicense(
            int id,
            [FromBody] UpdateLicenseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updatedLicense = await _licenseService.UpdateLicenseAsync(id, dto);

                if (updatedLicense == null)
                    return NotFound(new { message = $"License with ID {id} not found" });

                return Ok(updatedLicense);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating license {LicenseId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Löscht eine Lizenz
        /// Requires: Admin Rolle
        /// </summary>
        /// <param name="id">Lizenz ID</param>
        /// <returns>No Content</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteLicense(int id)
        {
            try
            {
                var result = await _licenseService.DeleteLicenseAsync(id);

                if (!result)
                    return NotFound(new { message = $"License with ID {id} not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting license {LicenseId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }

    // TODO: Add cronjob
    /*[HttpPost("update-statuses")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateLicenseStatuses()
    {
        try
        {
            await _licenseService.UpdateLicenseStatusesAsync();
            return Ok(new { message = "License statuses updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating license statuses");
            return StatusCode(500, new { message = "Internal server error" });
        }
    }*/
}
