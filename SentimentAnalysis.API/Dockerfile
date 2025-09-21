# Use .NET 8.0 for better Azure compatibility
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Create non-root user early for security
RUN groupadd -r appuser && useradd -r -g appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

# Use .NET 8.0 SDK for building with explicit platform
FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files in correct order for better layer caching
COPY ["SentimentAnalysis.Domain/SentimentAnalysis.Domain.csproj", "SentimentAnalysis.Domain/"]
COPY ["SentimentAnalysis.Infrastructure.Data/SentimentAnalysis.Infrastructure.Data.csproj", "SentimentAnalysis.Infrastructure.Data/"]
COPY ["SentimentAnalysis.API/SentimentAnalysis.API.csproj", "SentimentAnalysis.API/"]

# Restore dependencies with retry logic
RUN dotnet restore "SentimentAnalysis.API/SentimentAnalysis.API.csproj" --verbosity normal || \
    (echo "First restore attempt failed, retrying..." && sleep 5 && dotnet restore "SentimentAnalysis.API/SentimentAnalysis.API.csproj" --verbosity normal)

# Copy all source code
COPY . .

# Build the application with explicit configuration
WORKDIR "/src/SentimentAnalysis.API"
RUN dotnet build "SentimentAnalysis.API.csproj" -c $BUILD_CONFIGURATION -o /app/build --no-restore

# Publish stage - simplified
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SentimentAnalysis.API.csproj" \
    -c $BUILD_CONFIGURATION \
    -o /app/publish \
    --no-restore \
    --no-build \
    /p:UseAppHost=false \
    /p:PublishReadyToRun=false

# Final runtime stage
FROM base AS final
WORKDIR /app

# Switch to root temporarily for system setup only
USER root

# Install curl for health checks and clean up in same layer
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Create directory for EF tools and set permissions
RUN mkdir -p /home/appuser/.dotnet/tools && \
    chown -R appuser:appuser /home/appuser/.dotnet && \
    chown -R appuser:appuser /app

# Switch back to non-root user permanently
USER appuser

# Copy published application with correct ownership
COPY --from=publish --chown=appuser:appuser /app/publish .

# Install EF Core tools as non-root user in user directory
RUN dotnet tool install --global dotnet-ef --version 8.0.0 --tool-path /home/appuser/.dotnet/tools

# Set environment variables with validation
ENV ASPNETCORE_ENVIRONMENT=Production \
    ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_HTTP_PORTS=8080 \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1 \
    PATH="${PATH}:/home/appuser/.dotnet/tools"

# Add startup script for environment validation
RUN echo '#!/bin/bash\n\
set -e\n\
echo "Starting Sentiment Analysis API..."\n\
echo "Environment: $ASPNETCORE_ENVIRONMENT"\n\
echo "URLs: $ASPNETCORE_URLS"\n\
\n\
# Validate required environment variables for production\n\
if [ "$ASPNETCORE_ENVIRONMENT" = "Production" ]; then\n\
    echo "Validating production environment variables..."\n\
    if [ -z "$ConnectionStrings__DefaultConnection" ] && [ -z "$DB_HOST" ]; then\n\
        echo "Warning: No database connection configured"\n\
    fi\n\
fi\n\
\n\
echo "Starting application..."\n\
exec dotnet SentimentAnalysis.API.dll "$@"' > /app/startup.sh && \
    chmod +x /app/startup.sh

# Enhanced health check with better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || \
        (echo "Health check failed at $(date)" && exit 1)

# Use startup script as entrypoint
ENTRYPOINT ["/app/startup.sh"]