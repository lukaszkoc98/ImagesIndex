﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.ViewModel;
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
        public ImageController(IImageService imageService, IImageSettings imageSettings)
        {
            _imageService = imageService;
            _imageSettings = imageSettings;
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

            var dbPath = Path.Combine(_imageSettings.ImagesFolderName, title);

            using (var fileStream = new FileStream(dbPath, FileMode.Create))
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
