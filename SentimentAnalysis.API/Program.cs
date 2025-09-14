using SentimentAnalysis.Infrastructure.Data;
using SentimentAnalysis.Infrastructure.Data.DbContext;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add database services
builder.Services.AddInfrastructureDataServices(builder.Configuration);

// Add health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<SentimentAnalysisDbContext>("database");

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
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
