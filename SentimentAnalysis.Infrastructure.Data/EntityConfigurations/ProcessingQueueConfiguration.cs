using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class ProcessingQueueConfiguration : IEntityTypeConfiguration<ProcessingQueue>
{
    public void Configure(EntityTypeBuilder<ProcessingQueue> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.PostId)
            .IsRequired();

        builder.Property(e => e.Status)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(e => e.Priority)
            .IsRequired()
            .HasDefaultValue(5); // Medium priority

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.RetryCount)
            .HasDefaultValue(0);

        builder.Property(e => e.ErrorMessage)
            .HasMaxLength(2000);

        // Indexes for performance
        builder.HasIndex(e => new { e.Status, e.Priority, e.CreatedAt })
            .HasDatabaseName("IX_ProcessingQueue_Status_Priority_CreatedAt");

        builder.HasIndex(e => e.PostId)
            .HasDatabaseName("IX_ProcessingQueue_PostId");

        builder.HasIndex(e => new { e.Status, e.RetryCount })
            .HasDatabaseName("IX_ProcessingQueue_Status_RetryCount");

        // Relationship
        builder.HasOne(e => e.Post)
            .WithMany()
            .HasForeignKey(e => e.PostId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}