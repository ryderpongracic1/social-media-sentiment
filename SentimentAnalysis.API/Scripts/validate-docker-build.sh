#!/bin/bash

# Docker Build Validation Script for Azure Deployment
# This script validates the Docker build process and container functionality

set -e

echo "🐳 Docker Build Validation Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="sentiment-analysis-api"
CONTAINER_NAME="sentiment-test-container"
TEST_PORT="8080"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to cleanup
cleanup() {
    echo "🧹 Cleaning up..."
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
}

# Trap cleanup on exit
trap cleanup EXIT

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running"

# Build the Docker image
echo "🔨 Building Docker image..."
if docker build -t $IMAGE_NAME -f SentimentAnalysis.API/Dockerfile .; then
    print_status "Docker image built successfully"
else
    print_error "Docker build failed"
    exit 1
fi

# Check image size
IMAGE_SIZE=$(docker images $IMAGE_NAME --format "table {{.Size}}" | tail -n 1)
print_status "Image size: $IMAGE_SIZE"

# Inspect the image
echo "🔍 Inspecting Docker image..."
docker inspect $IMAGE_NAME > /dev/null
print_status "Image inspection passed"

# Test container startup
echo "🚀 Testing container startup..."
if docker run -d --name $CONTAINER_NAME -p $TEST_PORT:8080 \
    -e ASPNETCORE_ENVIRONMENT=Production \
    -e ConnectionStrings__DefaultConnection="Host=localhost;Database=test;Username=test;Password=test" \
    $IMAGE_NAME; then
    print_status "Container started successfully"
else
    print_error "Container failed to start"
    exit 1
fi

# Wait for container to be ready
echo "⏳ Waiting for container to be ready..."
sleep 10

# Check if container is still running
if docker ps | grep -q $CONTAINER_NAME; then
    print_status "Container is running"
else
    print_error "Container stopped unexpectedly"
    echo "Container logs:"
    docker logs $CONTAINER_NAME
    exit 1
fi

# Test health endpoint
echo "🏥 Testing health endpoint..."
for i in {1..30}; do
    if curl -f http://localhost:$TEST_PORT/health >/dev/null 2>&1; then
        print_status "Health endpoint is responding"
        break
    elif [ $i -eq 30 ]; then
        print_error "Health endpoint failed to respond after 30 attempts"
        echo "Container logs:"
        docker logs $CONTAINER_NAME
        exit 1
    else
        echo "Attempt $i/30: Health endpoint not ready, waiting..."
        sleep 2
    fi
done

# Test root endpoint
echo "🌐 Testing root endpoint..."
if curl -f http://localhost:$TEST_PORT/ >/dev/null 2>&1; then
    print_status "Root endpoint is responding"
else
    print_warning "Root endpoint is not responding (this may be expected)"
fi

# Check container user
echo "👤 Checking container user..."
CONTAINER_USER=$(docker exec $CONTAINER_NAME whoami 2>/dev/null || echo "unknown")
if [ "$CONTAINER_USER" = "appuser" ]; then
    print_status "Container is running as non-root user: $CONTAINER_USER"
elif [ "$CONTAINER_USER" = "root" ]; then
    print_warning "Container is running as root user (not recommended for production)"
else
    print_warning "Container user: $CONTAINER_USER"
fi

# Check EF tools availability
echo "🛠️ Checking Entity Framework tools..."
if docker exec $CONTAINER_NAME /home/appuser/.dotnet/tools/dotnet-ef --version >/dev/null 2>&1; then
    EF_VERSION=$(docker exec $CONTAINER_NAME /home/appuser/.dotnet/tools/dotnet-ef --version 2>/dev/null | head -n 1)
    print_status "Entity Framework tools available: $EF_VERSION"
else
    print_warning "Entity Framework tools not available or not in PATH"
fi

# Check container logs for errors
echo "📋 Checking container logs for errors..."
if docker logs $CONTAINER_NAME 2>&1 | grep -i error; then
    print_warning "Found errors in container logs (see above)"
else
    print_status "No errors found in container logs"
fi

# Performance check
echo "📊 Performance check..."
MEMORY_USAGE=$(docker stats $CONTAINER_NAME --no-stream --format "table {{.MemUsage}}" | tail -n 1)
CPU_USAGE=$(docker stats $CONTAINER_NAME --no-stream --format "table {{.CPUPerc}}" | tail -n 1)
print_status "Memory usage: $MEMORY_USAGE"
print_status "CPU usage: $CPU_USAGE"

# Azure compatibility checks
echo "☁️ Azure compatibility checks..."

# Check for common Azure issues
print_status "Checking for Azure Container Instances compatibility..."

# Check if running on correct architecture
ARCH=$(docker exec $CONTAINER_NAME uname -m 2>/dev/null || echo "unknown")
if [ "$ARCH" = "x86_64" ]; then
    print_status "Architecture: $ARCH (compatible with Azure)"
else
    print_warning "Architecture: $ARCH (may not be compatible with Azure x64)"
fi

# Check environment variables
print_status "Environment variables check:"
docker exec $CONTAINER_NAME printenv | grep -E "^(ASPNETCORE_|DOTNET_)" | while read line; do
    echo "  $line"
done

echo ""
echo "🎉 Docker build validation completed successfully!"
echo ""
echo "📝 Summary:"
echo "  - Image: $IMAGE_NAME"
echo "  - Size: $IMAGE_SIZE"
echo "  - User: $CONTAINER_USER"
echo "  - Architecture: $ARCH"
echo "  - Health endpoint: ✓"
echo ""
echo "🚀 Ready for Azure deployment!"