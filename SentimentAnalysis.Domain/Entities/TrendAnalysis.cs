using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Domain.Entities;

public class TrendAnalysis
{
    public Guid Id { get; set; }
    public string Keyword { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty;
    public float TrendScore { get; set; }
    public int MentionCount { get; set; }
    public float AvgSentimentScore { get; set; }
    public DateTime TimeWindowStart { get; set; }
    public DateTime TimeWindowEnd { get; set; }
    public TimeWindow WindowType { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? RelatedKeywords { get; set; }
    public string? GeographicData { get; set; }

    // Navigation Properties
    public virtual ICollection<TrendKeyword> TrendKeywords { get; set; } = new List<TrendKeyword>();
}