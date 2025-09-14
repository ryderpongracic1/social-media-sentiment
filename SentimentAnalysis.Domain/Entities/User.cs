using SentimentAnalysis.Domain.Enums;

namespace SentimentAnalysis.Domain.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string? ApiKey { get; set; }
    public int DailyApiLimit { get; set; } = 1000;
    public int ApiCallsToday { get; set; } = 0;
}