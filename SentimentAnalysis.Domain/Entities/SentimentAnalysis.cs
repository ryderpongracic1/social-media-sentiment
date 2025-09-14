using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Domain.Entities;

public class SentimentAnalysis
{
    public Guid Id { get; set; }
    public Guid PostId { get; set; }
    public float PositiveScore { get; set; }
    public float NegativeScore { get; set; }
    public float NeutralScore { get; set; }
    public SentimentType OverallSentiment { get; set; }
    public float ConfidenceScore { get; set; }
    public bool IsSarcastic { get; set; } = false;
    public float SarcasmScore { get; set; } = 0.0f;
    public string ModelVersion { get; set; } = string.Empty;
    public DateTime AnalyzedAt { get; set; }
    public TimeSpan ProcessingTime { get; set; }
    public string? ExtractedKeywords { get; set; }
    public string? ExtractedEntities { get; set; }
    public string? DetailedScores { get; set; }

    // Navigation Property
    public virtual SocialMediaPost Post { get; set; } = null!;
}