using PhotoCatalog.Model.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PhotoCatalog.Model.DTO
{
    public class ImageParamDTO
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public SortEnum SortType { get; set; }
    }
}
