using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class SocialMediaPostConfiguration : IEntityTypeConfiguration<SocialMediaPost>
{
    public void Configure(EntityTypeBuilder<SocialMediaPost> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Content)
            .HasMaxLength(4000)
            .IsRequired();

        builder.Property(e => e.Platform)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(e => e.UserId)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.UserName)
            .HasMaxLength(255);

        builder.Property(e => e.SourceId)
            .HasMaxLength(100);

        builder.Property(e => e.SourceUrl)
            .HasMaxLength(2000);

        builder.Property(e => e.Language)
            .HasMaxLength(10)
            .HasDefaultValue("en");

        builder.Property(e => e.RawMetadata)
            .HasColumnType("jsonb");

        builder.Property(e => e.Status)
            .HasConversion<int>();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.IsDeleted)
            .HasDefaultValue(false);

        // Indexes for performance
        builder.HasIndex(e => new { e.Platform, e.Timestamp })
            .HasDatabaseName("IX_SocialMediaPosts_Platform_Timestamp");

        builder.HasIndex(e => new { e.Status, e.CreatedAt })
            .HasDatabaseName("IX_SocialMediaPosts_Status_CreatedAt");

        builder.HasIndex(e => e.ProcessedAt)
            .HasDatabaseName("IX_SocialMediaPosts_ProcessedAt")
            .HasFilter("ProcessedAt IS NOT NULL");

        builder.HasIndex(e => new { e.SourceId, e.Platform })
            .HasDatabaseName("IX_SocialMediaPosts_SourceId_Platform")
            .IsUnique();

        // Performance index with included columns
        builder.HasIndex(e => e.Timestamp)
            .HasDatabaseName("IX_SocialMediaPosts_Timestamp_Include")
            .IncludeProperties(e => new { e.Platform, e.Status, e.UserId });

        // Relationships
        builder.HasOne(e => e.SentimentAnalysis)
            .WithOne(s => s.Post)
            .HasForeignKey<Domain.Entities.SentimentAnalysis>(s => s.PostId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(e => e.TrendKeywords)
            .WithOne(tk => tk.Post)
            .HasForeignKey(tk => tk.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}