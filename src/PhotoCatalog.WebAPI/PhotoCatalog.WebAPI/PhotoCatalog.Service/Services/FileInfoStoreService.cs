using ExifLibrary;
using PhotoCatalog.Model.Builder;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.Models;
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
    public interface IFileInfoStoreService
    {
        List<ImageDTO> Images { get; }
        Task LoadImageData(string path);
        IEnumerable<string> GetAllFilesPaths();
        Task<ImageDTO> GetImageData(string imagePath);
        Task<ImageDTO> ReloadImageStoredData(string path);
        void Initialize();
    }

    public class FileInfoStoreService : IFileInfoStoreService
    {
        public List<ImageDTO> Images { get; private set; }

        private readonly IImageSettings _imageSettings;

        public FileInfoStoreService(IImageSettings imageSettings)
        {
            _imageSettings = imageSettings;
        }

        public void Initialize()
        {
            Images = new List<ImageDTO>();
            var tasks = new List<Task<ImageDTO>>();
            foreach (var path in GetAllFilesPaths())
            {
                tasks.Add(GetImageData(path));
            }
            Task.WaitAll(tasks.ToArray());
            foreach (var task in tasks)
            {
                Images.Add(task.Result);
            }
        }

        public IEnumerable<string> GetAllFilesPaths()
        {
            var imagesFolder = Directory.CreateDirectory(_imageSettings.ImagesFolderName);
            DynatreeItem di = new DynatreeItem(imagesFolder);
            di.FillAllFilenames(_imageSettings.ImagesFolderName);
            return di.AllFilePaths;
        }

        public async Task<ImageDTO> GetImageData(string imagePath)
        {
            if (!File.Exists(imagePath))
            {
                throw new Exception($"Not found on {imagePath}");
            }

            var builder = new ImageDataBuilder();

            var img = Image.FromFile(imagePath);
            var resizedImage = ImageHelper.ResizeImage(img, new Size(1000, 1000));

            using (MemoryStream m = new MemoryStream())
            {
                resizedImage.Save(m, ImageFormat.Jpeg);
                byte[] imageBytes = m.ToArray();

                string base64String = $"data:image/jpeg;base64,{Convert.ToBase64String(imageBytes)}";
                builder = builder.DataString(imageBytes);
            }


            builder = builder.Path(imagePath);

            var file = await ImageFile.FromFileAsync(imagePath);

            var apertureTag = file.Properties.Get<ExifURational>(ExifTag.ApertureValue);
            var exposureTimeTag = file.Properties.Get<ExifURational>(ExifTag.ExposureTime);
            var modelTag = file.Properties.Get<ExifAscii>(ExifTag.Model);
            var makeTag = file.Properties.Get<ExifAscii>(ExifTag.Make);
            var focalLengthTag = file.Properties.Get<ExifURational>(ExifTag.FocalLength);
            var flashTag = file.Properties.Get<ExifEnumProperty<Flash>>(ExifTag.Flash);
            var heightTag = file.Properties.Get<ExifUShort>(ExifTag.ImageLength);
            var widthTag = file.Properties.Get<ExifUShort>(ExifTag.ImageWidth); ;
            var isoSpeedTag = file.Properties.Get<ExifUShort>(ExifTag.ISOSpeedRatings); ;
            var dateTimeOriginalTag = file.Properties.Get<ExifDateTime>(ExifTag.DateTimeOriginal);
            var latitude = file.Properties.Get<GPSLatitudeLongitude>(ExifTag.GPSLatitude);
            var latitudeRef = file.Properties.Get<ExifEnumProperty<GPSLatitudeRef>>(ExifTag.GPSLatitudeRef);
            var longitude = file.Properties.Get<GPSLatitudeLongitude>(ExifTag.GPSLongitude);
            var longitudeRef = file.Properties.Get<ExifEnumProperty<GPSLongitudeRef>>(ExifTag.GPSLongitudeRef);
            
            float? latitudeValue = null, longitudeValue = null;
            if (latitudeRef != null && latitude != null)
            {
                latitudeValue = latitudeRef.Value == GPSLatitudeRef.North ? latitude.ToFloat() : latitude.ToFloat() * (-1);
            }

            if (longitudeRef != null && longitude != null)
            {
                longitudeValue = longitudeRef.Value == GPSLongitudeRef.East ? longitude.ToFloat() : longitude.ToFloat() * (-1);
            }

            builder = builder
                        .CreateDate(dateTimeOriginalTag != null ? dateTimeOriginalTag.Value : null)
                        .Model(modelTag != null ? modelTag.Value : null)
                        .Make(makeTag != null ? makeTag.Value : null)
                        .Aperture(apertureTag != null ? (double)apertureTag.Value : null)
                        .ExposureTime(exposureTimeTag != null ? (double)exposureTimeTag.Value : null)
                        .Flash(flashTag != null ? ((ushort)flashTag.Value) : null)
                        .FocalLength(focalLengthTag != null ? ((double)focalLengthTag.Value) : null)
                        .ISOSpeed(isoSpeedTag != null ? isoSpeedTag.Value : null)
                        .Height(heightTag != null ? (int)heightTag.Value : null)
                        .Width(widthTag != null ? (int)widthTag.Value : null)
                        .Latitude(latitudeValue.HasValue ? latitudeValue.Value : null)
                        .Longitude(longitudeValue.HasValue ? longitudeValue.Value : null);
            resizedImage.Dispose();
            img.Dispose();

            return builder.Build();
        }

        public async Task<ImageDTO> ReloadImageStoredData(string path)
        {
            Images = Images.Where(x => x.Path != path).ToList();
            var data = await GetImageData(path);
            if (data != null)
            {
                Images.Add(data);
            }
            return data;
        }

        public async Task LoadImageData(string path)
        {
            var image = await GetImageData(path);
            if(image != null)
            {
                Images.Add(image);
            }
        }
    }
}
