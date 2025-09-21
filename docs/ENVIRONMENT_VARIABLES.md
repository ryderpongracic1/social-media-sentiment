# Environment Variables Reference

## Overview

This document provides a complete reference for all environment variables required by the Social Media Sentiment Analysis application. These variables are essential for proper application configuration across different environments (Development, Staging, Production).

## Table of Contents

1. [Environment Variable Categories](#environment-variable-categories)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Environment-Specific Configurations](#environment-specific-configurations)
5. [Configuration Examples](#configuration-examples)
6. [Validation and Testing](#validation-and-testing)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Environment Variable Categories

### Database Configuration
Variables for PostgreSQL database connectivity and configuration.

### Application Configuration
Core application settings including environment, logging, and feature flags.

### External Services
API keys and connection strings for third-party services (Reddit, Twitter, etc.).

### Authentication & Security
JWT configuration, encryption keys, and security settings.

### Monitoring & Logging
Application Insights, logging levels, and monitoring configuration.

### Infrastructure
Azure-specific settings, Redis cache, and other infrastructure components.

## Required Variables

### Database Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `DB_HOST` | PostgreSQL server hostname | `sentiment-analysis-db-server.postgres.database.azure.com` | All |
| `DB_NAME` | Database name | `sentiment_analysis_prod` | All |
| `DB_USER` | Database username | `dbadmin` | All |
| `DB_PASSWORD` | Database password | `YourSecurePassword123!` | All |
| `DB_PORT` | Database port | `5432` | All |

**Connection String Format:**
```
Host={DB_HOST};Database={DB_NAME};Username={DB_USER};Password={DB_PASSWORD};Port={DB_PORT};SSL Mode=Require;Trust Server Certificate=true;
```

**Azure Key Vault Reference:**
```bash
DB_PASSWORD="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)"
```

### Application Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `ASPNETCORE_ENVIRONMENT` | Application environment | `Production` | All |
| `FRONTEND_DOMAIN` | Frontend domain for CORS | `yourdomain.com` | All |
| `AZURE_STATIC_WEB_APP_URL` | Static Web App URL | `your-app.azurestaticapps.net` | Prod/Staging |

### External API Keys

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `REDDIT_CLIENT_ID` | Reddit API client ID | `your-reddit-client-id` | All |
| `REDDIT_CLIENT_SECRET` | Reddit API client secret | `your-reddit-client-secret` | All |
| `TWITTER_BEARER_TOKEN` | Twitter API bearer token | `your-twitter-bearer-token` | All |
| `TWITTER_API_KEY` | Twitter API key | `your-twitter-api-key` | All |
| `TWITTER_API_SECRET` | Twitter API secret | `your-twitter-api-secret` | All |

### Authentication Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `JWT_AUTHORITY` | JWT token authority | `https://login.microsoftonline.com/tenant-id/v2.0` | All |
| `JWT_AUDIENCE` | JWT token audience | `api://sentiment-analysis-api` | All |
| `JWT_ISSUER` | JWT token issuer | `https://login.microsoftonline.com/tenant-id/v2.0` | All |

### Monitoring Configuration

| Variable | Description | Example | Environment |
|----------|-------------|---------|-------------|
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Application Insights connection | `InstrumentationKey=key;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/` | All |
| `AZURE_KEY_VAULT_URI` | Key Vault URI | `https://sentiment-analysis-kv.vault.azure.net/` | All |

## Optional Variables

### Caching Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `REDIS_CONNECTION_STRING` | Redis cache connection | None | `sentiment-analysis-cache.redis.cache.windows.net:6380,password=key,ssl=True` |
| `CACHE_ENABLED` | Enable/disable caching | `true` | `true` or `false` |
| `CACHE_EXPIRATION_MINUTES` | Cache expiration time | `60` | `30` |

### Performance Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MAX_CONCURRENT_REQUESTS` | Maximum concurrent requests | `100` | `200` |
| `REQUEST_TIMEOUT_SECONDS` | Request timeout | `30` | `60` |
| `BATCH_SIZE` | Processing batch size | `50` | `100` |

### Feature Flags

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `ENABLE_SWAGGER` | Enable Swagger UI | `false` | `true` (dev only) |
| `ENABLE_DETAILED_ERRORS` | Show detailed errors | `false` | `true` (dev only) |
| `ENABLE_RATE_LIMITING` | Enable rate limiting | `true` | `false` |
| `ENABLE_HEALTH_CHECKS` | Enable health checks | `true` | `true` |

### Logging Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `LOG_LEVEL` | Minimum log level | `Information` | `Debug`, `Warning`, `Error` |
| `STRUCTURED_LOGGING` | Enable structured logging | `true` | `false` |
| `LOG_TO_CONSOLE` | Log to console | `true` | `false` |

## Environment-Specific Configurations

### Development Environment

```bash
# Core Configuration
ASPNETCORE_ENVIRONMENT=Development
FRONTEND_DOMAIN=localhost:3000

# Database Configuration
DB_HOST=localhost
DB_NAME=sentiment_analysis_dev
DB_USER=postgres
DB_PASSWORD=dev_password
DB_PORT=5432

# External APIs (use test/sandbox keys)
REDDIT_CLIENT_ID=dev-reddit-client-id
REDDIT_CLIENT_SECRET=dev-reddit-client-secret
TWITTER_BEARER_TOKEN=dev-twitter-bearer-token

# Development Features
ENABLE_SWAGGER=true
ENABLE_DETAILED_ERRORS=true
LOG_LEVEL=Debug

# Optional Services
REDIS_CONNECTION_STRING=localhost:6379
CACHE_ENABLED=false
```

### Staging Environment

```bash
# Core Configuration
ASPNETCORE_ENVIRONMENT=Staging
FRONTEND_DOMAIN=staging.yourdomain.com
AZURE_STATIC_WEB_APP_URL=staging-app.azurestaticapps.net

# Database Configuration
DB_HOST=sentiment-analysis-db-server.postgres.database.azure.com
DB_NAME=sentiment_analysis_staging
DB_USER=dbadmin
DB_PASSWORD=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)
DB_PORT=5432

# External APIs (use production keys with limited quotas)
REDDIT_CLIENT_ID=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientId)
REDDIT_CLIENT_SECRET=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientSecret)
TWITTER_BEARER_TOKEN=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterBearerToken)
TWITTER_API_KEY=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiKey)
TWITTER_API_SECRET=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiSecret)

# Authentication
JWT_AUTHORITY=https://login.microsoftonline.com/your-tenant-id/v2.0
JWT_AUDIENCE=api://sentiment-analysis-api-staging
JWT_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0

# Monitoring
APPLICATIONINSIGHTS_CONNECTION_STRING=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=ApplicationInsightsConnectionString)
AZURE_KEY_VAULT_URI=https://sentiment-analysis-kv.vault.azure.net/

# Performance
MAX_CONCURRENT_REQUESTS=50
REQUEST_TIMEOUT_SECONDS=30
BATCH_SIZE=25

# Features
ENABLE_SWAGGER=false
ENABLE_DETAILED_ERRORS=false
ENABLE_RATE_LIMITING=true
LOG_LEVEL=Information

# Caching
REDIS_CONNECTION_STRING=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedisConnectionString)
CACHE_ENABLED=true
CACHE_EXPIRATION_MINUTES=30
```

### Production Environment

```bash
# Core Configuration
ASPNETCORE_ENVIRONMENT=Production
FRONTEND_DOMAIN=yourdomain.com
AZURE_STATIC_WEB_APP_URL=your-app.azurestaticapps.net

# Database Configuration
DB_HOST=sentiment-analysis-db-server.postgres.database.azure.com
DB_NAME=sentiment_analysis_prod
DB_USER=dbadmin
DB_PASSWORD=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)
DB_PORT=5432

# External APIs (production keys with full quotas)
REDDIT_CLIENT_ID=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientId)
REDDIT_CLIENT_SECRET=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientSecret)
TWITTER_BEARER_TOKEN=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterBearerToken)
TWITTER_API_KEY=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiKey)
TWITTER_API_SECRET=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiSecret)

# Authentication
JWT_AUTHORITY=https://login.microsoftonline.com/your-tenant-id/v2.0
JWT_AUDIENCE=api://sentiment-analysis-api
JWT_ISSUER=https://login.microsoftonline.com/your-tenant-id/v2.0

# Monitoring
APPLICATIONINSIGHTS_CONNECTION_STRING=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=ApplicationInsightsConnectionString)
AZURE_KEY_VAULT_URI=https://sentiment-analysis-kv.vault.azure.net/

# Performance (optimized for production load)
MAX_CONCURRENT_REQUESTS=200
REQUEST_TIMEOUT_SECONDS=60
BATCH_SIZE=100

# Features (security-focused)
ENABLE_SWAGGER=false
ENABLE_DETAILED_ERRORS=false
ENABLE_RATE_LIMITING=true
ENABLE_HEALTH_CHECKS=true
LOG_LEVEL=Warning

# Caching (enabled for performance)
REDIS_CONNECTION_STRING=@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedisConnectionString)
CACHE_ENABLED=true
CACHE_EXPIRATION_MINUTES=60

# Additional Production Settings
STRUCTURED_LOGGING=true
LOG_TO_CONSOLE=false
```

## Configuration Examples

### Azure App Service Configuration

#### Using Azure CLI
```bash
# Set basic configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    FRONTEND_DOMAIN="yourdomain.com" \
    AZURE_STATIC_WEB_APP_URL="your-app.azurestaticapps.net"

# Set database configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_prod" \
    DB_USER="dbadmin" \
    DB_PASSWORD="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)" \
    DB_PORT="5432"

# Set external API configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    REDDIT_CLIENT_ID="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientId)" \
    REDDIT_CLIENT_SECRET="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientSecret)" \
    TWITTER_BEARER_TOKEN="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterBearerToken)" \
    TWITTER_API_KEY="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiKey)" \
    TWITTER_API_SECRET="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiSecret)"

# Set monitoring configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    APPLICATIONINSIGHTS_CONNECTION_STRING="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=ApplicationInsightsConnectionString)" \
    AZURE_KEY_VAULT_URI="https://sentiment-analysis-kv.vault.azure.net/"
```

#### Using PowerShell
```powershell
# Set configuration using PowerShell
$settings = @{
    "ASPNETCORE_ENVIRONMENT" = "Production"
    "FRONTEND_DOMAIN" = "yourdomain.com"
    "DB_HOST" = "sentiment-analysis-db-server.postgres.database.azure.com"
    "DB_NAME" = "sentiment_analysis_prod"
    "DB_USER" = "dbadmin"
    "DB_PASSWORD" = "@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)"
    "DB_PORT" = "5432"
}

Set-AzWebAppSetting -ResourceGroupName "sentiment-analysis-rg" -Name "sentiment-analysis-api" -AppSettings $settings
```

### Local Development Configuration

#### appsettings.Development.json
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=sentiment_analysis_dev;Username=postgres;Password=dev_password;Port=5432;"
  },
  "ExternalApis": {
    "Reddit": {
      "ClientId": "dev-reddit-client-id",
      "ClientSecret": "dev-reddit-client-secret"
    },
    "Twitter": {
      "BearerToken": "dev-twitter-bearer-token",
      "ApiKey": "dev-twitter-api-key",
      "ApiSecret": "dev-twitter-api-secret"
    }
  },
  "Features": {
    "EnableSwagger": true,
    "EnableDetailedErrors": true,
    "EnableRateLimiting": false
  },
  "Cache": {
    "Enabled": false,
    "ConnectionString": "localhost:6379",
    "ExpirationMinutes": 30
  }
}
```

#### .env File (for Docker development)
```bash
# .env file for Docker Compose
ASPNETCORE_ENVIRONMENT=Development
DB_HOST=postgres
DB_NAME=sentiment_analysis_dev
DB_USER=postgres
DB_PASSWORD=dev_password
DB_PORT=5432

REDIS_CONNECTION_STRING=redis:6379
CACHE_ENABLED=true

REDDIT_CLIENT_ID=dev-reddit-client-id
REDDIT_CLIENT_SECRET=dev-reddit-client-secret
TWITTER_BEARER_TOKEN=dev-twitter-bearer-token

ENABLE_SWAGGER=true
LOG_LEVEL=Debug
```

## Validation and Testing

### Environment Variables Validation Script

```bash
#!/bin/bash
# scripts/validate-environment-variables.sh

set -e

echo "🔍 Validating Environment Variables..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="sentiment-analysis-rg"
APP_NAME="sentiment-analysis-api"
ENVIRONMENT=${1:-production}

echo "📋 Validating environment: $ENVIRONMENT"
echo ""

# Function to check if variable exists and is not empty
check_variable() {
    local var_name=$1
    local var_value=$2
    local is_required=${3:-true}
    
    if [ -n "$var_value" ]; then
        if [[ "$var_value" == "@Microsoft.KeyVault"* ]]; then
            echo -e "${GREEN}✅ $var_name (Key Vault reference)${NC}"
        else
            echo -e "${GREEN}✅ $var_name${NC}"
        fi
        return 0
    else
        if [ "$is_required" = true ]; then
            echo -e "${RED}❌ $var_name (Required)${NC}"
            return 1
        else
            echo -e "${YELLOW}⚠️  $var_name (Optional - not set)${NC}"
            return 0
        fi
    fi
}

# Get all app settings
echo "📥 Retrieving App Service settings..."
SETTINGS=$(az webapp config appsettings list --name $APP_NAME --resource-group $RESOURCE_GROUP --output json)

# Function to get setting value
get_setting() {
    echo "$SETTINGS" | jq -r ".[] | select(.name==\"$1\") | .value // empty"
}

echo "🔍 Checking required variables..."

# Required variables
REQUIRED_VARS=(
    "ASPNETCORE_ENVIRONMENT"
    "DB_HOST"
    "DB_NAME"
    "DB_USER"
    "DB_PASSWORD"
    "DB_PORT"
    "FRONTEND_DOMAIN"
)

MISSING_REQUIRED=0
for var in "${REQUIRED_VARS[@]}"; do
    value=$(get_setting "$var")
    if ! check_variable "$var" "$value" true; then
        ((MISSING_REQUIRED++))
    fi
done

echo ""
echo "🔍 Checking external API variables..."

# External API variables
API_VARS=(
    "REDDIT_CLIENT_ID"
    "REDDIT_CLIENT_SECRET"
    "TWITTER_BEARER_TOKEN"
    "TWITTER_API_KEY"
    "TWITTER_API_SECRET"
)

MISSING_API=0
for var in "${API_VARS[@]}"; do
    value=$(get_setting "$var")
    if ! check_variable "$var" "$value" true; then
        ((MISSING_API++))
    fi
done

echo ""
echo "🔍 Checking authentication variables..."

# Authentication variables
AUTH_VARS=(
    "JWT_AUTHORITY"
    "JWT_AUDIENCE"
    "JWT_ISSUER"
)

MISSING_AUTH=0
for var in "${AUTH_VARS[@]}"; do
    value=$(get_setting "$var")
    if ! check_variable "$var" "$value" false; then
        ((MISSING_AUTH++))
    fi
done

echo ""
echo "🔍 Checking monitoring variables..."

# Monitoring variables
MONITORING_VARS=(
    "APPLICATIONINSIGHTS_CONNECTION_STRING"
    "AZURE_KEY_VAULT_URI"
)

MISSING_MONITORING=0
for var in "${MONITORING_VARS[@]}"; do
    value=$(get_setting "$var")
    if ! check_variable "$var" "$value" true; then
        ((MISSING_MONITORING++))
    fi
done

echo ""
echo "🔍 Checking optional variables..."

# Optional variables
OPTIONAL_VARS=(
    "REDIS_CONNECTION_STRING"
    "CACHE_ENABLED"
    "ENABLE_SWAGGER"
    "LOG_LEVEL"
    "MAX_CONCURRENT_REQUESTS"
)

for var in "${OPTIONAL_VARS[@]}"; do
    value=$(get_setting "$var")
    check_variable "$var" "$value" false
done

echo ""
echo "📊 Validation Summary:"
echo "  Required variables missing: $MISSING_REQUIRED"
echo "  API variables missing: $MISSING_API"
echo "  Auth variables missing: $MISSING_AUTH"
echo "  Monitoring variables missing: $MISSING_MONITORING"

TOTAL_MISSING=$((MISSING_REQUIRED + MISSING_API + MISSING_MONITORING))

if [ $TOTAL_MISSING -eq 0 ]; then
    echo -e "${GREEN}🎉 All critical environment variables are configured!${NC}"
    exit 0
else
    echo -e "${RED}❌ $TOTAL_MISSING critical environment variables are missing${NC}"
    echo ""
    echo "📝 Next steps:"
    echo "  1. Review the Environment Variables Reference documentation"
    echo "  2. Configure missing variables using Azure CLI or Portal"
    echo "  3. Verify Key Vault secrets are properly stored"
    echo "  4. Re-run this validation script"
    exit 1
fi
```

### Connection String Testing

```bash
#!/bin/bash
# scripts/test-connections.sh

echo "🔗 Testing database connection..."

# Get database connection details from App Service
DB_HOST=$(az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='DB_HOST'].value" -o tsv)
DB_NAME=$(az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='DB_NAME'].value" -o tsv)
DB_USER=$(az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='DB_USER'].value" -o tsv)

echo "Testing connection to: $DB_HOST/$DB_NAME"

# Test database connection (requires password input)
if command -v psql &> /dev/null; then
    echo "Enter database password:"
    psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();"
else
    echo "PostgreSQL client not installed. Install with: sudo apt-get install postgresql-client"
fi

echo ""
echo "🔗 Testing Redis connection..."

REDIS_CONNECTION=$(az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='REDIS_CONNECTION_STRING'].value" -o tsv)

if [ -n "$REDIS_CONNECTION" ] && command -v redis-cli &> /dev/null; then
    # Extract host and port from connection string
    REDIS_HOST=$(echo "$REDIS_CONNECTION" | cut -d':' -f1)
    REDIS_PORT=$(echo "$REDIS_CONNECTION" | cut -d':' -f2 | cut -d',' -f1)
    
    echo "Testing Redis connection to: $REDIS_HOST:$REDIS_PORT"
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping
else
    echo "Redis connection string not configured or redis-cli not available"
fi
```

## Security Considerations

### Sensitive Variables

The following variables contain sensitive information and should **NEVER** be stored in plain text:

- `DB_PASSWORD`
- `REDDIT_CLIENT_SECRET`
- `TWITTER_API_SECRET`
- `TWITTER_BEARER_TOKEN`
- `JWT_SIGNING_KEY`
- Any connection strings containing passwords

### Key Vault Integration

Always use Azure Key Vault references for sensitive variables:

```bash
# ✅ Correct - Key Vault reference
DB_PASSWORD="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)"

# ❌ Incorrect - Plain text password
DB_PASSWORD="MyPlainTextPassword123!"
```

### Environment Separation

Ensure different environments use separate:
- Database instances
- Key Vault instances
- API keys (where possible)
- Service principals

### Access Control

- Limit Key Vault access to necessary identities only
- Use managed identities for Azure resources
- Implement least privilege principle
- Regular audit of access permissions

## Troubleshooting

### Common Issues

#### 1. Key Vault Reference Not Working

**Symptoms:**
- Application cannot start
- "Key Vault reference not resolved" errors

**Solutions:**
```bash
# Check managed identity is assigned
az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Verify Key Vault access policy
az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query properties.accessPolicies

# Test Key Vault access manually
az keyvault secret show --vault-name sentiment-analysis-kv --name DatabasePassword
```

#### 2. Database Connection Failures

**Symptoms:**
- Connection timeout errors
- Authentication failures

**Solutions:**
```bash
# Verify connection string format
echo "Host=$DB_HOST;Database=$DB_NAME;Username=$DB_USER;Password=$DB_PASSWORD;Port=$DB_PORT;SSL Mode=Require;Trust Server Certificate=true;"

# Check firewall rules
az postgres flexible-server firewall-rule list --resource-group sentiment-analysis-rg --name sentiment-analysis-db-server

# Test connection manually
psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME"
```

#### 3. CORS Issues

**Symptoms:**
- Frontend cannot access API
- CORS policy errors in browser

**Solutions:**
```bash
# Verify FRONTEND_DOMAIN is set correctly
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='FRONTEND_DOMAIN'].value" -o tsv

# Test CORS headers
curl -H "Origin: https://yourdomain.com" -X OPTIONS https://sentiment-analysis-api.azurewebsites.net/
```

#### 4. External API Authentication

**Symptoms:**
- 401/403 errors from Reddit/Twitter APIs
- Rate limiting issues

**Solutions:**
```bash
# Verify API keys are set
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg | grep -E "(REDDIT|TWITTER)"

# Test API access manually
curl -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" "https://api.twitter.com/2/tweets/search/recent?query=test"
```

### Diagnostic Commands

```bash
# List all App Service settings
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --output table

# Check specific setting
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query "[?name=='ASPNETCORE_ENVIRONMENT'].value" -o tsv

# View application logs
az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check Key Vault secrets
az keyvault secret list --vault-name sentiment-analysis-kv --output table

# Test managed identity access to Key Vault
az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg
```

---

## Summary

This environment variables reference provides:

1. **Complete Variable Catalog** - All required and optional variables
2. **Environment-Specific Configurations** - Tailored settings for dev/staging/prod
3. **Configuration Examples** - Azure CLI, PowerShell, and JSON examples
4. **Validation Scripts** - Automated verification tools
5. **Security Guidelines** - Best practices for sensitive data
6. **Troubleshooting Guide** - Common issues and solutions

**Key Takeaways:**
- Use Azure Key Vault for all sensitive variables
- Separate configurations by environment
- Validate configuration before deployment
- Monitor and audit variable access
- Follow security best practices

For related information, see:
- [Azure Secrets Configuration Guide](./AZURE_SECRETS_CONFIGURATION.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
- [Azure Backend Deployment Guide](./AZURE_BACKEND_DEPLOYMENT_GUIDE.md)

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-20  
**Maintained By**: Development Team  
**Review Schedule**: Monthly