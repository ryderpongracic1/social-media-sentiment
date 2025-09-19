# Backend Troubleshooting Guide

## Overview

This guide provides comprehensive troubleshooting steps for common issues encountered when deploying and running the Social Media Sentiment Analysis .NET backend on Azure App Service.

## Table of Contents

1. [Deployment Issues](#deployment-issues)
2. [Application Startup Issues](#application-startup-issues)
3. [Database Connection Issues](#database-connection-issues)
4. [CORS and Frontend Integration Issues](#cors-and-frontend-integration-issues)
5. [Performance Issues](#performance-issues)
6. [Authentication and Authorization Issues](#authentication-and-authorization-issues)
7. [Monitoring and Logging Issues](#monitoring-and-logging-issues)
8. [Security Issues](#security-issues)
9. [Diagnostic Commands](#diagnostic-commands)
10. [Emergency Procedures](#emergency-procedures)

## Deployment Issues

### Issue: GitHub Actions Deployment Fails

**Symptoms:**
- GitHub Actions workflow fails during build or deployment
- Error messages in workflow logs
- Application not updated after push

**Diagnostic Steps:**
```bash
# Check workflow status
gh workflow list
gh run list --workflow=azure-backend-deployment.yml

# View specific run logs
gh run view [RUN_ID] --log
```

**Common Causes and Solutions:**

#### 1. Build Failures
```bash
# Check .NET version compatibility
dotnet --version

# Restore packages locally
dotnet restore

# Build locally to identify issues
dotnet build --configuration Release --verbosity detailed
```

**Solution:**
- Ensure .NET 9 SDK is specified in workflow
- Check for missing NuGet packages
- Verify project references are correct

#### 2. Missing GitHub Secrets
**Symptoms:** Authentication errors, missing environment variables

**Solution:**
```bash
# Verify secrets are set in GitHub repository
# Go to: Settings → Secrets and variables → Actions

# Required secrets:
# - AZURE_WEBAPP_PUBLISH_PROFILE
# - AZURE_WEBAPP_PUBLISH_PROFILE_STAGING
# - AZURE_RESOURCE_GROUP
# - STAGING_DATABASE_CONNECTION_STRING
# - PRODUCTION_DATABASE_CONNECTION_STRING
```

#### 3. Azure Resource Access Issues
**Symptoms:** Deployment succeeds but app doesn't start

**Solution:**
```bash
# Check App Service status
az webapp show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query state

# Check deployment logs
az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg
```

### Issue: Manual Deployment Fails

**Symptoms:**
- Visual Studio publish fails
- Azure CLI deployment errors
- Zip deployment issues

**Diagnostic Steps:**
```bash
# Test local build
dotnet build --configuration Release
dotnet publish --configuration Release --output ./publish

# Check publish output
ls -la ./publish/

# Test deployment package
cd publish && zip -r ../test-deployment.zip . && cd ..
```

**Solutions:**

#### 1. Publish Profile Issues
```bash
# Download fresh publish profile from Azure Portal
# App Service → Get publish profile
# Import into Visual Studio or use with CLI
```

#### 2. File Permission Issues
```bash
# Ensure proper file permissions
chmod +x ./publish/SentimentAnalysis.API

# Check for missing files
ls -la ./publish/
```

## Application Startup Issues

### Issue: Application Won't Start (502 Bad Gateway)

**Symptoms:**
- 502 Bad Gateway error
- Application Insights shows no telemetry
- Health check endpoint not responding

**Diagnostic Steps:**
```bash
# Check application logs
az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check App Service configuration
az webapp config show --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check environment variables
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg
```

**Common Causes and Solutions:**

#### 1. Missing Environment Variables
```bash
# Set required environment variables
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_prod" \
    DB_USER="dbadmin" \
    DB_PASSWORD="YourSecurePassword123!"
```

#### 2. Incorrect Runtime Configuration
```bash
# Verify .NET runtime version
az webapp config show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query linuxFxVersion

# Update if necessary
az webapp config set --name sentiment-analysis-api --resource-group sentiment-analysis-rg --linux-fx-version "DOTNETCORE:9.0"
```

#### 3. Application Configuration Issues
**Check `appsettings.Production.json`:**
- Ensure connection strings use environment variables
- Verify CORS configuration
- Check logging configuration

### Issue: Application Starts but Returns Errors

**Symptoms:**
- Application responds but returns 500 errors
- Specific endpoints fail
- Intermittent failures

**Diagnostic Steps:**
```bash
# Check detailed logs
az webapp log download --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Test specific endpoints
curl -v https://sentiment-analysis-api.azurewebsites.net/health
curl -v https://sentiment-analysis-api.azurewebsites.net/
```

**Solutions:**
1. Review application logs for specific error messages
2. Check dependency injection configuration
3. Verify all required services are registered
4. Test database connectivity

## Database Connection Issues

### Issue: Database Connection Timeouts

**Symptoms:**
- "Connection timeout" errors
- Database queries fail intermittently
- Application slow to respond

**Diagnostic Steps:**
```bash
# Test database connectivity
az postgres flexible-server connect \
  --name sentiment-analysis-db-server \
  --admin-user dbadmin \
  --admin-password "YourSecurePassword123!" \
  --database-name sentiment_analysis_prod

# Check connection string format
echo $DATABASE_CONNECTION_STRING
```

**Solutions:**

#### 1. Firewall Configuration
```bash
# Check firewall rules
az postgres flexible-server firewall-rule list \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server

# Add Azure services rule if missing
az postgres flexible-server firewall-rule create \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### 2. Connection String Issues
**Correct format:**
```
Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;Trust Server Certificate=true;
```

#### 3. Connection Pool Configuration
**Update `appsettings.Production.json`:**
```json
{
  "Database": {
    "CommandTimeout": 60,
    "EnableRetryOnFailure": true,
    "MaxRetryCount": 5,
    "MaxRetryDelay": "00:00:30"
  }
}
```

### Issue: Database Migration Failures

**Symptoms:**
- Migration commands fail
- Database schema out of sync
- Entity Framework errors

**Diagnostic Steps:**
```bash
# Check current migration status
dotnet ef migrations list \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "$DATABASE_CONNECTION_STRING"

# Test migration dry run
dotnet ef database update --dry-run \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "$DATABASE_CONNECTION_STRING"
```

**Solutions:**

#### 1. Manual Migration
```bash
# Run migration script
cd SentimentAnalysis.API/Scripts
chmod +x migrate-database.sh
export DATABASE_CONNECTION_STRING="your-connection-string"
./migrate-database.sh
```

#### 2. Reset Database (Development Only)
```bash
# Drop and recreate database
dotnet ef database drop --force \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "$DATABASE_CONNECTION_STRING"

dotnet ef database update \
  --project SentimentAnalysis.Infrastructure.Data \
  --startup-project SentimentAnalysis.API \
  --connection "$DATABASE_CONNECTION_STRING"
```

## CORS and Frontend Integration Issues

### Issue: CORS Errors in Browser

**Symptoms:**
- "Access-Control-Allow-Origin" errors in browser console
- Frontend cannot make API calls
- Preflight requests failing

**Diagnostic Steps:**
```bash
# Test CORS headers
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://sentiment-analysis-api.azurewebsites.net/

# Check current CORS configuration
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg | grep -i cors
```

**Solutions:**

#### 1. Update CORS Configuration
```bash
# Set frontend domain environment variable
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    FRONTEND_DOMAIN="your-frontend-domain.com" \
    AZURE_STATIC_WEB_APP_URL="your-app.azurestaticapps.net"
```

#### 2. Verify Program.cs CORS Configuration
Ensure CORS is configured correctly in `Program.cs`:
```csharp
// Check that CORS policy allows your frontend domain
// Verify AllowCredentials is set correctly
// Ensure CORS middleware is added before routing
```

#### 3. Test with Specific Origins
```bash
# Test with specific origin
curl -H "Origin: https://your-exact-frontend-url.com" \
     -v https://sentiment-analysis-api.azurewebsites.net/health
```

### Issue: API Endpoints Not Accessible from Frontend

**Symptoms:**
- 404 errors for API endpoints
- Routing issues
- Base URL problems

**Solutions:**

#### 1. Verify API Base URL
Frontend should use: `https://sentiment-analysis-api.azurewebsites.net`

#### 2. Check Routing Configuration
```bash
# Test API endpoints directly
curl https://sentiment-analysis-api.azurewebsites.net/
curl https://sentiment-analysis-api.azurewebsites.net/health
curl https://sentiment-analysis-api.azurewebsites.net/api/[your-endpoint]
```

## Performance Issues

### Issue: Slow Response Times

**Symptoms:**
- API responses take > 5 seconds
- Timeouts in frontend
- High CPU or memory usage

**Diagnostic Steps:**
```bash
# Check App Service metrics
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg/providers/Microsoft.Web/sites/sentiment-analysis-api \
  --metric "CpuPercentage,MemoryPercentage,ResponseTime"

# Check Application Insights performance
# Go to Azure Portal → Application Insights → Performance
```

**Solutions:**

#### 1. Scale Up App Service Plan
```bash
# Upgrade to higher tier
az appservice plan update \
  --name sentiment-analysis-plan \
  --resource-group sentiment-analysis-rg \
  --sku S1
```

#### 2. Enable Auto-scaling
```bash
# Configure auto-scaling
az monitor autoscale create \
  --resource-group sentiment-analysis-rg \
  --resource sentiment-analysis-api \
  --resource-type Microsoft.Web/sites \
  --name sentiment-api-autoscale \
  --min-count 1 \
  --max-count 3 \
  --count 2
```

#### 3. Optimize Database Queries
- Review slow queries in Application Insights
- Add database indexes
- Optimize Entity Framework queries
- Implement caching

### Issue: High Memory Usage

**Symptoms:**
- Memory usage > 80%
- OutOfMemoryException errors
- Application restarts frequently

**Solutions:**

#### 1. Memory Profiling
```bash
# Enable Application Insights profiler
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings APPINSIGHTS_PROFILERFEATURE_VERSION="1.0.0"
```

#### 2. Garbage Collection Tuning
Add to `appsettings.Production.json`:
```json
{
  "System.GC.Server": true,
  "System.GC.Concurrent": true
}
```

## Authentication and Authorization Issues

### Issue: JWT Token Validation Fails

**Symptoms:**
- 401 Unauthorized errors
- Token validation errors in logs
- Authentication middleware not working

**Diagnostic Steps:**
```bash
# Check JWT configuration
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg | grep JWT

# Test token validation
curl -H "Authorization: Bearer your-jwt-token" \
     https://sentiment-analysis-api.azurewebsites.net/api/protected-endpoint
```

**Solutions:**

#### 1. Verify JWT Configuration
```bash
# Set JWT configuration
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    JWT_AUTHORITY="https://your-auth-provider.com" \
    JWT_AUDIENCE="your-api-audience"
```

#### 2. Check Token Format
- Ensure token is valid JWT format
- Verify issuer and audience claims
- Check token expiration

## Monitoring and Logging Issues

### Issue: No Telemetry in Application Insights

**Symptoms:**
- Application Insights dashboard empty
- No performance data
- No error tracking

**Solutions:**

#### 1. Verify Application Insights Configuration
```bash
# Check connection string
az webapp config appsettings list --name sentiment-analysis-api --resource-group sentiment-analysis-rg | grep APPLICATIONINSIGHTS

# Set connection string if missing
az monitor app-insights component show \
  --app sentiment-analysis-insights \
  --resource-group sentiment-analysis-rg \
  --query connectionString
```

#### 2. Enable Telemetry Collection
Ensure `Program.cs` includes:
```csharp
builder.Services.AddApplicationInsightsTelemetry(connectionString);
```

### Issue: Logs Not Appearing

**Symptoms:**
- No logs in Azure Portal
- Log streaming not working
- Missing error details

**Solutions:**

#### 1. Enable Application Logging
```bash
# Enable application logging
az webapp log config \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg \
  --application-logging filesystem \
  --level information
```

#### 2. Check Log Configuration
Verify `appsettings.Production.json` logging configuration:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

## Security Issues

### Issue: SSL Certificate Problems

**Symptoms:**
- SSL certificate warnings
- HTTPS not working
- Mixed content errors

**Solutions:**

#### 1. Verify SSL Configuration
```bash
# Check SSL certificate
openssl s_client -connect sentiment-analysis-api.azurewebsites.net:443 -servername sentiment-analysis-api.azurewebsites.net

# Enable HTTPS only
az webapp update \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --https-only true
```

### Issue: Security Headers Missing

**Symptoms:**
- Security scan failures
- Missing security headers
- XSS vulnerabilities

**Solutions:**

Verify `web.config` includes security headers:
```xml
<httpProtocol>
  <customHeaders>
    <add name="X-Content-Type-Options" value="nosniff" />
    <add name="X-Frame-Options" value="DENY" />
    <add name="X-XSS-Protection" value="1; mode=block" />
  </customHeaders>
</httpProtocol>
```

## Diagnostic Commands

### Azure CLI Commands
```bash
# Check resource status
az resource list --resource-group sentiment-analysis-rg --output table

# View App Service details
az webapp show --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check deployment history
az webapp deployment list --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Stream logs
az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Download logs
az webapp log download --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check metrics
az monitor metrics list \
  --resource /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg/providers/Microsoft.Web/sites/sentiment-analysis-api \
  --metric "CpuPercentage,MemoryPercentage,ResponseTime,Requests"
```

### PowerShell Commands
```powershell
# Check App Service status
Get-AzWebApp -ResourceGroupName "sentiment-analysis-rg" -Name "sentiment-analysis-api"

# Get application settings
Get-AzWebAppSetting -ResourceGroupName "sentiment-analysis-rg" -Name "sentiment-analysis-api"

# Check deployment slots
Get-AzWebAppSlot -ResourceGroupName "sentiment-analysis-rg" -Name "sentiment-analysis-api"
```

### cURL Commands
```bash
# Test API endpoints
curl -I https://sentiment-analysis-api.azurewebsites.net
curl -v https://sentiment-analysis-api.azurewebsites.net/health
curl -v https://sentiment-analysis-api.azurewebsites.net/

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://sentiment-analysis-api.azurewebsites.net/

# Test with authentication
curl -H "Authorization: Bearer your-token" \
     https://sentiment-analysis-api.azurewebsites.net/api/protected-endpoint
```

## Emergency Procedures

### Rollback Deployment

#### 1. Using Deployment Slots
```bash
# Swap staging and production slots
az webapp deployment slot swap \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --slot staging \
  --target-slot production
```

#### 2. Redeploy Previous Version
```bash
# Get deployment history
az webapp deployment list --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Redeploy specific version
az webapp deployment source sync \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg
```

### Database Recovery

#### 1. Point-in-Time Restore
```bash
# Restore database to specific point in time
az postgres flexible-server restore \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server-restored \
  --source-server sentiment-analysis-db-server \
  --restore-time "2024-01-01T10:00:00Z"
```

#### 2. Backup Restoration
```bash
# List available backups
az postgres flexible-server backup list \
  --resource-group sentiment-analysis-rg \
  --server-name sentiment-analysis-db-server
```

### Scale Down for Cost Control
```bash
# Scale down App Service Plan
az appservice plan update \
  --name sentiment-analysis-plan \
  --resource-group sentiment-analysis-rg \
  --sku F1

# Scale down database
az postgres flexible-server update \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-db-server \
  --sku-name Standard_B1ms
```

## Getting Help

### Microsoft Support Resources
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Database for PostgreSQL Documentation](https://docs.microsoft.com/en-us/azure/postgresql/)
- [Application Insights Documentation](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

### Community Resources
- [Stack Overflow - Azure App Service](https://stackoverflow.com/questions/tagged/azure-app-service)
- [Microsoft Q&A - Azure](https://docs.microsoft.com/en-us/answers/topics/azure.html)
- [Azure Community Support](https://azure.microsoft.com/en-us/support/community/)

### Creating Support Tickets
```bash
# Create Azure support ticket (requires support plan)
az support tickets create \
  --ticket-name "Backend Deployment Issue" \
  --description "Detailed description of the issue" \
  --severity "minimal" \
  --problem-classification "/providers/Microsoft.Support/services/web_app_service/problemClassifications/deployment_issues"
```

---

**Last Updated:** [Current Date]
**Version:** 1.0
**Maintained By:** Development Team