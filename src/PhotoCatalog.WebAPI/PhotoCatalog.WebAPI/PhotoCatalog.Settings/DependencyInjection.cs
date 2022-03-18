using Microsoft.Extensions.DependencyInjection;
using PhotoCatalog.Settings.Configurations;

namespace PhotoCatalog.Settings
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddSettings(this IServiceCollection services)
        {
            services.AddSingleton<IImageSettings, ImageSettings>();
            return services;
        }
    }
}
