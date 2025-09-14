using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SentimentAnalysis.Domain.Entities;
using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Infrastructure.Data.EntityConfigurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(e => e.Id);

        builder.Property(e => e.Email)
            .HasMaxLength(256)
            .IsRequired();

        builder.Property(e => e.FirstName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.LastName)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(e => e.PasswordHash)
            .HasMaxLength(512)
            .IsRequired();

        builder.Property(e => e.Role)
            .HasConversion<int>()
            .IsRequired();

        builder.Property(e => e.CreatedAt)
            .HasDefaultValueSql("NOW()");

        builder.Property(e => e.IsActive)
            .HasDefaultValue(true);

        builder.Property(e => e.ApiKey)
            .HasMaxLength(128);

        builder.Property(e => e.DailyApiLimit)
            .HasDefaultValue(1000);

        builder.Property(e => e.ApiCallsToday)
            .HasDefaultValue(0);

        // Indexes
        builder.HasIndex(e => e.Email)
            .HasDatabaseName("IX_Users_Email")
            .IsUnique();

        builder.HasIndex(e => e.ApiKey)
            .HasDatabaseName("IX_Users_ApiKey")
            .IsUnique()
            .HasFilter("ApiKey IS NOT NULL");

        builder.HasIndex(e => new { e.Role, e.IsActive })
            .HasDatabaseName("IX_Users_Role_IsActive");
    }
}