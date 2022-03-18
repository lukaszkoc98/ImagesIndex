using GroupDocs.Metadata;
using GroupDocs.Metadata.Standards.Exif;
using PhotoCatalog.Model.Builder;
using PhotoCatalog.Model.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using PhotoCatalog.Settings.Configurations;

namespace PhotoCatalog.Service.Services
{
    public class ImageService
    {
        private readonly IImageSettings _imageSettings;

        public ImageService(IImageSettings imageSettings)
        {
            _imageSettings = imageSettings;
        }

        public ImageDTO GetImageData(string imagePath)
        {
            byte[] imageArray = File.ReadAllBytes(imagePath);

            var builder = new ImageDataBuilder().DataString(imageArray);

            using (Metadata metadata = new Metadata(imagePath))
            {
                IExif root = metadata.GetRootPackage() as IExif;

                if (root != null && root.ExifPackage != null)
                {
                    var apertureTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "ApertureValue").FirstOrDefault();
                    var exposureTimeTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "ExposureTime").FirstOrDefault();
                    var focalLengthTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "FocalLength").FirstOrDefault();
                    var flashTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "Flash").FirstOrDefault();
                    var heightTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "PixelYDimension").FirstOrDefault();
                    var widthTag = root.ExifPackage.ExifIfdPackage.Where(x => x.Name == "PixelXDimension").FirstOrDefault();

                    builder = builder
                        .Model(root.ExifPackage.Model)
                        .Aperture((double)apertureTag.InterpretedValue.RawValue)
                        .ExposureTime((double)exposureTimeTag.InterpretedValue.RawValue)
                        .Flash(flashTag.InterpretedValue.RawValue.ToString())
                        .FocalLength((double)focalLengthTag.InterpretedValue.RawValue)
                        .Height((int)heightTag.InterpretedValue.RawValue)
                        .Width((int)widthTag.InterpretedValue.RawValue);
                }
            }
            return builder.Build();
        }

        public IEnumerable<ImageMiniatureDTO> GetImagesMiniatures(IEnumerable<string> imagesPaths) {

            var images = new List<ImageMiniatureDTO>();

            foreach(var path in imagesPaths)
            {
                var img = Image.FromFile(path);
                var resizedImage = resizeImage(img, new Size(_imageSettings.MaxMiniatureSize, _imageSettings.MaxMiniatureSize));

                using (MemoryStream m = new MemoryStream())
                {
                    resizedImage.Save(m, resizedImage.RawFormat);
                    byte[] imageBytes = m.ToArray();

                    string base64String = Convert.ToBase64String(imageBytes);

                    images.Add(new ImageMiniatureDTO
                    {
                        Name = Path.GetFileName(path),
                        StringData = base64String
                    });
                }
            }

            return images;
        }

        private Image resizeImage(Image imgToResize, Size size)
        {
            int sourceWidth = imgToResize.Width;
            int sourceHeight = imgToResize.Height;

            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;
            //Calulate  width with new desired size  
            nPercentW = ((float)size.Width / (float)sourceWidth);
            //Calculate height with new desired size  
            nPercentH = ((float)size.Height / (float)sourceHeight);

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
