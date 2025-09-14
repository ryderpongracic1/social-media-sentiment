namespace SentimentAnalysis.Domain.Entities;

public class TrendKeyword
{
    public Guid PostId { get; set; }
    public Guid TrendAnalysisId { get; set; }
    public string Keyword { get; set; } = string.Empty;
    public float RelevanceScore { get; set; }

    // Navigation Properties
    public virtual SocialMediaPost Post { get; set; } = null!;
    public virtual TrendAnalysis TrendAnalysis { get; set; } = null!;
}