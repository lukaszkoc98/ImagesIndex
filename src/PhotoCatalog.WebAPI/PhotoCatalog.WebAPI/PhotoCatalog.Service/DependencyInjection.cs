using Microsoft.Extensions.DependencyInjection;
using PhotoCatalog.Service.Services;

namespace PhotoCatalog.Service
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IImageService, ImageService>();
            return services;
        }
    }
}
