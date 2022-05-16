namespace PhotoCatalog.Model.DTO
{
    public class ImageMiniatureDTO
    {
        public string Path { get; set; }
        public string Name { get; set; }
        public string StringData { get; set; }
        public float? Latitude { get; set; }
        public float? Longitude { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
    }
}
