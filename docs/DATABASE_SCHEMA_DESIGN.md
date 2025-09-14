# Database Schema Design - Social Media Sentiment Analysis Platform

## Overview

This document defines the comprehensive database schema for the social media sentiment analysis platform using Entity Framework Core Code First approach with PostgreSQL on Google Cloud SQL.

## Design Principles

### 1. Performance Optimization
- **Indexes**: Strategic indexing for query performance
- **Partitioning**: Time-based partitioning for large tables
- **Normalization**: 3NF with denormalization where needed for performance
- **Connection Pooling**: Efficient database connection management

### 2. Scalability Considerations
- **Read Replicas**: Support for read-heavy workloads
- **Horizontal Partitioning**: Prepare for sharding if needed
- **Archive Strategy**: Historical data management
- **Bulk Operations**: Optimized for batch processing

### 3. Data Integrity
- **Foreign Keys**: Referential integrity constraints
- **Check Constraints**: Data validation at database level
- **Audit Trails**: Change tracking and logging
- **Soft Deletes**: Preserve data for analytics

## Core Entity Models

### 1. SocialMediaPosts
Primary table for storing social media posts to be analyzed.

```csharp
public class SocialMediaPost
{
    public Guid Id { get; set; }
    public string Content { get; set; } // Max 4000 chars
    public string Platform { get; set; } // Reddit, Twitter, etc.
    public string UserId { get; set; } // Platform-specific user ID
    public string UserName { get; set; }
    public DateTime Timestamp { get; set; } // Post creation time
    public DateTime CreatedAt { get; set; } // Record creation time
    public DateTime? ProcessedAt { get; set; } // Sentiment processing time
    public PostStatus Status { get; set; }
    public string SourceUrl { get; set; }
    public string SourceId { get; set; } // Platform-specific post ID
    public int UpVotes { get; set; } = 0;
    public int DownVotes { get; set; } = 0;
    public int CommentCount { get; set; } = 0;
    public string Language { get; set; } = "en";
    public string RawMetadata { get; set; } // JSON for platform-specific data
    public bool IsDeleted { get; set; } = false;
    
    // Navigation Properties
    public virtual SentimentAnalysis SentimentAnalysis { get; set; }
    public virtual ICollection<TrendKeyword> TrendKeywords { get; set; }
}

public enum PostStatus
{
    Pending = 0,
    Processing = 1,
    Completed = 2,
    Failed = 3,
    Skipped = 4
}
```

### 2. SentimentAnalysis
Detailed sentiment analysis results for each post.

```csharp
public class SentimentAnalysis
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public float PositiveScore { get; set; } // 0.0 to 1.0
    public float NegativeScore { get; set; } // 0.0 to 1.0
    public float NeutralScore { get; set; } // 0.0 to 1.0
    public SentimentType OverallSentiment { get; set; }
    public float ConfidenceScore { get; set; } // Model confidence 0.0 to 1.0
    public bool IsSarcastic { get; set; } = false;
    public float SarcasmScore { get; set; } = 0.0f;
    public string ModelVersion { get; set; }
    public DateTime AnalyzedAt { get; set; }
    public TimeSpan ProcessingTime { get; set; }
    public string ExtractedKeywords { get; set; } // JSON array
    public string ExtractedEntities { get; set; } // JSON array
    public string DetailedScores { get; set; } // JSON for granular analysis
    
    // Navigation Property
    public virtual SocialMediaPost Post { get; set; }
}

public enum SentimentType
{
    VeryNegative = -2,
    Negative = -1,
    Neutral = 0,
    Positive = 1,
    VeryPositive = 2
}
```

### 3. TrendAnalysis
Aggregated trend analysis for keywords and topics.

```csharp
public class TrendAnalysis
{
    public Guid Id { get; set; }
    public string Keyword { get; set; }
    public string Platform { get; set; }
    public float TrendScore { get; set; } // Calculated trend strength
    public int MentionCount { get; set; }
    public float AvgSentimentScore { get; set; }
    public DateTime TimeWindowStart { get; set; }
    public DateTime TimeWindowEnd { get; set; }
    public TimeWindow WindowType { get; set; }
    public DateTime CreatedAt { get; set; }
    public string RelatedKeywords { get; set; } // JSON array
    public string GeographicData { get; set; } // JSON for location-based trends
    
    // Navigation Properties
    public virtual ICollection<TrendKeyword> TrendKeywords { get; set; }
}

public enum TimeWindow
{
    FiveMinutes = 5,
    FifteenMinutes = 15,
    OneHour = 60,
    SixHours = 360,
    TwentyFourHours = 1440,
    SevenDays = 10080
}
```

### 4. Supporting Entities

#### Users
```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PasswordHash { get; set; }
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string ApiKey { get; set; }
    public int DailyApiLimit { get; set; } = 1000;
    public int ApiCallsToday { get; set; } = 0;
}

public enum UserRole
{
    Viewer = 0,
    Analyst = 1,
    Admin = 2,
    System = 3
}
```

#### PlatformConfigurations
```csharp
public class PlatformConfiguration
{
    public Guid Id { get; set; }
    public string PlatformName { get; set; }
    public string ApiEndpoint { get; set; }
    public string AuthToken { get; set; } // Encrypted
    public bool IsActive { get; set; } = true;
    public int RateLimitPerHour { get; set; }
    public string IngestionSchedule { get; set; } // Cron expression
    public string FilterCriteria { get; set; } // JSON configuration
    public DateTime LastIngestionAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

#### TrendKeyword (Junction Table)
```csharp
public class TrendKeyword
{
    public Guid PostId { get; set; }
    public Guid TrendAnalysisId { get; set; }
    public string Keyword { get; set; }
    public float RelevanceScore { get; set; }
    
    // Navigation Properties
    public virtual SocialMediaPost Post { get; set; }
    public virtual TrendAnalysis TrendAnalysis { get; set; }
}
```

#### AuditLog
```csharp
public class AuditLog
{
    public Guid Id { get; set; }
    public string TableName { get; set; }
    public string RecordId { get; set; }
    public string Action { get; set; } // INSERT, UPDATE, DELETE
    public string OldValues { get; set; } // JSON
    public string NewValues { get; set; } // JSON
    public string UserId { get; set; }
    public DateTime Timestamp { get; set; }
    public string IpAddress { get; set; }
    public string UserAgent { get; set; }
}
```

## Database Indexes Strategy

### Primary Indexes
```sql
-- SocialMediaPosts
CREATE INDEX IX_SocialMediaPosts_Platform_Timestamp ON SocialMediaPosts (Platform, Timestamp DESC);
CREATE INDEX IX_SocialMediaPosts_Status_CreatedAt ON SocialMediaPosts (Status, CreatedAt);
CREATE INDEX IX_SocialMediaPosts_ProcessedAt ON SocialMediaPosts (ProcessedAt) WHERE ProcessedAt IS NOT NULL;
CREATE INDEX IX_SocialMediaPosts_SourceId_Platform ON SocialMediaPosts (SourceId, Platform);

-- SentimentAnalysis
CREATE INDEX IX_SentimentAnalysis_OverallSentiment_AnalyzedAt ON SentimentAnalysis (OverallSentiment, AnalyzedAt DESC);
CREATE INDEX IX_SentimentAnalysis_ConfidenceScore ON SentimentAnalysis (ConfidenceScore DESC);

-- TrendAnalysis
CREATE INDEX IX_TrendAnalysis_Keyword_Platform_TimeWindow ON TrendAnalysis (Keyword, Platform, TimeWindowStart DESC);
CREATE INDEX IX_TrendAnalysis_TrendScore_TimeWindow ON TrendAnalysis (TrendScore DESC, TimeWindowStart DESC);

-- Performance Indexes
CREATE INDEX IX_SocialMediaPosts_Timestamp_Include ON SocialMediaPosts (Timestamp DESC) 
INCLUDE (Platform, Status, UserId);
```

### Partitioning Strategy
```sql
-- Partition SocialMediaPosts by month for better performance
CREATE TABLE SocialMediaPosts_2024_01 PARTITION OF SocialMediaPosts 
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Partition SentimentAnalysis by quarter
CREATE TABLE SentimentAnalysis_2024_Q1 PARTITION OF SentimentAnalysis 
FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
```

## DbContext Configuration

```csharp
public class SentimentAnalysisDbContext : DbContext
{
    public DbSet<SocialMediaPost> SocialMediaPosts { get; set; }
    public DbSet<SentimentAnalysis> SentimentAnalyses { get; set; }
    public DbSet<TrendAnalysis> TrendAnalyses { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<PlatformConfiguration> PlatformConfigurations { get; set; }
    public DbSet<TrendKeyword> TrendKeywords { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // SocialMediaPost Configuration
        modelBuilder.Entity<SocialMediaPost>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Content).HasMaxLength(4000).IsRequired();
            entity.Property(e => e.Platform).HasMaxLength(50).IsRequired();
            entity.Property(e => e.UserId).HasMaxLength(100).IsRequired();
            entity.Property(e => e.SourceId).HasMaxLength(100);
            entity.Property(e => e.Language).HasMaxLength(10);
            entity.HasIndex(e => new { e.Platform, e.Timestamp });
            entity.HasIndex(e => new { e.Status, e.CreatedAt });
        });

        // SentimentAnalysis Configuration
        modelBuilder.Entity<SentimentAnalysis>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Post)
                  .WithOne(p => p.SentimentAnalysis)
                  .HasForeignKey<SentimentAnalysis>(e => e.PostId);
            entity.Property(e => e.ModelVersion).HasMaxLength(50);
            entity.HasIndex(e => e.OverallSentiment);
        });

        // TrendAnalysis Configuration
        modelBuilder.Entity<TrendAnalysis>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Keyword).HasMaxLength(200).IsRequired();
            entity.Property(e => e.Platform).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => new { e.Keyword, e.Platform, e.TimeWindowStart });
        });

        // TrendKeyword Configuration (Many-to-Many)
        modelBuilder.Entity<TrendKeyword>(entity =>
        {
            entity.HasKey(e => new { e.PostId, e.TrendAnalysisId, e.Keyword });
            entity.HasOne(e => e.Post)
                  .WithMany(p => p.TrendKeywords)
                  .HasForeignKey(e => e.PostId);
            entity.HasOne(e => e.TrendAnalysis)
                  .WithMany(t => t.TrendKeywords)
                  .HasForeignKey(e => e.TrendAnalysisId);
        });

        // User Configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).HasMaxLength(256).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.ApiKey).HasMaxLength(128);
            entity.HasIndex(e => e.ApiKey).IsUnique();
        });
    }
}
```

## Migration Strategy

### Initial Migration
```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Apply to database
dotnet ef database update
```

### Data Seeding
```csharp
public static class DatabaseSeeder
{
    public static void SeedData(SentimentAnalysisDbContext context)
    {
        // Seed default platform configurations
        if (!context.PlatformConfigurations.Any())
        {
            context.PlatformConfigurations.AddRange(
                new PlatformConfiguration
                {
                    PlatformName = "Reddit",
                    IsActive = true,
                    RateLimitPerHour = 3600,
                    FilterCriteria = "{ \"subreddits\": [\"technology\", \"programming\", \"news\"], \"minUpvotes\": 100 }"
                }
            );
        }

        context.SaveChanges();
    }
}
```

## Performance Monitoring

### Key Metrics to Track
- Query execution times for trending analysis
- Index usage and effectiveness
- Connection pool utilization
- Transaction deadlocks
- Partition pruning effectiveness

### Optimization Strategies
1. **Query Optimization**: Use appropriate indexes and query hints
2. **Connection Pooling**: Configure optimal pool size for workload
3. **Read Replicas**: Distribute read queries across replicas
4. **Caching**: Implement Redis caching for frequently accessed data
5. **Archival**: Move old data to cheaper storage tiers

This schema design provides a robust foundation for high-performance sentiment analysis while maintaining data integrity and supporting the platform's scalability requirements.