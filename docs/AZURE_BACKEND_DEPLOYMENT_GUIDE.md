# Azure App Service Deployment Guide for .NET Backend

## Overview

This comprehensive guide covers deploying the Social Media Sentiment Analysis .NET 9 backend API to Microsoft Azure App Service, including database setup, environment configuration, and automated deployment.

> ⚠️ **Important**: Before proceeding with deployment, ensure you have completed the secrets and environment variables configuration. Deployment failures are commonly caused by missing or incorrectly configured secrets.

## Quick Reference Documentation

For detailed configuration of critical deployment components, refer to these specialized guides:

- **[🔐 Azure Secrets Configuration Guide](./AZURE_SECRETS_CONFIGURATION.md)** - Complete setup for service principals, Key Vault, and GitHub secrets
- **[⚙️ Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)** - Comprehensive list of all required and optional environment variables
- **[✅ Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step validation checklist to prevent deployment failures

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Resources Setup](#azure-resources-setup)
3. [Database Configuration](#database-configuration)
4. [Environment Variables](#environment-variables)
5. [Manual Deployment](#manual-deployment)
6. [Automated Deployment with GitHub Actions](#automated-deployment-with-github-actions)
7. [Post-Deployment Configuration](#post-deployment-configuration)
8. [Monitoring and Logging](#monitoring-and-logging)
9. [Troubleshooting](#troubleshooting)
10. [Security Best Practices](#security-best-practices)

## Prerequisites

### Required Tools
- Azure CLI (`az`) installed and configured
- .NET 9 SDK installed locally
- Entity Framework Core CLI tools
- Git repository with your .NET application
- Azure subscription with appropriate permissions

### Azure CLI Setup
```bash
# Install Azure CLI (if not already installed)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "your-subscription-id"

# Install Entity Framework CLI tools
dotnet tool install --global dotnet-ef
```

## Azure Resources Setup

### Step 1: Create Resource Group

```bash
# Create resource group
az group create \
  --name sentiment-analysis-rg \
  --location eastus
```

### Step 2: Create Azure Database for PostgreSQL

```bash
# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server \
  --location eastus \
  --admin-user dbadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group sentiment-analysis-rg \
  --server-name sentiment-analysis-db-server \
  --database-name sentiment_analysis_prod

# Configure firewall to allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Step 3: Create App Service Plan

```bash
# Create App Service Plan (Linux)
az appservice plan create \
  --name sentiment-analysis-plan \
  --resource-group sentiment-analysis-rg \
  --sku B1 \
  --is-linux \
  --location eastus
```

### Step 4: Create App Service

```bash
# Create Web App
az webapp create \
  --resource-group sentiment-analysis-rg \
  --plan sentiment-analysis-plan \
  --name sentiment-analysis-api \
  --runtime "DOTNETCORE:9.0" \
  --deployment-local-git
```

### Step 5: Create Application Insights

```bash
# Create Application Insights
az monitor app-insights component create \
  --app sentiment-analysis-insights \
  --location eastus \
  --resource-group sentiment-analysis-rg \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app sentiment-analysis-insights \
  --resource-group sentiment-analysis-rg \
  --query instrumentationKey \
  --output tsv
```

### Step 6: Create Azure Cache for Redis (Optional)

```bash
# Create Redis cache
az redis create \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-cache \
  --location eastus \
  --sku Basic \
  --vm-size c0

# Get Redis connection string
az redis list-keys \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-cache
```

## Database Configuration

### Step 1: Update Connection String

Get your PostgreSQL connection string:

```bash
# Get PostgreSQL connection details
az postgres flexible-server show \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server
```

### Step 2: Run Database Migrations

```bash
# Navigate to your project directory
cd /path/to/your/project

# Update database with migrations
dotnet ef database update \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;"
```

### Step 3: Create Database Migration Script

Create a script for automated migrations:

```bash
# Create migration script
cat > migrate-database.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting database migration..."

# Install EF Core tools if not present
dotnet tool install --global dotnet-ef --version 9.0.0

# Run migrations
dotnet ef database update \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "$DATABASE_CONNECTION_STRING" \
  --verbose

echo "Database migration completed successfully!"
EOF

chmod +x migrate-database.sh
```

## Environment Variables

> 📖 **Complete Reference**: For a comprehensive list of all environment variables, validation scripts, and environment-specific configurations, see the [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md).

> ⚠️ **Critical for Deployment Success**: Missing or incorrectly configured environment variables are the primary cause of deployment failures. Use the validation checklist before deploying.

### Required Environment Variables

Configure the following environment variables in your Azure App Service:

```bash
# Database Configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_prod" \
    DB_USER="dbadmin" \
    DB_PASSWORD="YourSecurePassword123!" \
    DB_PORT="5432"

# Application Configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    FRONTEND_DOMAIN="your-frontend-domain.com" \
    AZURE_STATIC_WEB_APP_URL="your-static-web-app.azurestaticapps.net"

# Application Insights
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=your-instrumentation-key;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/"

# Redis Configuration (if using)
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    REDIS_CONNECTION_STRING="sentiment-analysis-cache.redis.cache.windows.net:6380,password=your-redis-key,ssl=True,abortConnect=False"

# Social Media API Keys (add your actual keys)
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    REDDIT_CLIENT_ID="your-reddit-client-id" \
    REDDIT_CLIENT_SECRET="your-reddit-client-secret" \
    TWITTER_BEARER_TOKEN="your-twitter-bearer-token" \
    TWITTER_API_KEY="your-twitter-api-key" \
    TWITTER_API_SECRET="your-twitter-api-secret"

# JWT Configuration (if using authentication)
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    JWT_AUTHORITY="https://your-auth-provider.com" \
    JWT_AUDIENCE="your-api-audience"
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL server hostname | `sentiment-analysis-db-server.postgres.database.azure.com` |
| `DB_NAME` | Database name | `sentiment_analysis_prod` |
| `DB_USER` | Database username | `dbadmin` |
| `DB_PASSWORD` | Database password | `YourSecurePassword123!` |
| `DB_PORT` | Database port | `5432` |
| `FRONTEND_DOMAIN` | Frontend domain for CORS | `your-domain.com` |
| `AZURE_STATIC_WEB_APP_URL` | Static Web App URL | `your-app.azurestaticapps.net` |
| `APPLICATIONINSIGHTS_CONNECTION_STRING` | Application Insights connection | `InstrumentationKey=...` |
| `REDIS_CONNECTION_STRING` | Redis cache connection | `your-cache.redis.cache.windows.net:6380,...` |

## Manual Deployment

### Step 1: Build and Publish Locally

```bash
# Navigate to API project
cd SentimentAnalysis.API

# Restore dependencies
dotnet restore

# Build the project
dotnet build --configuration Release

# Publish the application
dotnet publish --configuration Release --output ./publish --self-contained false --runtime linux-x64
```

### Step 2: Deploy Using Azure CLI

```bash
# Create deployment package
cd publish
zip -r ../deployment.zip .
cd ..

# Deploy to Azure App Service
az webapp deployment source config-zip \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --src deployment.zip
```

### Step 3: Deploy Using Visual Studio

1. Right-click on `SentimentAnalysis.API` project
2. Select "Publish..."
3. Choose "Azure" as target
4. Select "Azure App Service (Linux)"
5. Sign in to your Azure account
6. Select your subscription and resource group
7. Select your App Service (`sentiment-analysis-api`)
8. Click "Publish"

### Step 4: Deploy Using Visual Studio Code

1. Install Azure App Service extension
2. Sign in to Azure
3. Right-click on your App Service in the Azure panel
4. Select "Deploy to Web App..."
5. Choose your project folder
6. Confirm deployment

## Automated Deployment with GitHub Actions

### Step 1: Set Up GitHub Secrets

> 📖 **Detailed Instructions**: For comprehensive GitHub secrets setup, including service principal configuration and troubleshooting, see the [Azure Secrets Configuration Guide](./AZURE_SECRETS_CONFIGURATION.md#github-repository-secrets-configuration).

**Critical Missing Secrets** (commonly cause deployment failures):

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add these **required** secrets:

```bash
# Azure Service Principal Secrets (replace IDs with your actual values)
AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E: [Your service principal client ID]
AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF: [Your Azure tenant ID]
AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130: [Your Azure subscription ID]

# App Service Deployment Secrets
AZURE_WEBAPP_PUBLISH_PROFILE: [Download from Azure Portal → App Service → Get publish profile]
AZURE_WEBAPP_PUBLISH_PROFILE_STAGING: [Download staging slot publish profile]

# Database Connection Secrets
AZURE_RESOURCE_GROUP: sentiment-analysis-rg
STAGING_DATABASE_CONNECTION_STRING: [Staging database connection string]
PRODUCTION_DATABASE_CONNECTION_STRING: [Production database connection string]
```

**Validation Script**:
```bash
# Download and run the GitHub secrets validation script
curl -o validate-github-secrets.sh https://raw.githubusercontent.com/your-repo/scripts/validate-github-secrets.sh
chmod +x validate-github-secrets.sh
./validate-github-secrets.sh
```

### Step 2: Configure Deployment Slots

```bash
# Create staging slot
az webapp deployment slot create \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --slot staging

# Configure staging slot settings
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --slot staging \
  --settings \
    ASPNETCORE_ENVIRONMENT="Staging" \
    DB_NAME="sentiment_analysis_staging"
```

### Step 3: GitHub Actions Workflow

The workflow file `.github/workflows/azure-backend-deployment.yml` includes:

- **Build and Test**: Compiles the application and runs tests
- **Security Scan**: Checks for security vulnerabilities
- **Deploy to Staging**: Deploys to staging slot for testing
- **Deploy to Production**: Deploys to production after staging validation
- **Rollback**: Automatic rollback on deployment failure

### Step 4: Trigger Deployment

Push changes to the main branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy backend to Azure"
git push origin main
```

## Post-Deployment Configuration

### Step 1: Verify Deployment

```bash
# Check application status
curl -I https://sentiment-analysis-api.azurewebsites.net

# Check health endpoint
curl https://sentiment-analysis-api.azurewebsites.net/health

# Check API info endpoint
curl https://sentiment-analysis-api.azurewebsites.net/
```

### Step 2: Configure Custom Domain (Optional)

```bash
# Add custom domain
az webapp config hostname add \
  --webapp-name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg \
  --hostname api.yourdomain.com

# Bind SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint {thumbprint} \
  --ssl-type SNI \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg
```

### Step 3: Configure Scaling

```bash
# Enable auto-scaling
az monitor autoscale create \
  --resource-group sentiment-analysis-rg \
  --resource sentiment-analysis-api \
  --resource-type Microsoft.Web/sites \
  --name sentiment-api-autoscale \
  --min-count 1 \
  --max-count 5 \
  --count 2

# Add CPU-based scaling rule
az monitor autoscale rule create \
  --resource-group sentiment-analysis-rg \
  --autoscale-name sentiment-api-autoscale \
  --condition "Percentage CPU > 70 avg 5m" \
  --scale out 1
```

## Monitoring and Logging

### Step 1: Application Insights Configuration

Application Insights is automatically configured through the `appsettings.Production.json` file. Monitor your application at:
- Azure Portal → Application Insights → sentiment-analysis-insights

### Step 2: Log Streaming

```bash
# Stream live logs
az webapp log tail \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api

# Download logs
az webapp log download \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api
```

### Step 3: Set Up Alerts

```bash
# Create alert for high error rate
az monitor metrics alert create \
  --name "High Error Rate" \
  --resource-group sentiment-analysis-rg \
  --scopes /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg/providers/Microsoft.Web/sites/sentiment-analysis-api \
  --condition "count 'Http Server Errors' > 10" \
  --description "Alert when error rate is high"
```

## Troubleshooting

> 🔧 **Comprehensive Troubleshooting**: For detailed troubleshooting of secrets, environment variables, and deployment issues, see the [Backend Troubleshooting Guide](./BACKEND_TROUBLESHOOTING_GUIDE.md).

### Common Deployment Failures

#### 1. Missing or Invalid Secrets

**Symptoms**:
- GitHub Actions deployment fails with authentication errors
- "AADSTS70002: Error validating credentials" messages
- Service principal authentication failures

**Quick Diagnosis**:
```bash
# Validate all secrets configuration
./scripts/validate-all-secrets.sh

# Check specific GitHub secrets
gh secret list | grep AZUREAPPSERVICE
```

**Solutions**: See [Azure Secrets Configuration Guide](./AZURE_SECRETS_CONFIGURATION.md#troubleshooting)

#### 2. Environment Variables Issues

**Symptoms**:
- Application starts but returns 500 errors
- Database connection failures
- External API integration failures

**Quick Diagnosis**:
```bash
# Validate environment variables
./scripts/validate-environment-variables.sh production

# Check Key Vault references
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg | grep KeyVault
```

**Solutions**: See [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md#troubleshooting)

#### 3. Application Won't Start

**Symptoms**: 502 Bad Gateway or application not responding

**Solutions**:
```bash
# Check application logs
az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Verify .NET runtime version
az webapp config show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query linuxFxVersion

# Check environment variables
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg
```

#### 2. Database Connection Issues

**Symptoms**: Database connection timeouts or authentication failures

**Solutions**:
```bash
# Test database connectivity
az postgres flexible-server connect \
  --name sentiment-analysis-db-server \
  --admin-user dbadmin \
  --admin-password "YourSecurePassword123!" \
  --database-name sentiment_analysis_prod

# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server

# Verify connection string format
echo "Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;"
```

#### 3. CORS Issues

**Symptoms**: Frontend cannot access API due to CORS errors

**Solutions**:
- Verify `FRONTEND_DOMAIN` environment variable is set correctly
- Check that frontend URL matches CORS configuration
- Ensure HTTPS is used for production

#### 4. Performance Issues

**Symptoms**: Slow response times or timeouts

**Solutions**:
```bash
# Scale up the App Service Plan
az appservice plan update \
  --name sentiment-analysis-plan \
  --resource-group sentiment-analysis-rg \
  --sku S1

# Enable Application Insights profiler
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0"
```

### Debugging Commands

```bash
# Check resource status
az resource list --resource-group sentiment-analysis-rg --output table

# View deployment history
az webapp deployment list --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Test API endpoints
curl -X GET https://sentiment-analysis-api.azurewebsites.net/health
curl -X GET https://sentiment-analysis-api.azurewebsites.net/

# Check SSL certificate
openssl s_client -connect sentiment-analysis-api.azurewebsites.net:443 -servername sentiment-analysis-api.azurewebsites.net
```

## Security Best Practices

### 1. Network Security

```bash
# Restrict access to specific IPs (if needed)
az webapp config access-restriction add \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --rule-name "Office IP" \
  --action Allow \
  --ip-address 203.0.113.0/24 \
  --priority 100

# Enable HTTPS only
az webapp update \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --https-only true
```

### 2. Authentication and Authorization

- Use Azure Active Directory for API authentication
- Implement proper JWT token validation
- Use managed identities for Azure resource access

### 3. Secrets Management

```bash
# Create Key Vault
az keyvault create \
  --name sentiment-analysis-kv \
  --resource-group sentiment-analysis-rg \
  --location eastus

# Store secrets in Key Vault
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "DatabasePassword" \
  --value "YourSecurePassword123!"

# Configure App Service to use Key Vault
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    DB_PASSWORD="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)"
```

### 4. Monitoring and Auditing

- Enable diagnostic logging
- Set up security alerts
- Regular security scans
- Monitor for unusual activity

## Deployment Checklist

> 📋 **Complete Deployment Checklist**: For a comprehensive, step-by-step deployment validation checklist that prevents common deployment failures, see the [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md).

### Quick Pre-Deployment Validation

**Critical Secrets and Configuration** (run these validation commands):

```bash
# 1. Validate Azure secrets configuration
curl -o validate-secrets.sh https://raw.githubusercontent.com/your-repo/scripts/validate-all-secrets.sh
chmod +x validate-secrets.sh
./validate-secrets.sh

# 2. Validate environment variables
curl -o validate-env-vars.sh https://raw.githubusercontent.com/your-repo/scripts/validate-environment-variables.sh
chmod +x validate-env-vars.sh
./validate-env-vars.sh production

# 3. Validate GitHub secrets
gh secret list | grep -E "(AZUREAPPSERVICE|AZURE_WEBAPP|DATABASE_CONNECTION)"
```

### Essential Pre-Deployment Checklist

- [ ] **Azure Secrets Configured**
  - [ ] Service principal created with correct permissions
  - [ ] Key Vault created and accessible
  - [ ] All required secrets stored in Key Vault
  - [ ] App Service managed identity configured

- [ ] **GitHub Secrets Configured**
  - [ ] `AZUREAPPSERVICE_CLIENTID_*` configured
  - [ ] `AZUREAPPSERVICE_TENANTID_*` configured
  - [ ] `AZUREAPPSERVICE_SUBSCRIPTIONID_*` configured
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` configured
  - [ ] Database connection strings configured

- [ ] **Environment Variables Configured**
  - [ ] All required variables set (see [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md))
  - [ ] Key Vault references working
  - [ ] Database connection tested
  - [ ] External API keys configured

- [ ] **Azure Resources Ready**
  - [ ] App Service created and configured
  - [ ] Database server accessible
  - [ ] Application Insights configured
  - [ ] Firewall rules configured

### Deployment Execution

- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Database migrations applied
- [ ] Health checks passing
- [ ] Smoke tests completed

### Post-Deployment Verification

- [ ] Application accessible via HTTPS
- [ ] API endpoints responding correctly
- [ ] Frontend can communicate with backend
- [ ] External API integrations working
- [ ] Monitoring and logging configured
- [ ] Alerts set up
- [ ] Performance baseline established

### Production Readiness

- [ ] Auto-scaling configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery plan in place
- [ ] Security scan completed
- [ ] Load testing performed
- [ ] Documentation updated

## Cost Optimization

### App Service Plan Recommendations

| Environment | Plan | Cost/Month | Use Case |
|-------------|------|------------|----------|
| Development | F1 (Free) | $0 | Testing, development |
| Staging | B1 (Basic) | ~$13 | Pre-production testing |
| Production (Small) | S1 (Standard) | ~$56 | Small to medium traffic |
| Production (Large) | P1V2 (Premium) | ~$146 | High traffic, advanced features |

### Database Recommendations

| Environment | Tier | Cost/Month | Use Case |
|-------------|------|------------|----------|
| Development | Burstable B1ms | ~$12 | Development, testing |
| Staging | Burstable B2s | ~$24 | Pre-production |
| Production | General Purpose D2s | ~$88 | Production workloads |

## Support Resources

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Application Insights Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
- [.NET on Azure Documentation](https://docs.microsoft.com/en-us/dotnet/azure/)

For additional help, check the troubleshooting section or create an issue in the repository.