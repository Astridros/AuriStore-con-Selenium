

using AuriStore.Application.Interfaces;
using AuriStore.Application.Services;
using AuriStore.Domain.Interfaces;
using AuriStore.Infrastructure.GeneryRepository;
using AuriStore.Infrastructure.Persistence.Data;
using AuriStore.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AuriStore.Infrastructure.Ioc
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddAuriStoreInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {

            string connection = BuildConnectionString();

            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(connection));

            services.AddScoped(typeof(IGeneryRepository<>), typeof(GeneryRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<ICategoryRepository, CategoryRepository>();
            services.AddScoped<IProductRepository, ProductRepository>(); 
            services.AddScoped<IProductService, ProductService>();


            return services;
        }

        private static string BuildConnectionString()
        {
            var server = Environment.GetEnvironmentVariable("DB_SERVER");
            var database = Environment.GetEnvironmentVariable("DB_NAME");
            var trusted = Environment.GetEnvironmentVariable("DB_TRUSTED_CONNECTION");
            var trustCert = Environment.GetEnvironmentVariable("DB_TRUST_CERT");

            // Autenticación integrada (Windows)
            return $"Server={server};Database={database};Integrated Security={trusted};TrustServerCertificate={trustCert};";
        }
    }
}
