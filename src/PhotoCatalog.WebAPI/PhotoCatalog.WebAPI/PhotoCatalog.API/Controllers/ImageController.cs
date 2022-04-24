using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.ViewModel;
using PhotoCatalog.Service.Services;
using PhotoCatalog.Settings.Configurations;
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

            using (var fileStream = new FileStream(dbPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            await _imageService.LoadImage(dbPath);

            return Ok(dbPath);
        }

        [HttpDelete]
        [Route("{imagePath}")]
        public async Task<ActionResult<ImageDTO>> DeletePicture( 
            [FromForm(Name = "path")] string path
            )
        {
            try
            {
                return Ok(await _imageService.DeleteImage(path));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public IActionResult GetMiniatures([FromQuery] ImageGroupDTO param)
        {
            var images = _imageService.GetAllImages();
            var reduceImages = _imageService.FilterSortImages(images, param);
            var miniatures = _imageService.GetImagesMiniatures(reduceImages);
            var miniaturesPagin = miniatures.Skip((param.PageIndex - 1) * param.PageSize).Take(param.PageSize);

            return Ok(miniaturesPagin);
        }

        [HttpGet("test")]
        public ActionResult<string> GetImage()
        {
            return "image";
        }

        [HttpPut]
        public async Task<ActionResult<ImageDTO>> Update([FromBody] UpdateImageVM model)
        {
            return Ok(await _imageService.UpdateTags(model));
        }

        [HttpGet]
        [Route("path")]
        public IActionResult GetImageByPath([FromQuery]string path)
        {
            return Ok(_imageService.GetImageData(path));
        }
    }
}
