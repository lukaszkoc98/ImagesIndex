using PhotoCatalog.Model.DTO;
using System;

namespace PhotoCatalog.Model.Builder
{
    public class ImageDataBuilder
    {
        private readonly ImageDTO _image = new ();

        public ImageDTO Build() => _image;

        public ImageDataBuilder Width(int? width)
        {
            _image.Width = width;
            return this;
        }

        public ImageDataBuilder Height(int? height)
        {
            _image.Height = height;
            return this;
        }

        public ImageDataBuilder ISOSpeed(ushort? isoSpeed)
        {
            _image.ISOSpeed = isoSpeed;
            return this;
        }

        public ImageDataBuilder Aperture(double? aperture)
        {
            _image.Aperture = aperture;
            return this;
        }

        public ImageDataBuilder DataString(byte[] data)
        {
            _image.DataString = Convert.ToBase64String(data);
            return this;
        }

        public ImageDataBuilder ExposureTime(double? exposureTime)
        {
            _image.ExposureTime = exposureTime;
            return this;
        }

        public ImageDataBuilder Flash(ushort? flash)
        {
            _image.Flash = flash;
            return this;
        }

        public ImageDataBuilder FocalLength(double? focalLength)
        {
            _image.FocalLength = focalLength;
            return this;
        }

        public ImageDataBuilder Model(string model)
        {
            _image.Model = model;

            return this;
        }

        public ImageDataBuilder Make(string make)
        {
            _image.Make = make;

            return this;
        }

        public ImageDataBuilder Path(string path)
        {
            _image.Path = path;

            return this;
        }

        public ImageDataBuilder CreateDate(DateTime? createDate)
        {
            _image.CreateDate = createDate;

            return this;
        }

        public ImageDataBuilder ModifyDate(DateTime? modifyDate)
        {
            _image.ModifyDate = modifyDate;

            return this;
        }

        public ImageDataBuilder Latitude(double? latitude)
        {
            _image.Latitude = latitude;
            return this;
        }

        public ImageDataBuilder Longitude(double? longitude)
        {
            _image.Longitude = longitude;
            return this;
        }
    }
}
