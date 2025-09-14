using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Domain.Entities;

public class SocialMediaPost
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public PostStatus Status { get; set; }
    public string? SourceUrl { get; set; }
    public string? SourceId { get; set; }
    public int UpVotes { get; set; } = 0;
    public int DownVotes { get; set; } = 0;
    public int CommentCount { get; set; } = 0;
    public string Language { get; set; } = "en";
    public string? RawMetadata { get; set; }
    public bool IsDeleted { get; set; } = false;

    // Navigation Properties
    public virtual SentimentAnalysis? SentimentAnalysis { get; set; }
    public virtual ICollection<TrendKeyword> TrendKeywords { get; set; } = new List<TrendKeyword>();
}