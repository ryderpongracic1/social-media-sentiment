# Use the official .NET 9 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Use the official .NET 9 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files and restore dependencies
COPY ["SentimentAnalysis.API/SentimentAnalysis.API.csproj", "SentimentAnalysis.API/"]
COPY ["SentimentAnalysis.Domain/SentimentAnalysis.Domain.csproj", "SentimentAnalysis.Domain/"]
COPY ["SentimentAnalysis.Infrastructure.Data/SentimentAnalysis.Infrastructure.Data.csproj", "SentimentAnalysis.Infrastructure.Data/"]

RUN dotnet restore "SentimentAnalysis.API/SentimentAnalysis.API.csproj"

# Copy source code
COPY . .

# Build the application
WORKDIR "/src/SentimentAnalysis.API"
RUN dotnet build "SentimentAnalysis.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "SentimentAnalysis.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage - runtime image
FROM base AS final
WORKDIR /app

# Create non-root user for security
RUN adduser --disabled-password --gecos '' --shell /bin/bash --home /home/appuser appuser && \
    chown -R appuser:appuser /app
USER appuser

# Copy published application
COPY --from=publish --chown=appuser:appuser /app/publish .

# Install Entity Framework Core tools for migrations
USER root
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --channel 9.0 --install-dir /usr/share/dotnet && \
    ln -s /usr/share/dotnet/dotnet /usr/bin/dotnet && \
    dotnet tool install --global dotnet-ef --version 9.0.0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add dotnet tools to PATH
ENV PATH="${PATH}:/root/.dotnet/tools"

# Switch back to non-root user
USER appuser

# Set environment variables
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_HTTP_PORTS=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Entry point
ENTRYPOINT ["dotnet", "SentimentAnalysis.API.dll"]