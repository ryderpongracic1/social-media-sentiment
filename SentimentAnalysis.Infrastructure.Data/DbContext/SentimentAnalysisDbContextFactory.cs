using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace SentimentAnalysis.Infrastructure.Data.DbContext;

public class SentimentAnalysisDbContextFactory : IDesignTimeDbContextFactory<SentimentAnalysisDbContext>
{
    public SentimentAnalysisDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<SentimentAnalysisDbContext>();
        
        // Use a default connection string for design-time operations
        var connectionString = "Host=localhost;Database=sentiment_analysis_dev;Username=postgres;Password=postgres;Port=5432;SSL Mode=Prefer;";
        
        optionsBuilder.UseNpgsql(connectionString, npgsqlOptions =>
        {
            npgsqlOptions.MigrationsAssembly(typeof(SentimentAnalysisDbContext).Assembly.FullName);
        });

        return new SentimentAnalysisDbContext(optionsBuilder.Options);
    }
}