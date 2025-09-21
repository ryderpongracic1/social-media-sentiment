# Docker Configuration for Azure Deployment

This document describes the Docker configuration fixes implemented to resolve Azure deployment issues.

## 🔧 Issues Fixed

### 1. .NET Version Compatibility
- **Problem**: .NET 9.0 may not be fully supported in Azure Container Instances
- **Solution**: Downgraded to .NET 8.0 LTS for better Azure compatibility
- **Files Changed**: All `.csproj` files updated to target `net8.0`

### 2. Multi-Stage Build Optimization
- **Problem**: Complex multi-stage build with potential context issues
- **Solution**: Simplified and optimized build stages with better layer caching
- **Improvements**:
  - Explicit platform specification (`--platform=linux/amd64`)
  - Better layer ordering for cache efficiency
  - Retry logic for package restore

### 3. Root User Operations
- **Problem**: Root user operations (lines 44-51) that fail in Azure Container Instances
- **Solution**: Eliminated problematic root user operations
- **Changes**:
  - EF Core tools installed in user directory (`/home/appuser/.dotnet/tools`)
  - Non-root user created early in base image
  - Minimal root operations only for system packages

### 4. Architecture Compatibility
- **Problem**: Potential ARM64 vs x64 compatibility issues
- **Solution**: Explicit x64 architecture specification
- **Implementation**: `--platform=linux/amd64` in build stage

### 5. Entity Framework Tools
- **Problem**: Missing build dependencies for EF tools installation
- **Solution**: Proper EF tools installation as non-root user
- **Implementation**:
  - Tools installed in user-specific directory
  - PATH updated to include tools directory
  - Version pinned to .NET 8.0 compatible version

## 📁 New Files Created

### 1. `.dockerignore`
Comprehensive Docker ignore file to optimize build context and reduce image size.

### 2. `SentimentAnalysis.API/Scripts/validate-docker-build.sh`
Bash script for validating Docker build and Azure compatibility on Unix systems.

### 3. `SentimentAnalysis.API/Scripts/validate-docker-build.ps1`
PowerShell script for validating Docker build and Azure compatibility on Windows systems.

## 🐳 Dockerfile Structure

```dockerfile
# Base stage - .NET 8.0 runtime with non-root user
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Build stage - .NET 8.0 SDK with explicit platform
FROM --platform=linux/amd64 mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Publish stage - optimized publish
FROM build AS publish

# Final stage - runtime with security and validation
FROM base AS final
```

## 🔒 Security Improvements

1. **Non-root user**: Container runs as `appuser` (non-root)
2. **Minimal root operations**: Only essential system packages installed as root
3. **User-specific tools**: EF tools installed in user directory
4. **Environment validation**: Startup script validates configuration

## 🏥 Health Checks

- **Endpoint**: `/health`
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Start period**: 60 seconds
- **Retries**: 3

## 🌐 Environment Variables

### Required for Production
- `ConnectionStrings__DefaultConnection`: Database connection string
- `ASPNETCORE_ENVIRONMENT`: Set to "Production"

### Optional
- `FRONTEND_DOMAIN`: Frontend domain for CORS
- `AZURE_STATIC_WEB_APP_URL`: Azure Static Web App URL
- `Azure__ApplicationInsights__ConnectionString`: Application Insights

### Automatically Set
- `ASPNETCORE_URLS=http://+:8080`
- `ASPNETCORE_HTTP_PORTS=8080`
- `DOTNET_RUNNING_IN_CONTAINER=true`
- `DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1`

## 🚀 Usage

### Local Development
```bash
# Build the image
docker build -t sentiment-analysis-api -f SentimentAnalysis.API/Dockerfile .

# Run with docker-compose (recommended)
docker-compose up --build
```

### Validation
```bash
# Unix/Linux/macOS
./SentimentAnalysis.API/Scripts/validate-docker-build.sh

# Windows PowerShell
.\SentimentAnalysis.API\Scripts\validate-docker-build.ps1
```

### Azure Deployment
The Docker image is now optimized for Azure Container Instances and Azure App Service.

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name sentiment-api \
  --image myregistry.azurecr.io/sentiment-analysis-api:latest \
  --cpu 1 \
  --memory 2 \
  --ports 8080 \
  --environment-variables \
    ASPNETCORE_ENVIRONMENT=Production \
    ConnectionStrings__DefaultConnection="your-connection-string"
```

#### Azure App Service
```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppServicePlan \
  --name sentiment-api \
  --deployment-container-image-name myregistry.azurecr.io/sentiment-analysis-api:latest
```

## 🔍 Troubleshooting

### Container Won't Start
1. Check container logs: `docker logs <container-name>`
2. Verify environment variables are set correctly
3. Ensure database connection string is valid
4. Run validation script for detailed diagnostics

### Health Check Failures
1. Verify application is listening on port 8080
2. Check if `/health` endpoint is accessible
3. Ensure database connectivity (health check includes DB check)

### Permission Issues
1. Verify container is running as `appuser`
2. Check file permissions in container
3. Ensure EF tools are in correct PATH

### Azure Deployment Issues
1. Verify image architecture is x64 (`linux/amd64`)
2. Check Azure resource limits (CPU/Memory)
3. Validate environment variables in Azure configuration
4. Review Azure Container Instance or App Service logs

## 📊 Performance Considerations

- **Image Size**: Optimized with multi-stage build and .dockerignore
- **Startup Time**: Improved with better layer caching
- **Memory Usage**: .NET 8.0 has better memory efficiency
- **Security**: Non-root user reduces attack surface

## 🔄 CI/CD Integration

The Docker configuration is compatible with:
- GitHub Actions
- Azure DevOps Pipelines
- Azure Container Registry
- Docker Hub

Example GitHub Actions workflow:
```yaml
- name: Build and push Docker image
  run: |
    docker build -t ${{ secrets.REGISTRY_LOGIN_SERVER }}/sentiment-analysis-api:${{ github.sha }} -f SentimentAnalysis.API/Dockerfile .
    docker push ${{ secrets.REGISTRY_LOGIN_SERVER }}/sentiment-analysis-api:${{ github.sha }}
```

## 📝 Migration Notes

### From .NET 9.0 to .NET 8.0
- All package references updated to .NET 8.0 compatible versions
- No breaking changes in application code required
- Better long-term support and Azure compatibility

### Docker Compose Changes
No changes required to existing `docker-compose.yml` - it will automatically use the new Dockerfile.

## 🆘 Support

If you encounter issues:
1. Run the validation script first
2. Check the troubleshooting section
3. Review container logs
4. Verify Azure resource configuration
5. Check network connectivity and firewall rules