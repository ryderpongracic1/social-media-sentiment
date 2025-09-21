using SentimentAnalysis.Infrastructure.Data;
using SentimentAnalysis.Infrastructure.Data.DbContext;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add database services
builder.Services.AddInfrastructureDataServices(builder.Configuration);

// Add Application Insights telemetry
var appInsightsConnectionString = builder.Configuration["Azure:ApplicationInsights:ConnectionString"];
if (!string.IsNullOrEmpty(appInsightsConnectionString))
{
    builder.Services.AddApplicationInsightsTelemetry(options =>
    {
        options.ConnectionString = appInsightsConnectionString;
    });
}

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<SentimentAnalysisDbContext>("database");

// Add Swagger/OpenAPI for .NET 8.0 compatibility
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure CORS based on environment
builder.Services.AddCors(options =>
{
    if (builder.Environment.IsProduction())
    {
        // Production CORS - restrictive
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
        var allowCredentials = builder.Configuration.GetValue<bool>("Cors:AllowCredentials", false);
        
        options.AddDefaultPolicy(policy =>
        {
            if (allowedOrigins.Length > 0)
            {
                policy.WithOrigins(allowedOrigins);
            }
            else
            {
                // Fallback to environment variables
                var frontendDomain = Environment.GetEnvironmentVariable("FRONTEND_DOMAIN");
                var staticWebAppUrl = Environment.GetEnvironmentVariable("AZURE_STATIC_WEB_APP_URL");
                
                var origins = new List<string>();
                if (!string.IsNullOrEmpty(frontendDomain))
                {
                    origins.Add($"https://{frontendDomain}");
                    origins.Add($"https://www.{frontendDomain}");
                }
                if (!string.IsNullOrEmpty(staticWebAppUrl))
                {
                    origins.Add($"https://{staticWebAppUrl}");
                }
                
                if (origins.Count > 0)
                {
                    policy.WithOrigins(origins.ToArray());
                }
                else
                {
                    // Last resort - allow any origin (not recommended for production)
                    policy.AllowAnyOrigin();
                }
            }
            
            policy.AllowAnyMethod()
                  .AllowAnyHeader();
                  
            if (allowCredentials)
            {
                policy.AllowCredentials();
            }
        });
    }
    else
    {
        // Development CORS - permissive
        options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
    }
});

// Add JWT Authentication (if configured)
var jwtAuthority = builder.Configuration["Authentication:JwtBearer:Authority"];
var jwtAudience = builder.Configuration["Authentication:JwtBearer:Audience"];

if (!string.IsNullOrEmpty(jwtAuthority) && !string.IsNullOrEmpty(jwtAudience))
{
    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.Authority = jwtAuthority;
            options.Audience = jwtAudience;
            options.RequireHttpsMetadata = builder.Environment.IsProduction();
            options.SaveToken = true;
            
            // Configure token validation parameters
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = builder.Configuration.GetValue<bool>("Authentication:JwtBearer:ValidateIssuer", true),
                ValidateAudience = builder.Configuration.GetValue<bool>("Authentication:JwtBearer:ValidateAudience", true),
                ValidateLifetime = builder.Configuration.GetValue<bool>("Authentication:JwtBearer:ValidateLifetime", true),
                ValidateIssuerSigningKey = builder.Configuration.GetValue<bool>("Authentication:JwtBearer:ValidateIssuerSigningKey", true),
                ClockSkew = TimeSpan.Parse(builder.Configuration["Authentication:JwtBearer:ClockSkew"] ?? "00:05:00")
            };
        });
}

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

// Add a basic endpoint to verify API is running
app.MapGet("/", () => Results.Ok(new {
    Service = "Social Media Sentiment Analysis API",
    Version = "1.0.0",
    Status = "Running",
    Timestamp = DateTime.UtcNow
}))
.WithName("GetApiInfo")
.WithTags("System");

app.Run();
