# Project Structure - Clean Architecture Implementation

## Overview

This document defines the recommended project structure for the social media sentiment analysis platform following Clean Architecture principles, Domain-Driven Design (DDD), and .NET best practices. The structure supports both monolithic and microservices deployment patterns.

## Clean Architecture Principles

### 1. Dependency Inversion
- High-level modules should not depend on low-level modules
- Both should depend on abstractions
- Abstractions should not depend on details

### 2. Separation of Concerns
- Each layer has a single responsibility
- Clear boundaries between business logic and infrastructure
- Testable and maintainable code organization

### 3. Independence of Frameworks
- Business logic is independent of UI, database, and external agencies
- Framework choices can be changed without affecting core business rules

## Solution Structure

```
SocialMediaSentimentAnalysis/
├── src/
│   ├── Core/                           # Core Domain Layer
│   │   ├── SentimentAnalysis.Domain/
│   │   └── SentimentAnalysis.Application/
│   ├── Infrastructure/                 # Infrastructure Layer
│   │   ├── SentimentAnalysis.Infrastructure/
│   │   ├── SentimentAnalysis.Persistence/
│   │   └── SentimentAnalysis.ExternalServices/
│   ├── Presentation/                   # Presentation Layer
│   │   ├── SentimentAnalysis.API/
│   │   ├── SentimentAnalysis.WebApp/
│   │   └── SentimentAnalysis.Functions/
│   ├── Services/                       # Microservices
│   │   ├── AuthService/
│   │   ├── IngestionService/
│   │   ├── TrendsService/
│   │   ├── AnalyticsService/
│   │   └── NotificationService/
│   └── Shared/                         # Shared Libraries
│       ├── SentimentAnalysis.Shared/
│       ├── SentimentAnalysis.EventBus/
│       └── SentimentAnalysis.Common/
├── tests/                              # Test Projects
│   ├── UnitTests/
│   ├── IntegrationTests/
│   ├── EndToEndTests/
│   └── PerformanceTests/
├── docs/                              # Documentation
├── scripts/                           # Build and deployment scripts
├── infrastructure/                    # Infrastructure as Code
│   ├── terraform/
│   ├── kubernetes/
│   └── docker/
├── tools/                             # Development tools
└── samples/                           # Sample applications
```

## Core Domain Layer

### SentimentAnalysis.Domain

**Purpose**: Contains enterprise business rules and entities.

```
SentimentAnalysis.Domain/
├── Entities/
│   ├── SocialMediaPost.cs
│   ├── SentimentAnalysis.cs
│   ├── TrendAnalysis.cs
│   ├── User.cs
│   └── PlatformConfiguration.cs
├── ValueObjects/
│   ├── SentimentScore.cs
│   ├── TrendScore.cs
│   ├── Platform.cs
│   └── TimeWindow.cs
├── Enums/
│   ├── SentimentType.cs
│   ├── PostStatus.cs
│   └── UserRole.cs
├── Exceptions/
│   ├── DomainException.cs
│   ├── InvalidSentimentScoreException.cs
│   └── InvalidPostContentException.cs
├── Events/
│   ├── PostAnalyzedEvent.cs
│   ├── TrendDetectedEvent.cs
│   └── UserCreatedEvent.cs
├── Specifications/
│   ├── PostSpecifications.cs
│   └── TrendSpecifications.cs
└── Services/
    ├── ISentimentDomainService.cs
    └── ITrendCalculationService.cs
```

**Example Entity Implementation**:
```csharp
namespace SentimentAnalysis.Domain.Entities
{
    public class SocialMediaPost : AggregateRoot
    {
        public PostId Id { get; private set; }
        public string Content { get; private set; }
        public Platform Platform { get; private set; }
        public UserId UserId { get; private set; }
        public DateTime Timestamp { get; private set; }
        public PostStatus Status { get; private set; }
        
        private readonly List<DomainEvent> _domainEvents = new();
        public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

        private SocialMediaPost() { } // EF Constructor

        public SocialMediaPost(string content, Platform platform, UserId userId)
        {
            Id = PostId.New();
            Content = Guard.Against.NullOrEmpty(content, nameof(content));
            Platform = Guard.Against.Null(platform, nameof(platform));
            UserId = Guard.Against.Null(userId, nameof(userId));
            Timestamp = DateTime.UtcNow;
            Status = PostStatus.Pending;
            
            _domainEvents.Add(new PostCreatedEvent(Id, Platform, Timestamp));
        }

        public void MarkAsProcessing()
        {
            if (Status != PostStatus.Pending)
                throw new InvalidOperationException("Only pending posts can be marked as processing");
                
            Status = PostStatus.Processing;
            _domainEvents.Add(new PostProcessingStartedEvent(Id));
        }

        public void CompleteAnalysis(SentimentScore score)
        {
            Guard.Against.Null(score, nameof(score));
            
            if (Status != PostStatus.Processing)
                throw new InvalidOperationException("Only processing posts can be completed");
                
            Status = PostStatus.Completed;
            _domainEvents.Add(new PostAnalyzedEvent(Id, score, DateTime.UtcNow));
        }
    }
}
```

### SentimentAnalysis.Application

**Purpose**: Contains application business rules and use cases.

```
SentimentAnalysis.Application/
├── Common/
│   ├── Behaviors/
│   │   ├── ValidationBehavior.cs
│   │   ├── LoggingBehavior.cs
│   │   └── PerformanceBehavior.cs
│   ├── Interfaces/
│   │   ├── IApplicationDbContext.cs
│   │   ├── ICurrentUserService.cs
│   │   └── IDateTime.cs
│   ├── Mappings/
│   │   └── MappingProfile.cs
│   └── Models/
│       ├── Result.cs
│       └── PaginatedList.cs
├── Features/
│   ├── SentimentAnalysis/
│   │   ├── Commands/
│   │   │   ├── AnalyzePostCommand.cs
│   │   │   ├── BatchAnalyzeCommand.cs
│   │   │   └── UpdateAnalysisCommand.cs
│   │   ├── Queries/
│   │   │   ├── GetAnalysisQuery.cs
│   │   │   ├── GetBatchStatusQuery.cs
│   │   │   └── GetAnalysisHistoryQuery.cs
│   │   ├── DTOs/
│   │   │   ├── SentimentAnalysisDto.cs
│   │   │   └── BatchAnalysisDto.cs
│   │   └── Validators/
│   │       ├── AnalyzePostCommandValidator.cs
│   │       └── BatchAnalyzeCommandValidator.cs
│   ├── TrendAnalysis/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── DTOs/
│   │   └── Validators/
│   └── Users/
│       ├── Commands/
│       ├── Queries/
│       ├── DTOs/
│       └── Validators/
├── Services/
│   ├── ISentimentAnalysisService.cs
│   ├── ITrendAnalysisService.cs
│   └── INotificationService.cs
├── Events/
│   ├── EventHandlers/
│   │   ├── PostAnalyzedEventHandler.cs
│   │   └── TrendDetectedEventHandler.cs
│   └── IntegrationEvents/
│       ├── PostAnalysisCompletedIntegrationEvent.cs
│       └── TrendUpdateIntegrationEvent.cs
└── Extensions/
    └── ServiceCollectionExtensions.cs
```

**Example Command Implementation**:
```csharp
namespace SentimentAnalysis.Application.Features.SentimentAnalysis.Commands
{
    public record AnalyzePostCommand : IRequest<Result<SentimentAnalysisDto>>
    {
        public string Content { get; init; } = string.Empty;
        public string Platform { get; init; } = string.Empty;
        public string UserId { get; init; } = string.Empty;
        public string? SourceUrl { get; init; }
        public Dictionary<string, object>? Metadata { get; init; }
    }

    public class AnalyzePostCommandHandler : IRequestHandler<AnalyzePostCommand, Result<SentimentAnalysisDto>>
    {
        private readonly IApplicationDbContext _context;
        private readonly ISentimentAnalysisService _sentimentService;
        private readonly IMapper _mapper;
        private readonly ILogger<AnalyzePostCommandHandler> _logger;

        public AnalyzePostCommandHandler(
            IApplicationDbContext context,
            ISentimentAnalysisService sentimentService,
            IMapper mapper,
            ILogger<AnalyzePostCommandHandler> logger)
        {
            _context = context;
            _sentimentService = sentimentService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<SentimentAnalysisDto>> Handle(
            AnalyzePostCommand request, 
            CancellationToken cancellationToken)
        {
            try
            {
                var platform = Platform.FromString(request.Platform);
                var userId = UserId.FromString(request.UserId);
                
                var post = new SocialMediaPost(request.Content, platform, userId);
                
                _context.SocialMediaPosts.Add(post);
                await _context.SaveChangesAsync(cancellationToken);
                
                var analysis = await _sentimentService.AnalyzeAsync(post, cancellationToken);
                
                return Result<SentimentAnalysisDto>.Success(_mapper.Map<SentimentAnalysisDto>(analysis));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error analyzing post sentiment");
                return Result<SentimentAnalysisDto>.Failure("Failed to analyze sentiment");
            }
        }
    }
}
```

## Infrastructure Layer

### SentimentAnalysis.Infrastructure

**Purpose**: External concerns like file systems, web services, email, etc.

```
SentimentAnalysis.Infrastructure/
├── Services/
│   ├── EmailService.cs
│   ├── SentimentAnalysisService.cs
│   ├── RedditApiService.cs
│   └── NotificationService.cs
├── MachineLearning/
│   ├── MLNetSentimentAnalyzer.cs
│   ├── ModelLoader.cs
│   └── FeatureExtractor.cs
├── Authentication/
│   ├── JwtTokenService.cs
│   ├── GoogleOAuthService.cs
│   └── ApiKeyAuthenticationHandler.cs
├── Caching/
│   ├── RedisCacheService.cs
│   └── MemoryCacheService.cs
├── MessageBus/
│   ├── PubSubEventBus.cs
│   ├── EventPublisher.cs
│   └── EventSubscriber.cs
├── Files/
│   ├── CloudStorageService.cs
│   └── FileUploadService.cs
└── Extensions/
    └── ServiceCollectionExtensions.cs
```

### SentimentAnalysis.Persistence

**Purpose**: Database access and Entity Framework configuration.

```
SentimentAnalysis.Persistence/
├── Configurations/
│   ├── SocialMediaPostConfiguration.cs
│   ├── SentimentAnalysisConfiguration.cs
│   ├── TrendAnalysisConfiguration.cs
│   └── UserConfiguration.cs
├── Migrations/
│   ├── 20240101000000_InitialCreate.cs
│   ├── 20240115000000_AddTrendAnalysis.cs
│   └── 20240201000000_AddIndexes.cs
├── Repositories/
│   ├── SocialMediaPostRepository.cs
│   ├── SentimentAnalysisRepository.cs
│   ├── TrendAnalysisRepository.cs
│   └── UserRepository.cs
├── SentimentAnalysisDbContext.cs
├── DependencyInjection.cs
└── Interceptors/
    ├── AuditableEntitySaveChangesInterceptor.cs
    └── PublishDomainEventsInterceptor.cs
```

## Microservices Structure

### Individual Service Structure

Each microservice follows the same clean architecture pattern:

```
AuthService/
├── src/
│   ├── AuthService.Domain/           # Domain entities specific to auth
│   ├── AuthService.Application/      # Auth use cases and business logic
│   ├── AuthService.Infrastructure/   # External services integration
│   ├── AuthService.Persistence/      # Data access for auth
│   └── AuthService.API/             # API endpoints and controllers
├── tests/
│   ├── AuthService.UnitTests/
│   ├── AuthService.IntegrationTests/
│   └── AuthService.FunctionalTests/
├── dockerfile
├── AuthService.sln
└── README.md
```

### Shared Libraries

#### SentimentAnalysis.Shared

```
SentimentAnalysis.Shared/
├── Constants/
│   ├── ApiVersions.cs
│   ├── CacheKeys.cs
│   └── EventTypes.cs
├── Exceptions/
│   ├── BusinessRuleValidationException.cs
│   ├── NotFoundException.cs
│   └── ValidationException.cs
├── Extensions/
│   ├── StringExtensions.cs
│   ├── DateTimeExtensions.cs
│   └── EnumExtensions.cs
├── Guards/
│   └── Guard.cs
├── Helpers/
│   ├── HashHelper.cs
│   ├── JsonHelper.cs
│   └── ValidationHelper.cs
└── Models/
    ├── ApiResponse.cs
    ├── PagedResult.cs
    └── ErrorDetails.cs
```

#### SentimentAnalysis.EventBus

```
SentimentAnalysis.EventBus/
├── Abstractions/
│   ├── IEventBus.cs
│   ├── IIntegrationEvent.cs
│   └── IIntegrationEventHandler.cs
├── Events/
│   ├── IntegrationEvent.cs
│   ├── PostAnalysisCompletedEvent.cs
│   ├── TrendUpdateEvent.cs
│   └── UserActivityEvent.cs
├── Handlers/
│   └── IIntegrationEventHandler.cs
└── Extensions/
    └── ServiceCollectionExtensions.cs
```

## Testing Structure

### Test Organization

```
tests/
├── UnitTests/
│   ├── SentimentAnalysis.Domain.UnitTests/
│   ├── SentimentAnalysis.Application.UnitTests/
│   ├── SentimentAnalysis.Infrastructure.UnitTests/
│   └── SentimentAnalysis.API.UnitTests/
├── IntegrationTests/
│   ├── SentimentAnalysis.API.IntegrationTests/
│   ├── SentimentAnalysis.Persistence.IntegrationTests/
│   └── SentimentAnalysis.Infrastructure.IntegrationTests/
├── EndToEndTests/
│   ├── SentimentAnalysis.E2E.Tests/
│   └── SentimentAnalysis.Performance.Tests/
└── TestUtilities/
    ├── TestFixtures/
    ├── Builders/
    └── Helpers/
```

### Test Examples

**Unit Test Example**:
```csharp
namespace SentimentAnalysis.Domain.UnitTests.Entities
{
    public class SocialMediaPostTests
    {
        [Fact]
        public void Create_WithValidParameters_ShouldCreatePost()
        {
            // Arrange
            var content = "Test content";
            var platform = Platform.Reddit;
            var userId = UserId.New();

            // Act
            var post = new SocialMediaPost(content, platform, userId);

            // Assert
            post.Content.Should().Be(content);
            post.Platform.Should().Be(platform);
            post.UserId.Should().Be(userId);
            post.Status.Should().Be(PostStatus.Pending);
            post.DomainEvents.Should().ContainSingle(e => e is PostCreatedEvent);
        }

        [Fact]
        public void MarkAsProcessing_WhenPending_ShouldUpdateStatus()
        {
            // Arrange
            var post = CreateValidPost();

            // Act
            post.MarkAsProcessing();

            // Assert
            post.Status.Should().Be(PostStatus.Processing);
            post.DomainEvents.Should().Contain(e => e is PostProcessingStartedEvent);
        }

        private SocialMediaPost CreateValidPost()
        {
            return new SocialMediaPost("Test content", Platform.Reddit, UserId.New());
        }
    }
}
```

**Integration Test Example**:
```csharp
namespace SentimentAnalysis.API.IntegrationTests.Controllers
{
    public class SentimentAnalysisControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public SentimentAnalysisControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task AnalyzePost_WithValidRequest_ShouldReturnAnalysis()
        {
            // Arrange
            var request = new AnalyzePostRequest
            {
                Content = "This is a great product!",
                Platform = "reddit",
                UserId = "user123"
            };

            // Act
            var response = await _client.PostAsJsonAsync("/api/sentiment/analyze", request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var result = await response.Content.ReadFromJsonAsync<SentimentAnalysisResponse>();
            result.Should().NotBeNull();
            result.OverallSentiment.Should().Be("positive");
        }
    }
}
```

## Configuration and Dependency Injection

### Program.cs Structure

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);
builder.Services.AddPersistenceServices(builder.Configuration);
builder.Services.AddPresentationServices();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

app.MapControllers();
app.MapHealthChecks("/health");

await app.RunAsync();
```

### Dependency Registration

```csharp
public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddMediatR(Assembly.GetExecutingAssembly());
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
        services.AddAutoMapper(Assembly.GetExecutingAssembly());
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        
        return services;
    }

    public static IServiceCollection AddInfrastructureServices(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        services.AddScoped<ISentimentAnalysisService, MLNetSentimentAnalysisService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IEventBus, PubSubEventBus>();
        
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.Configure<RedisSettings>(configuration.GetSection("Redis"));
        
        return services;
    }
}
```

## Development Guidelines

### 1. Naming Conventions

- **Namespaces**: Follow the assembly structure
- **Classes**: PascalCase with descriptive names
- **Methods**: PascalCase verbs describing the action
- **Properties**: PascalCase nouns
- **Fields**: camelCase with underscore prefix for private fields

### 2. Code Organization

- **One class per file** with the file name matching the class name
- **Logical grouping** of related functionality in folders
- **Interface segregation** with focused, single-purpose interfaces
- **Dependency injection** for all external dependencies

### 3. Error Handling

- **Domain exceptions** for business rule violations
- **Result pattern** for operation outcomes
- **Global exception handling** middleware
- **Structured logging** for debugging and monitoring

This project structure provides a solid foundation for building a maintainable, testable, and scalable social media sentiment analysis platform following clean architecture principles and .NET best practices.