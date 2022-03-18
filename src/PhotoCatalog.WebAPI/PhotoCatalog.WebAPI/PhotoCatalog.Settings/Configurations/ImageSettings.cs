﻿using Microsoft.Extensions.Configuration;

namespace PhotoCatalog.Settings.Configurations
{
    public interface IImageSettings
    {
        int MaxMiniatureSize { get; }
    }

    public class ImageSettings : IImageSettings
    {
        private readonly IConfiguration _configuration;

        public ImageSettings(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public int MaxMiniatureSize { get => _configuration.GetValue<int>("Image:MaxMiniatureSize"); }
    }
}