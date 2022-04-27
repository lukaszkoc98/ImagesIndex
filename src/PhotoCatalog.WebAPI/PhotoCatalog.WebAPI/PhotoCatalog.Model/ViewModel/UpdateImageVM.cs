using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCatalog.Model.ViewModel
{
    public class UpdateImageVM
    {
        public string Path { get; set; }
        public double? Aperture { get; set; }
        public string Model { get; set; }
        public string Make { get; set; }
        public double? ExposureTime { get; set; }
        public double? FocalLength { get; set; }
        public int? Flash { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public int? ISOSpeed { get; set; }
        public DateTime? CreateDate { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
    }
}
