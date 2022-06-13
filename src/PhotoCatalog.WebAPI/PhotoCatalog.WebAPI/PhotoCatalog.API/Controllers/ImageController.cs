using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.ViewModel;
using PhotoCatalog.Service.Services;
using PhotoCatalog.Settings.Configurations;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using PhotoCatalog.Model.Enums;
using PhotoCatalog.Service.Models;

namespace PhotoCatalog.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageController : ControllerBase
    {
        private readonly IImageService _imageService;
        private readonly IImageSettings _imageSettings;
        public ImageController(IImageService imageService, IImageSettings imageSettings)
        {
            _imageService = imageService;
            _imageSettings = imageSettings;
        }

        [HttpPost]
        [Route("upload-file")]
        public async Task<IActionResult> UploadProfilePicture([FromForm(Name = "imageFile")] IFormFile file,
            [FromForm(Name = "title")] string title)
        {
            if (file == null || file.Length == 0)
                return BadRequest();

            if (!Directory.Exists(_imageSettings.ImagesFolderName))
            {
                Directory.CreateDirectory(_imageSettings.ImagesFolderName);
            }

            var dbPath = Path.Combine(_imageSettings.ImagesFolderName, title);

            using (var fileStream = new FileStream(dbPath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            await _imageService.LoadImage(dbPath);

            return Ok(dbPath);
        }

        [HttpDelete]
        [Route("{imagePath}")]
        public async Task<ActionResult<ImageDTO>> DeletePicture([FromQuery(Name = "path")] string path)
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

        [HttpPost]
        public IActionResult GetMiniatures([FromBody] ImageGroupDTO param)
        {
            var images = _imageService.GetAllImages();
            var reduceImages = _imageService.FilterSortImages(images, param);
            var miniatures = _imageService.GetImagesMiniatures(reduceImages);
            if (param == null)
            {
                return Ok(PaginatedList<ImageMiniatureDTO>.Create(miniatures, 1,
                    _imageSettings.DefaultImagesOnPageNumber));
            }

            var result = PaginatedList<ImageMiniatureDTO>.Create(miniatures, param.PageIndex, param.PageSize);

            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<ImageDTO>> Update([FromBody] UpdateImageVM model)
        {
            return Ok(await _imageService.UpdateTags(model));
        }

        [HttpGet]
        [Route("path")]
        public IActionResult GetImageByPath([FromQuery] string path)
        {
            if (String.IsNullOrEmpty(path))
            {
                return BadRequest("Path is invalid");
            }

            var image = _imageService.GetImageData(path);
            return Ok(image);
        }

        [HttpGet]
        [Route("imagesCount")]
        public IActionResult GetImagesCount()
        {
            var count = _imageService.GetFilesCount();
            return Ok(count);
        }

        [HttpGet]
        [Route("models")]
        public IActionResult GetModels()
        {
            var models = _imageService.GetAllModels();
            return Ok(models);
        }

        [HttpGet]
        [Route("makes")]
        public IActionResult GetMakes()
        {
            var models = _imageService.GetAllMakes();
            return Ok(models);
        }
    }
}