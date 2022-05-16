using ExifLibrary;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.Models;
using PhotoCatalog.Model.ViewModel;
using PhotoCatalog.Service.Helpers;
using PhotoCatalog.Settings.Configurations;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoCatalog.Service.Services
{
    public interface IImageService
    {
        ImageDTO GetImageData(string imagePath);
        IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<ImageDTO> imagesPaths);
        IEnumerable<ImageDTO> GetAllImages();
        Task<ImageDTO> UpdateTags(UpdateImageVM model);
        Task<ImageDTO> DeleteImage(string imagePath);
        Task LoadImage(string path);
    }

    public class ImageService : IImageService
    {
        private readonly IImageSettings _imageSettings;
        private readonly IFileInfoStoreService _fileInfoStoreService;

        public ImageService(IImageSettings imageSettings, IFileInfoStoreService fileInfoStoreService)
        {
            _imageSettings = imageSettings;
            _fileInfoStoreService = fileInfoStoreService;
        }

        public ImageDTO GetImageData(string imagePath)
        {
            imagePath = imagePath.Replace("\\\\", "\\");
            return _fileInfoStoreService.Images.Where(x => x.Path == imagePath).FirstOrDefault();
        }

        public IEnumerable<ImageDTO> GetAllImages()
        {
            return _fileInfoStoreService.Images;
        }


        public IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<ImageDTO> images)
        {
            var result = new List<ImageMiniatureDTO>();

            foreach (var image in images)
            {
                var img = Image.FromFile(image.Path);
                var resizedImage = ImageHelper.ResizeImage(img, new Size(_imageSettings.MaxMiniatureSize, _imageSettings.MaxMiniatureSize));

                using (MemoryStream m = new MemoryStream())
                {
                    resizedImage.Save(m, ImageFormat.Jpeg);
                    byte[] imageBytes = m.ToArray();

                    string base64String = $"data:image/jpeg;base64,{Convert.ToBase64String(imageBytes)}";

                    result.Add(new ImageMiniatureDTO
                    {
                        Name = Path.GetFileName(image.Path),
                        Path = image.Path,
                        StringData = base64String,
                        Latitude = image.Latitude,
                        Longitude = image.Longitude
                    });
                }
            }

            return result;
        }

        public async Task LoadImage(string path)
        {
            await _fileInfoStoreService.LoadImageData(path);
        }

        public async Task<ImageDTO> UpdateTags(UpdateImageVM model)
        {

            if (!File.Exists(model.Path))
            {
                throw new Exception($"Not found on {model.Path}");
            }

            var file = await ImageFile.FromFileAsync(model.Path);


            if (model.Longitude.HasValue)
            {
                var coordLong = GetLocationInDegrees(model.Longitude.Value);
                file.Properties.Set(ExifTag.GPSLongitude, coordLong.Degrees, coordLong.Minutes, coordLong.Seconds);
                file.Properties.Set(ExifTag.GPSLongitudeRef, model.Longitude.Value > 0 ? GPSLongitudeRef.East : GPSLongitudeRef.West);
            }

            if (model.Latitude.HasValue)
            {
                var coordLat = GetLocationInDegrees(model.Latitude.Value);
                file.Properties.Set(ExifTag.GPSLatitude, coordLat.Degrees, coordLat.Minutes, coordLat.Seconds);
                file.Properties.Set(ExifTag.GPSLatitudeRef, model.Latitude.Value > 0 ? GPSLatitudeRef.North : GPSLatitudeRef.South);
            }

            if (model.Aperture.HasValue)
            {
                file.Properties.Set(ExifTag.ApertureValue, model.Aperture.Value);
            }

            if (model.ExposureTime.HasValue)
            {
                file.Properties.Set(ExifTag.ExposureTime, model.ExposureTime.Value);
            }

            if (!string.IsNullOrEmpty(model.Model))
            {
                file.Properties.Set(ExifTag.Model, model.Model);
            }

            if (!string.IsNullOrEmpty(model.Make))
            {
                file.Properties.Set(ExifTag.ExposureTime, model.Make);
            }

            if (model.FocalLength.HasValue)
            {
                file.Properties.Set(ExifTag.FocalLength, model.FocalLength.Value);
            }

            if (model.Flash.HasValue)
            {
                file.Properties.Set(ExifTag.Flash, (Flash)model.Flash.Value);
            }

            if (model.Width.HasValue)
            {
                file.Properties.Set(ExifTag.PixelXDimension, model.Width.Value);
            }

            if (model.Height.HasValue)
            {
                file.Properties.Set(ExifTag.PixelYDimension, model.Height.Value);
            }

            if (model.ISOSpeed.HasValue)
            {
                file.Properties.Set(ExifTag.ISOSpeedRatings, (ushort)model.ISOSpeed.Value);
            }

            if (model.CreateDate.HasValue)
            {
                file.Properties.Set(ExifTag.DateTimeOriginal, model.CreateDate.Value);
            }

            await file.SaveAsync(model.Path);

            return await _fileInfoStoreService.ReloadImageStoredData(model.Path);
        }

        public IEnumerable<string> GetAllFilesPaths()
        {
            DynatreeItem di = new DynatreeItem(new DirectoryInfo(_imageSettings.ImagesFolderName));
            di.FillAllFilenames(_imageSettings.ImagesFolderName);
            return di.AllFilePaths;
        }

        public async Task<ImageDTO> DeleteImage(string imagePath)
        {           
            try
            {
                ImageDTO imageToDelete = this.GetImageData(imagePath);
                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                }
                return imageToDelete;
            }
            catch (Exception ex)
            {
                throw new Exception($"File not found {imagePath}");
            }            
        }

        private Coordinations GetLocationInDegrees(float coordinations)
        {
            var abs = Math.Abs(coordinations);
            int sec = (int)Math.Round(abs * 3600);
            int deg = sec / 3600;
            sec %= 3600;
            int min = sec / 60;
            sec %= 60;

            return new Coordinations
            {
                Degrees = deg,
                Minutes = min,
                Seconds = sec,
            };
        }
    }
}
