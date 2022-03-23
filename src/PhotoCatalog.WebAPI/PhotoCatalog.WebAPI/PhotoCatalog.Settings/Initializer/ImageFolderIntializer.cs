using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCatalog.Settings.Initializer
{
    public interface IImageFolderIntializer
    {
        void Initialize();
    }

    public class ImageFolderIntializer : IImageFolderIntializer
    {
        private readonly IConfiguration _configuration;

        public ImageFolderIntializer(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void Initialize()
        {
            Directory.CreateDirectory(_configuration["ImagesFolderName"]);
        }
    }
}
