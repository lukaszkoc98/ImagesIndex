using GroupDocs.Metadata;
using GroupDocs.Metadata.Standards.Exif;
using PhotoCatalog.Model.Builder;
using PhotoCatalog.Model.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCatalog.Service.Services
{
    public class ImageService
    {

        public ImageDTO GetImage(string imagePath)
        {
            byte[] imageArray = System.IO.File.ReadAllBytes(imagePath);

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
                    builder = builder
                        .Model(root.ExifPackage.Model)
                        .Aperture((double)apertureTag.InterpretedValue.RawValue)
                        .ExposureTime((double)exposureTimeTag.InterpretedValue.RawValue)
                        .Flash(flashTag.InterpretedValue.RawValue.ToString())
                        .FocalLength((double)focalLengthTag.InterpretedValue.RawValue);

                }
            }

            return builder.Build();
        }

    }
}
