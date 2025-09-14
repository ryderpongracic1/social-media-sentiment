using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class TrendKeywordConfiguration : IEntityTypeConfiguration<TrendKeyword>
{
    public void Configure(EntityTypeBuilder<TrendKeyword> builder)
    {
        // Composite primary key
        builder.HasKey(e => new { e.PostId, e.TrendAnalysisId, e.Keyword });

        builder.Property(e => e.Keyword)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(e => e.RelevanceScore)
            .HasPrecision(5, 4)
            .IsRequired();

        // Relationships
        builder.HasOne(e => e.Post)
            .WithMany(p => p.TrendKeywords)
            .HasForeignKey(e => e.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(e => e.TrendAnalysis)
            .WithMany(t => t.TrendKeywords)
            .HasForeignKey(e => e.TrendAnalysisId)
            .OnDelete(DeleteBehavior.Cascade);

        // Indexes
        builder.HasIndex(e => e.Keyword)
            .HasDatabaseName("IX_TrendKeywords_Keyword");

        builder.HasIndex(e => e.RelevanceScore)
            .HasDatabaseName("IX_TrendKeywords_RelevanceScore");

        builder.HasIndex(e => new { e.PostId, e.RelevanceScore })
            .HasDatabaseName("IX_TrendKeywords_PostId_RelevanceScore");
    }
}