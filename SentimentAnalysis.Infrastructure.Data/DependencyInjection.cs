using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SentimentAnalysis.Infrastructure.Data.DbContext;

namespace SentimentAnalysis.Infrastructure.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureDataServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        // Get database configuration values
        var maxRetryCount = int.TryParse(configuration["Database:MaxRetryCount"], out var retryCount) ? retryCount : 3;
        var maxRetryDelayString = configuration["Database:MaxRetryDelay"] ?? "00:00:10";
        var commandTimeout = int.TryParse(configuration["Database:CommandTimeout"], out var timeout) ? timeout : 30;
        
        services.AddDbContext<SentimentAnalysisDbContext>(options =>
        {
            options.UseNpgsql(connectionString, npgsqlOptions =>
            {
                npgsqlOptions.MigrationsAssembly(typeof(SentimentAnalysisDbContext).Assembly.FullName);
                npgsqlOptions.EnableRetryOnFailure(
                    maxRetryCount: maxRetryCount,
                    maxRetryDelay: TimeSpan.Parse(maxRetryDelayString),
                    errorCodesToAdd: null);
                npgsqlOptions.CommandTimeout(commandTimeout);
            });

            options.EnableSensitiveDataLogging(false);
            options.EnableDetailedErrors(false);
        });

        return services;
    }
}