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
        var maxRetryCount = configuration.GetSection("Database:MaxRetryCount").Get<int?>() ?? 3;
        var maxRetryDelayString = configuration.GetSection("Database:MaxRetryDelay").Get<string>() ?? "00:00:10";
        var commandTimeout = configuration.GetSection("Database:CommandTimeout").Get<int?>() ?? 30;
        
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

        // Add DbContext factory for design-time operations
        services.AddDbContextFactory<SentimentAnalysisDbContext>(options =>
        {
            options.UseNpgsql(connectionString);
        });

        return services;
    }
}