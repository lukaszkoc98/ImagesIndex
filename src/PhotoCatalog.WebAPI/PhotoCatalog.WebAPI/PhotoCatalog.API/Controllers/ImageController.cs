using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoCatalog.Service.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {

        private readonly IImageService _imageService;

        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost]
        [Route("upload-file")]
        public async Task<IActionResult> UploadProfilePicture([FromForm(Name = "imageFile")] IFormFile file, [FromForm(Name = "title")] string title)
        {
            if (file == null || file.Length == 0)
                return BadRequest();

            var folderName = Path.Combine("Resources", "Images");
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            if (!Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }

            var uniqueFileName = $"{Guid.NewGuid()}.jpg";
            var dbPath = Path.Combine(folderName, uniqueFileName);

            using (var fileStream = new FileStream(Path.Combine(filePath, uniqueFileName), FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return Ok(dbPath);
        }

        [HttpGet]
        public IActionResult GetMiniatures()
        {
            var paths = _imageService.GetAllFilesPaths();
            var miniatures = _imageService.GetImagesMiniatures(paths);
            return Ok(miniatures);
        }
    }
}
