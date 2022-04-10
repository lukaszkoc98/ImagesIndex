using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoCatalog.Service.Services;
using PhotoCatalog.Settings.Configurations;
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
        private readonly IImageSettings _imageSettings;
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

            if (!Directory.Exists(_imageSettings.ImagesFolderName))
            {
                Directory.CreateDirectory(_imageSettings.ImagesFolderName);
            }

            var uniqueFileName = $"{title}.jpg";
            var dbPath = Path.Combine(_imageSettings.ImagesFolderName, uniqueFileName);

            using (var fileStream = new FileStream(Path.Combine(_imageSettings.ImagesFolderName, uniqueFileName), FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return Ok(dbPath);
        }

        //Do parametrów dodać [FromQuery] KlasaModelu model
        //Trzeba dodać filtrowanie
        [HttpGet]
        public IActionResult GetMiniatures()
        {

            var images = _imageService.GetAllImages();
            var miniatures = _imageService.GetImagesMiniatures(images);
            return Ok(miniatures);
        }
    }
}
