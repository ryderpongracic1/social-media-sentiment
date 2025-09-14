using Microsoft.EntityFrameworkCore;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

namespace SentimentAnalysis.Infrastructure.Data.DbContext;

public class SentimentAnalysisDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public SentimentAnalysisDbContext(DbContextOptions<SentimentAnalysisDbContext> options)
        : base(options)
    {
    }

    public DbSet<SocialMediaPost> SocialMediaPosts { get; set; }
    public DbSet<SentimentAnalysis.Domain.Entities.SentimentAnalysis> SentimentAnalyses { get; set; }
    public DbSet<TrendAnalysis> TrendAnalyses { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<TrendKeyword> TrendKeywords { get; set; }
    public DbSet<ProcessingQueue> ProcessingQueue { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new SocialMediaPostConfiguration());
        modelBuilder.ApplyConfiguration(new SentimentAnalysisConfiguration());
        modelBuilder.ApplyConfiguration(new TrendAnalysisConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new TrendKeywordConfiguration());
        modelBuilder.ApplyConfiguration(new ProcessingQueueConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}