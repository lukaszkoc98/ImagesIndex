using PhotoCatalog.Model.Enums;
using System.Collections.Generic;

namespace PhotoCatalog.Model.DTO
{
    public class ImageGroupDTO
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public double? ApertureMin { get; set; }
        public double? ApertureMax { get; set; }
        public List<string> Makes { get; set; } 
        public List<string> Models { get; set; }
        public double? ExposureTimeMin { get; set; }
        public double? ExposureTimeMax { get; set; }
        public double? FocalLengthMin { get; set; }
        public double? FocalLengthMax { get; set; }
        public ushort? FlashMin { get; set; }
        public ushort? FlashMax { get; set; }

        public SortEnum SortType { get; set; }
    }
}
