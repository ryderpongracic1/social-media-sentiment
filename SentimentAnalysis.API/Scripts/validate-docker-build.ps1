# Docker Build Validation Script for Azure Deployment (PowerShell)
# This script validates the Docker build process and container functionality

param(
    [string]$ImageName = "sentiment-analysis-api",
    [string]$ContainerName = "sentiment-test-container",
    [int]$TestPort = 8080
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🐳 Docker Build Validation Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

# Function to cleanup
function Cleanup {
    Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
    try {
        docker stop $ContainerName 2>$null
        docker rm $ContainerName 2>$null
    }
    catch {
        # Ignore cleanup errors
    }
}

# Register cleanup on exit
Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

try {
    # Check if Docker is running
    try {
        docker info | Out-Null
        Write-Success "Docker is running"
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        exit 1
    }

    # Build the Docker image
    Write-Host "🔨 Building Docker image..." -ForegroundColor Cyan
    $buildResult = docker build -t $ImageName -f SentimentAnalysis.API/Dockerfile .
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Docker image built successfully"
    }
    else {
        Write-Error "Docker build failed"
        exit 1
    }

    # Check image size
    $imageSize = docker images $ImageName --format "{{.Size}}"
    Write-Success "Image size: $imageSize"

    # Inspect the image
    Write-Host "🔍 Inspecting Docker image..." -ForegroundColor Cyan
    docker inspect $ImageName | Out-Null
    Write-Success "Image inspection passed"

    # Test container startup
    Write-Host "🚀 Testing container startup..." -ForegroundColor Cyan
    $runResult = docker run -d --name $ContainerName -p "${TestPort}:8080" `
        -e ASPNETCORE_ENVIRONMENT=Production `
        -e ConnectionStrings__DefaultConnection="Host=localhost;Database=test;Username=test;Password=test" `
        $ImageName

    if ($LASTEXITCODE -eq 0) {
        Write-Success "Container started successfully"
    }
    else {
        Write-Error "Container failed to start"
        exit 1
    }

    # Wait for container to be ready
    Write-Host "⏳ Waiting for container to be ready..." -ForegroundColor Cyan
    Start-Sleep -Seconds 10

    # Check if container is still running
    $runningContainers = docker ps --format "{{.Names}}"
    if ($runningContainers -contains $ContainerName) {
        Write-Success "Container is running"
    }
    else {
        Write-Error "Container stopped unexpectedly"
        Write-Host "Container logs:" -ForegroundColor Yellow
        docker logs $ContainerName
        exit 1
    }

    # Test health endpoint
    Write-Host "🏥 Testing health endpoint..." -ForegroundColor Cyan
    $healthCheckPassed = $false
    for ($i = 1; $i -le 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$TestPort/health" -UseBasicParsing -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                Write-Success "Health endpoint is responding"
                $healthCheckPassed = $true
                break
            }
        }
        catch {
            if ($i -eq 30) {
                Write-Error "Health endpoint failed to respond after 30 attempts"
                Write-Host "Container logs:" -ForegroundColor Yellow
                docker logs $ContainerName
                exit 1
            }
            else {
                Write-Host "Attempt $i/30: Health endpoint not ready, waiting..." -ForegroundColor Gray
                Start-Sleep -Seconds 2
            }
        }
    }

    # Test root endpoint
    Write-Host "🌐 Testing root endpoint..." -ForegroundColor Cyan
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:$TestPort/" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Success "Root endpoint is responding"
        }
    }
    catch {
        Write-Warning "Root endpoint is not responding (this may be expected)"
    }

    # Check container user
    Write-Host "👤 Checking container user..." -ForegroundColor Cyan
    try {
        $containerUser = docker exec $ContainerName whoami 2>$null
        if ($containerUser -eq "appuser") {
            Write-Success "Container is running as non-root user: $containerUser"
        }
        elseif ($containerUser -eq "root") {
            Write-Warning "Container is running as root user (not recommended for production)"
        }
        else {
            Write-Warning "Container user: $containerUser"
        }
    }
    catch {
        Write-Warning "Could not determine container user"
    }

    # Check EF tools availability
    Write-Host "🛠️ Checking Entity Framework tools..." -ForegroundColor Cyan
    try {
        $efVersion = docker exec $ContainerName /home/appuser/.dotnet/tools/dotnet-ef --version 2>$null
        if ($efVersion) {
            Write-Success "Entity Framework tools available: $($efVersion[0])"
        }
    }
    catch {
        Write-Warning "Entity Framework tools not available or not in PATH"
    }

    # Check container logs for errors
    Write-Host "📋 Checking container logs for errors..." -ForegroundColor Cyan
    $logs = docker logs $ContainerName 2>&1
    $errorLogs = $logs | Where-Object { $_ -match "error|exception|fail" -and $_ -notmatch "HealthCheck" }
    if ($errorLogs) {
        Write-Warning "Found potential errors in container logs:"
        $errorLogs | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    }
    else {
        Write-Success "No errors found in container logs"
    }

    # Performance check
    Write-Host "📊 Performance check..." -ForegroundColor Cyan
    $stats = docker stats $ContainerName --no-stream --format "{{.MemUsage}},{{.CPUPerc}}"
    $memUsage, $cpuUsage = $stats -split ","
    Write-Success "Memory usage: $memUsage"
    Write-Success "CPU usage: $cpuUsage"

    # Azure compatibility checks
    Write-Host "☁️ Azure compatibility checks..." -ForegroundColor Cyan
    Write-Success "Checking for Azure Container Instances compatibility..."

    # Check architecture
    try {
        $arch = docker exec $ContainerName uname -m 2>$null
        if ($arch -eq "x86_64") {
            Write-Success "Architecture: $arch (compatible with Azure)"
        }
        else {
            Write-Warning "Architecture: $arch (may not be compatible with Azure x64)"
        }
    }
    catch {
        Write-Warning "Could not determine container architecture"
    }

    # Check environment variables
    Write-Success "Environment variables check:"
    try {
        $envVars = docker exec $ContainerName printenv 2>$null | Where-Object { $_ -match "^(ASPNETCORE_|DOTNET_)" }
        $envVars | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
    }
    catch {
        Write-Warning "Could not retrieve environment variables"
    }

    Write-Host ""
    Write-Host "🎉 Docker build validation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Summary:" -ForegroundColor Cyan
    Write-Host "  - Image: $ImageName" -ForegroundColor Gray
    Write-Host "  - Size: $imageSize" -ForegroundColor Gray
    Write-Host "  - User: $containerUser" -ForegroundColor Gray
    Write-Host "  - Architecture: $arch" -ForegroundColor Gray
    Write-Host "  - Health endpoint: ✓" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 Ready for Azure deployment!" -ForegroundColor Green

}
catch {
    Write-Error "Validation failed: $($_.Exception.Message)"
    exit 1
}
finally {
    Cleanup
}