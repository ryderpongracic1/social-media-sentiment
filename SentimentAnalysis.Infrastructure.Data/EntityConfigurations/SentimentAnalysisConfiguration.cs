using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class SentimentAnalysisConfiguration : IEntityTypeConfiguration<Domain.Entities.SentimentAnalysis>
{
    public void Configure(EntityTypeBuilder<Domain.Entities.SentimentAnalysis> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.PostId)
            .IsRequired();

        builder.Property(e => e.PositiveScore)
            .HasPrecision(5, 4)
            .IsRequired();

        builder.Property(e => e.NegativeScore)
            .HasPrecision(5, 4)
            .IsRequired();

        builder.Property(e => e.NeutralScore)
            .HasPrecision(5, 4)
            .IsRequired();

        builder.Property(e => e.ConfidenceScore)
            .HasPrecision(5, 4)
            .IsRequired();

        builder.Property(e => e.SarcasmScore)
            .HasPrecision(5, 4)
            .HasDefaultValue(0.0f);

        builder.Property(e => e.OverallSentiment)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(e => e.IsSarcastic)
            .HasDefaultValue(false);

        builder.Property(e => e.ModelVersion)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.AnalyzedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.ExtractedKeywords)
            .HasColumnType("jsonb");

        builder.Property(e => e.ExtractedEntities)
            .HasColumnType("jsonb");

        builder.Property(e => e.DetailedScores)
            .HasColumnType("jsonb");

        // Indexes for performance
        builder.HasIndex(e => new { e.OverallSentiment, e.AnalyzedAt })
            .HasDatabaseName("IX_SentimentAnalysis_OverallSentiment_AnalyzedAt");

        builder.HasIndex(e => e.ConfidenceScore)
            .HasDatabaseName("IX_SentimentAnalysis_ConfidenceScore");

        builder.HasIndex(e => e.PostId)
            .HasDatabaseName("IX_SentimentAnalysis_PostId")
            .IsUnique();

        // Relationship
        builder.HasOne(e => e.Post)
            .WithOne(p => p.SentimentAnalysis)
            .HasForeignKey<Domain.Entities.SentimentAnalysis>(e => e.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}