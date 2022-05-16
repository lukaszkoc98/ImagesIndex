using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using PhotoCatalog.Service.Services;
using PhotoCatalog.Settings.Initializer;
using System;

namespace PhotoCatalog.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var folderInitializer = services.GetRequiredService<IImageFolderIntializer>();
                    folderInitializer.Initialize();
                    var fileInfoService = services.GetRequiredService<IFileInfoStoreService>();
                    fileInfoService.Initialize();
                }
                catch (Exception)
                {
                    Console.WriteLine("Exception during folder initialization");
                }
            }
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
