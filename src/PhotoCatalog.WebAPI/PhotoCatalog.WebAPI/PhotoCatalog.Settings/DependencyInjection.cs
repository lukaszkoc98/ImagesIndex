using Microsoft.Extensions.DependencyInjection;
using PhotoCatalog.Settings.Configurations;
using PhotoCatalog.Settings.Initializer;

namespace PhotoCatalog.Settings
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSettings(this IServiceCollection services)
        {
            services.AddSingleton<IImageFolderIntializer, ImageFolderIntializer>();
            services.AddSingleton<IImageSettings, ImageSettings>();
            return services;
        }
    }
}
