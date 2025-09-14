using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SentimentAnalysis.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SocialMediaPosts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Platform = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    UserName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceUrl = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    SourceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    UpVotes = table.Column<int>(type: "integer", nullable: false),
                    DownVotes = table.Column<int>(type: "integer", nullable: false),
                    CommentCount = table.Column<int>(type: "integer", nullable: false),
                    Language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false, defaultValue: "en"),
                    RawMetadata = table.Column<string>(type: "jsonb", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SocialMediaPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TrendAnalyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Keyword = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Platform = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    TrendScore = table.Column<float>(type: "real", precision: 8, scale: 4, nullable: false),
                    MentionCount = table.Column<int>(type: "integer", nullable: false),
                    AvgSentimentScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false),
                    TimeWindowStart = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TimeWindowEnd = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    WindowType = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    RelatedKeywords = table.Column<string>(type: "jsonb", nullable: true),
                    GeographicData = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrendAnalyses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FirstName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Role = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    LastLoginAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    ApiKey = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    DailyApiLimit = table.Column<int>(type: "integer", nullable: false, defaultValue: 1000),
                    ApiCallsToday = table.Column<int>(type: "integer", nullable: false, defaultValue: 0)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProcessingQueue",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    Priority = table.Column<int>(type: "integer", nullable: false, defaultValue: 5),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    ProcessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RetryCount = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    ErrorMessage = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcessingQueue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProcessingQueue_SocialMediaPosts_PostId",
                        column: x => x.PostId,
                        principalTable: "SocialMediaPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SentimentAnalyses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    PositiveScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false),
                    NegativeScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false),
                    NeutralScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false),
                    OverallSentiment = table.Column<int>(type: "integer", nullable: false),
                    ConfidenceScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false),
                    IsSarcastic = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SarcasmScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false, defaultValue: 0f),
                    ModelVersion = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    AnalyzedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "NOW()"),
                    ProcessingTime = table.Column<TimeSpan>(type: "interval", nullable: false),
                    ExtractedKeywords = table.Column<string>(type: "jsonb", nullable: true),
                    ExtractedEntities = table.Column<string>(type: "jsonb", nullable: true),
                    DetailedScores = table.Column<string>(type: "jsonb", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentimentAnalyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SentimentAnalyses_SocialMediaPosts_PostId",
                        column: x => x.PostId,
                        principalTable: "SocialMediaPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TrendKeywords",
                columns: table => new
                {
                    PostId = table.Column<Guid>(type: "uuid", nullable: false),
                    TrendAnalysisId = table.Column<Guid>(type: "uuid", nullable: false),
                    Keyword = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    RelevanceScore = table.Column<float>(type: "real", precision: 5, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrendKeywords", x => new { x.PostId, x.TrendAnalysisId, x.Keyword });
                    table.ForeignKey(
                        name: "FK_TrendKeywords_SocialMediaPosts_PostId",
                        column: x => x.PostId,
                        principalTable: "SocialMediaPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrendKeywords_TrendAnalyses_TrendAnalysisId",
                        column: x => x.TrendAnalysisId,
                        principalTable: "TrendAnalyses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProcessingQueue_PostId",
                table: "ProcessingQueue",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_ProcessingQueue_Status_Priority_CreatedAt",
                table: "ProcessingQueue",
                columns: new[] { "Status", "Priority", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_ProcessingQueue_Status_RetryCount",
                table: "ProcessingQueue",
                columns: new[] { "Status", "RetryCount" });

            migrationBuilder.CreateIndex(
                name: "IX_SentimentAnalysis_ConfidenceScore",
                table: "SentimentAnalyses",
                column: "ConfidenceScore");

            migrationBuilder.CreateIndex(
                name: "IX_SentimentAnalysis_OverallSentiment_AnalyzedAt",
                table: "SentimentAnalyses",
                columns: new[] { "OverallSentiment", "AnalyzedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_SentimentAnalysis_PostId",
                table: "SentimentAnalyses",
                column: "PostId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SocialMediaPosts_Platform_Timestamp",
                table: "SocialMediaPosts",
                columns: new[] { "Platform", "Timestamp" });

            migrationBuilder.CreateIndex(
                name: "IX_SocialMediaPosts_ProcessedAt",
                table: "SocialMediaPosts",
                column: "ProcessedAt",
                filter: "ProcessedAt IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_SocialMediaPosts_SourceId_Platform",
                table: "SocialMediaPosts",
                columns: new[] { "SourceId", "Platform" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SocialMediaPosts_Status_CreatedAt",
                table: "SocialMediaPosts",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_SocialMediaPosts_Timestamp_Include",
                table: "SocialMediaPosts",
                column: "Timestamp")
                .Annotation("Npgsql:IndexInclude", new[] { "Platform", "Status", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_TrendAnalysis_Keyword_Platform_TimeWindow",
                table: "TrendAnalyses",
                columns: new[] { "Keyword", "Platform", "TimeWindowStart" });

            migrationBuilder.CreateIndex(
                name: "IX_TrendAnalysis_Platform_TimeWindow",
                table: "TrendAnalyses",
                columns: new[] { "Platform", "TimeWindowStart" });

            migrationBuilder.CreateIndex(
                name: "IX_TrendAnalysis_TimeWindowStart",
                table: "TrendAnalyses",
                column: "TimeWindowStart");

            migrationBuilder.CreateIndex(
                name: "IX_TrendAnalysis_TrendScore_TimeWindow",
                table: "TrendAnalyses",
                columns: new[] { "TrendScore", "TimeWindowStart" });

            migrationBuilder.CreateIndex(
                name: "IX_TrendKeywords_Keyword",
                table: "TrendKeywords",
                column: "Keyword");

            migrationBuilder.CreateIndex(
                name: "IX_TrendKeywords_PostId_RelevanceScore",
                table: "TrendKeywords",
                columns: new[] { "PostId", "RelevanceScore" });

            migrationBuilder.CreateIndex(
                name: "IX_TrendKeywords_RelevanceScore",
                table: "TrendKeywords",
                column: "RelevanceScore");

            migrationBuilder.CreateIndex(
                name: "IX_TrendKeywords_TrendAnalysisId",
                table: "TrendKeywords",
                column: "TrendAnalysisId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ApiKey",
                table: "Users",
                column: "ApiKey",
                unique: true,
                filter: "ApiKey IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Role_IsActive",
                table: "Users",
                columns: new[] { "Role", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProcessingQueue");

            migrationBuilder.DropTable(
                name: "SentimentAnalyses");

            migrationBuilder.DropTable(
                name: "TrendKeywords");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "SocialMediaPosts");

            migrationBuilder.DropTable(
                name: "TrendAnalyses");
        }
    }
}
