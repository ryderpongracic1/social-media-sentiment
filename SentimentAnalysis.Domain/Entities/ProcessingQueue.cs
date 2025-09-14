using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Domain.Entities;

public class ProcessingQueue
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public PostStatus Status { get; set; }
    public int Priority { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public int RetryCount { get; set; } = 0;
    public string? ErrorMessage { get; set; }

    // Navigation Property
    public virtual SocialMediaPost Post { get; set; } = null!;
}