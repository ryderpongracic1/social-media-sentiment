using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class TrendAnalysisConfiguration : IEntityTypeConfiguration<TrendAnalysis>
{
    public void Configure(EntityTypeBuilder<TrendAnalysis> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Keyword)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.Platform)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.TrendScore)
            .HasPrecision(8, 4)
            .IsRequired();

        builder.Property(e => e.AvgSentimentScore)
            .HasPrecision(5, 4)
            .IsRequired();

        builder.Property(e => e.WindowType)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.RelatedKeywords)
            .HasColumnType("jsonb");

        builder.Property(e => e.GeographicData)
            .HasColumnType("jsonb");

        // Indexes for performance
        builder.HasIndex(e => new { e.Keyword, e.Platform, e.TimeWindowStart })
            .HasDatabaseName("IX_TrendAnalysis_Keyword_Platform_TimeWindow");

        builder.HasIndex(e => new { e.TrendScore, e.TimeWindowStart })
            .HasDatabaseName("IX_TrendAnalysis_TrendScore_TimeWindow");

        builder.HasIndex(e => new { e.Platform, e.TimeWindowStart })
            .HasDatabaseName("IX_TrendAnalysis_Platform_TimeWindow");

        builder.HasIndex(e => e.TimeWindowStart)
            .HasDatabaseName("IX_TrendAnalysis_TimeWindowStart");

        // Relationships
        builder.HasMany(e => e.TrendKeywords)
            .WithOne(tk => tk.TrendAnalysis)
            .HasForeignKey(tk => tk.TrendAnalysisId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}