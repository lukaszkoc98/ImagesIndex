using PhotoCatalog.Model.DTO;
using System;

namespace PhotoCatalog.Model.Builder
{
    public class ImageDataBuilder
    {
        private readonly ImageDTO _image = new ();

        public ImageDTO Build() => _image;

        public ImageDataBuilder DataString(byte[] data)
        {
            _image.DataString = Convert.ToBase64String(data);

            return this;
        }

        public ImageDataBuilder ExposureTime(double exposureTime)
        {
            _image.ExposureTime = exposureTime;

            return this;
        }

        public ImageDataBuilder Flash(string flash)
        {
            _image.Flash = flash;

            return this;
        }

        public ImageDataBuilder FocalLength(double focalLength)
        {
            _image.FocalLength = focalLength;

            return this;
        }

        public ImageDataBuilder Model(string model)
        {
            _image.Model = model;

            return this;
        }

        public ImageDataBuilder CreateDate(DateTime createDate)
        {
            _image.CreateDate = createDate;

            return this;
        }

        public ImageDataBuilder ModifyDate(DateTime modifyDate)
        {
            _image.ModifyDate = modifyDate;

            return this;
        }
    }
}
