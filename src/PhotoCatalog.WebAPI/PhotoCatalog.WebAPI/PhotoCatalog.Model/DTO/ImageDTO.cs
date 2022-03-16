using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCatalog.Model.DTO
{
    public class ImageDTO
    {
        public string DataString { get; set; }
        public double? Aperture { get; set; }
        public string Model { get; set; }
        public double? ExposureTime { get; set; }
        public double? FocalLength { get; set; }
        public string Flash { get; set; }
        public DateTime? ModifyDate { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
