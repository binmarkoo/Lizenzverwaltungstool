using LicenseManagementTool_API.DTOs;
using LicenseManagementTool_API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LicenseManagementTool_API.Controllers
{
    [ApiController]
    [Route("api/licenses/{licenseId}/documents")]
    [Produces("application/json")]
    [Authorize] // Alle eingeloggten User dürfen Dokumente sehen
    public class LicenseDocumentsController : ControllerBase
    {
        private readonly ILicenseDocumentService _documentService;
        private readonly ILogger<LicenseDocumentsController> _logger;

        public LicenseDocumentsController(ILicenseDocumentService documentService, ILogger<LicenseDocumentsController> logger)
        {
            _documentService = documentService;
            _logger = logger;
        }

        /// <summary>
        /// Gibt alle Dokumente einer Lizenz zurück
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<LicenseDocumentResponseDto>>> GetDocuments(int licenseId)
        {
            try
            {
                var docs = await _documentService.GetDocumentsByLicenseIdAsync(licenseId);
                return Ok(docs);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting documents for license {LicenseId}", licenseId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Lädt ein neues Dokument für eine Lizenz hoch
        /// Nur Admin und Editor dürfen hochladen
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Admin,Editor")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<LicenseDocumentResponseDto>> UploadDocument(int licenseId, [FromForm] UploadDocumentDto dto)
        {
            try
            {
                if (dto.File == null || dto.File.Length == 0)
                    return BadRequest(new { message = "No file uploaded" });

                var created = await _documentService.UploadDocumentAsync(licenseId, dto);
                if (created == null)
                    return NotFound(new { message = $"License with ID {licenseId} not found" });

                return CreatedAtAction(nameof(DownloadDocument), new { licenseId, id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading document for license {LicenseId}", licenseId);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Lädt ein Dokument herunter
        /// </summary>
        [HttpGet("{id}/download")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DownloadDocument(int licenseId, int id)
        {
            try
            {
                var download = await _documentService.DownloadDocumentAsync(id);
                if (download == null)
                    return NotFound(new { message = $"Document with ID {id} not found" });

                var (fileData, fileName) = download.Value;
                return File(fileData, GetContentType(fileName), fileName);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error downloading document {DocumentId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Löscht ein Dokument
        /// Nur Admin und Editor
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Editor")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> DeleteDocument(int licenseId, int id)
        {
            try
            {
                var success = await _documentService.DeleteDocumentAsync(id);
                if (!success)
                    return NotFound(new { message = $"Document with ID {id} not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting document {DocumentId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        private string GetContentType(string fileName)
        {
            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return ext switch
            {
                ".pdf" => "application/pdf",
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "application/octet-stream"
            };
        }
    }
}