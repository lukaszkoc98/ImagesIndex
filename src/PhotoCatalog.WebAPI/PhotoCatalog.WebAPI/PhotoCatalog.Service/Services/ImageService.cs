using ExifLibrary;
using PhotoCatalog.Model.Builder;
using PhotoCatalog.Model.DTO;
using PhotoCatalog.Model.Models;
using PhotoCatalog.Model.ViewModel;
using PhotoCatalog.Settings.Configurations;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace PhotoCatalog.Service.Services
{
    public interface IImageService
    {
        ImageDTO GetImageData(string imagePath);
        IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<string> imagesPaths);
        IEnumerable<string> TMP();
        Task<ImageDTO> UpdateTags(UpdateImageVM model);
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
            return _fileInfoStoreService.Images.Where(x => x.Path == imagePath).FirstOrDefault();
        }

        //WYWALIĆ JAK BĘDZIE GOTOWA PAGINACJA - MUSIAŁEM CZYMŚ ZASTĄPIĆ POBIERANIE ŚCIEŻEK
        public IEnumerable<string> TMP()
        {
            return _fileInfoStoreService.Images.Select(x => x.Path);
        }


        public IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<string> imagesPaths)
        {

            var images = new List<ImageMiniatureDTO>();

            foreach (var path in imagesPaths)
            {
                var img = Image.FromFile(path);
                var resizedImage = resizeImage(img, new Size(_imageSettings.MaxMiniatureSize, _imageSettings.MaxMiniatureSize));

                using (MemoryStream m = new MemoryStream())
                {
                    resizedImage.Save(m, ImageFormat.Jpeg);
                    byte[] imageBytes = m.ToArray();

                    string base64String = $"data:image/jpeg;base64,{Convert.ToBase64String(imageBytes)}";

                    images.Add(new ImageMiniatureDTO
                    {
                        Name = Path.GetFileName(path),
                        Path = path,
                        StringData = base64String
                    });
                }
            }

            return images;
        }

        public async Task<ImageDTO> UpdateTags(UpdateImageVM model)
        {

            if (!File.Exists(model.Path))
            {
                throw new Exception($"Not found on {model.Path}");
            }

            byte[] imageArray = await File.ReadAllBytesAsync(model.Path);

            var builder = new ImageDataBuilder()
                .DataString(imageArray)
                .Path(model.Path);

            var file = await ImageFile.FromFileAsync(model.Path);


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
                file.Properties.Set(ExifTag.ExposureTime, model.Model);
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
                file.Properties.Set(ExifTag.ISOSpeedRatings, model.ISOSpeed.Value);
            }

            if (model.CreateDate.HasValue)
            {
                file.Properties.Set(ExifTag.DateTimeOriginal, model.CreateDate.Value);
            }

            await file.SaveAsync(model.Path);

            return await _fileInfoStoreService.ReloadImageStoredData(model.Path);
        }

        private Image resizeImage(Image imgToResize, Size size)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            float nPercent = 0;
            //Calulate  width with new desired size  
            float nPercentW = ((float)size.Width / (float)sourceWidth);
            //Calculate height with new desired size  
            float nPercentH = ((float)size.Height / (float)sourceHeight);

            if (nPercentH < nPercentW)
            {
                nPercent = nPercentH;
            }
            else
            {
                nPercent = nPercentW;
            }

            //New Width  
            int destWidth = (int)(sourceWidth * nPercent);
            //New Height  
            int destHeight = (int)(sourceHeight * nPercent);

            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            // Draw image with new width and height  
            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();
            return (Image)b;
        }
    }
}
