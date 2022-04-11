namespace PhotoCatalog.Model.DTO
{
    public class ImageMiniatureDTO
    {
        public string Path { get; set; }

        public string Name { get; set; }
        public string StringData { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
