using ExifLibrary;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.Enums;
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
using static ExifLibrary.MathEx;

namespace PhotoCatalog.Service.Services
{
    public interface IImageService
    {
        ImageDTO GetImageData(string imagePath);
        IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<ImageDTO> imagesPaths);
        IEnumerable<ImageDTO> GetAllImages();
        IEnumerable<ImageDTO> FilterSortImages(IEnumerable<ImageDTO> images, ImageGroupDTO param);
        Task<ImageDTO> UpdateTags(UpdateImageVM model);
        Task UpdateMultipleImagesTags(UpdateMultipleImagesVM model);
        Task<ImageDTO> DeleteImage(string imagePath);
        Task LoadImage(string path);
        int GetFilesCount();
        IEnumerable<string> GetAllModels();
        IEnumerable<string> GetAllMakes();
        IEnumerable<ImageLocationDTO> GetAllImagesLocationInfo();
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
            try
            {
                imagePath = imagePath.Replace("\\\\", "\\");
                return _fileInfoStoreService.Images.Where(x => x.Path == imagePath).FirstOrDefault();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public IEnumerable<ImageDTO> GetAllImages()
        {
            return _fileInfoStoreService.Images;
        }

        public IEnumerable<ImageDTO> FilterSortImages(IEnumerable<ImageDTO> images, ImageGroupDTO param)
        {
            if (param == null)
                return images;

            if (param.ApertureMin != null && param.ApertureMax != null)
                images = images.Where(x => x.Aperture >= param.ApertureMin && x.Aperture <= param.ApertureMax);
            else if (param.ApertureMin != null)
                images = images.Where(x => x.Aperture >= param.ApertureMin);
            else if (param.ApertureMax != null)
                images = images.Where(x => x.Aperture <= param.ApertureMax || x.Aperture == null);

            if (param.Makes != null)
                images = images.Where(x =>
                    param.Makes.Any(y =>
                        (x.Make != null ? x.Make.ToUpper() : null) == (y != null ? y.ToUpper() : null)));

            if (param.Models != null)
                images = images.Where(x => param.Models.Any(y =>
                    (x.Model != null ? x.Model.ToUpper() : null) == (y != null ? y.ToUpper() : null)));

            if (param.ExposureTimeMin != null && param.ExposureTimeMax != null)
                images = images.Where(x =>
                    x.ExposureTime >= param.ExposureTimeMin && x.ExposureTime <= param.ExposureTimeMax);
            else if (param.ExposureTimeMin != null)
                images = images.Where(x => x.ExposureTime >= param.ExposureTimeMin);
            else if (param.ExposureTimeMax != null)
                images = images.Where(x => x.ExposureTime <= param.ExposureTimeMax || x.ExposureTime == null);

            if (param.FocalLengthMin != null && param.FocalLengthMax != null)
                images = images.Where(x =>
                    x.FocalLength >= param.FocalLengthMin && x.FocalLength <= param.FocalLengthMax);
            else if (param.FocalLengthMin != null)
                images = images.Where(x => x.FocalLength >= param.FocalLengthMin);
            else if (param.FocalLengthMax != null)
                images = images.Where(x => x.FocalLength <= param.FocalLengthMax || x.FocalLength == null);

            if (param.FlashMin != null && param.FlashMax != null)
                images = images.Where(x => x.Flash >= param.FlashMin && x.Flash <= param.FlashMax);
            else if (param.FlashMin != null)
                images = images.Where(x => x.Flash >= param.FlashMin);
            else if (param.FlashMax != null)
                images = images.Where(x => x.Flash <= param.FlashMax || x.Flash == null);

            switch (param.SortType)
            {
                case SortEnum.NameASC:
                    images = images.OrderBy(x => Path.GetFileName(x.Path));
                    break;
                case SortEnum.NameDESC:
                    images = images.OrderByDescending(x => Path.GetFileName(x.Path));
                    break;
                case SortEnum.ModifyDateASC:
                    images = images.OrderBy(x => x.ModifyDate);
                    break;
                case SortEnum.ModifyDateDESC:
                    images = images.OrderByDescending(x => x.ModifyDate);
                    break;
                case SortEnum.FocalLengthASC:
                    images = images.OrderBy(x => x.FocalLength);
                    break;
                case SortEnum.FocalLengthDESC:
                    images = images.OrderByDescending(x => x.FocalLength);
                    break;
                case SortEnum.ExposureTimeASC:
                    images = images.OrderBy(x => x.ExposureTime);
                    break;
                case SortEnum.ExposureTimeDESC:
                    images = images.OrderByDescending(x => x.ExposureTime);
                    break;
                default:
                    break;
            }

            return images;
        }


        public IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<ImageDTO> images)
        {
            var result = new List<ImageMiniatureDTO>();

            foreach (var image in images)
            {
                var img = Image.FromFile(image.Path);
                var resizedImage = ImageHelper.ResizeImage(img,
                    new Size(_imageSettings.MaxMiniatureSize, _imageSettings.MaxMiniatureSize));

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
                        Longitude = image.Longitude,
                        Make = image.Make,
                        Model = image.Model
                    });
                }

                resizedImage.Dispose();
                img.Dispose();
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
                file.Properties.Set(ExifTag.GPSLongitudeRef,
                    model.Longitude.Value > 0 ? GPSLongitudeRef.East : GPSLongitudeRef.West);
            }

            if (model.Latitude.HasValue)
            {
                var coordLat = GetLocationInDegrees(model.Latitude.Value);
                file.Properties.Set(ExifTag.GPSLatitude, coordLat.Degrees, coordLat.Minutes, coordLat.Seconds);
                file.Properties.Set(ExifTag.GPSLatitudeRef,
                    model.Latitude.Value > 0 ? GPSLatitudeRef.North : GPSLatitudeRef.South);
            }

            if (model.Aperture.HasValue)
            {
                file.Properties.Set(ExifTag.ApertureValue, model.Aperture.Value);
            }

            if (model.ExposureTime.HasValue)
            {
                file.Properties.Set(ExifTag.ExposureTime, new UFraction32(1, (uint) model.ExposureTime.Value));
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
                file.Properties.Set(ExifTag.Flash, (Flash) model.Flash.Value);
            }

            if (model.Width.HasValue)
            {
                file.Properties.Set(ExifTag.ImageWidth, model.Width.Value);
            }

            if (model.Height.HasValue)
            {
                file.Properties.Set(ExifTag.ImageLength, model.Height.Value);
            }

            if (model.ISOSpeed.HasValue)
            {
                file.Properties.Set(ExifTag.ISOSpeedRatings, model.ISOSpeed.Value);
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

        public int GetFilesCount() => _fileInfoStoreService.Images.Count();

        public IEnumerable<ImageLocationDTO> GetAllImagesLocationInfo() => _fileInfoStoreService.Images.Select(x =>
            new ImageLocationDTO
            {
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                Name = Path.GetFileName(x.Path)
            }).Where(x => x.Latitude != null && x.Longitude != null);

        public IEnumerable<string> GetAllModels() => _fileInfoStoreService.Images.Select(x => x.Model).Distinct();

        public IEnumerable<string> GetAllMakes() => _fileInfoStoreService.Images.Select(x => x.Make).Distinct();

        public async Task<ImageDTO> DeleteImage(string imagePath)
        {
            try
            {
                ImageDTO imageToDelete = this.GetImageData(imagePath);
                if (File.Exists(imagePath))
                {
                    File.Delete(imagePath);
                    _fileInfoStoreService.Images.Remove(imageToDelete);
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
            int sec = (int) Math.Round(abs * 3600);
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

        public async Task UpdateMultipleImagesTags(UpdateMultipleImagesVM model)
        {
            foreach (var path in model.Paths)
            {
                if (!File.Exists(path))
                {
                    throw new Exception($"Not found on {path}");
                }

                var file = await ImageFile.FromFileAsync(path);


                if (model.Longitude.HasValue)
                {
                    var coordLong = GetLocationInDegrees(model.Longitude.Value);
                    file.Properties.Set(ExifTag.GPSLongitude, coordLong.Degrees, coordLong.Minutes, coordLong.Seconds);
                    file.Properties.Set(ExifTag.GPSLongitudeRef,
                        model.Longitude.Value > 0 ? GPSLongitudeRef.East : GPSLongitudeRef.West);
                }

                if (model.Latitude.HasValue)
                {
                    var coordLat = GetLocationInDegrees(model.Latitude.Value);
                    file.Properties.Set(ExifTag.GPSLatitude, coordLat.Degrees, coordLat.Minutes, coordLat.Seconds);
                    file.Properties.Set(ExifTag.GPSLatitudeRef,
                        model.Latitude.Value > 0 ? GPSLatitudeRef.North : GPSLatitudeRef.South);
                }

                if (model.Aperture.HasValue)
                {
                    file.Properties.Set(ExifTag.ApertureValue, model.Aperture.Value);
                }

                if (model.ExposureTime.HasValue)
                {
                    file.Properties.Set(ExifTag.ExposureTime, new UFraction32(1, (uint) model.ExposureTime.Value));
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
                    file.Properties.Set(ExifTag.Flash, (Flash) model.Flash.Value);
                }

                if (model.Width.HasValue)
                {
                    file.Properties.Set(ExifTag.ImageWidth, model.Width.Value);
                }

                if (model.Height.HasValue)
                {
                    file.Properties.Set(ExifTag.ImageLength, model.Height.Value);
                }

                if (model.ISOSpeed.HasValue)
                {
                    file.Properties.Set(ExifTag.ISOSpeedRatings, model.ISOSpeed.Value);
                }

                if (model.CreateDate.HasValue)
                {
                    file.Properties.Set(ExifTag.DateTimeOriginal, model.CreateDate.Value);
                }

                await file.SaveAsync(path);

                await _fileInfoStoreService.ReloadImageStoredData(path);
            }
        }
    }
}