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

                    builder = builder
                        .Model(root.ExifPackage.Model);

                }
            }

            return builder.Build();
        }

    }
}
