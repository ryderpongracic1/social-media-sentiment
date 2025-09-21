# Deployment Checklist - Secrets and Environment Variables

## Overview

This deployment checklist focuses specifically on validating Azure secrets and environment variables to prevent deployment failures. This checklist addresses the critical missing configuration identified in debug analysis and ensures all required secrets are properly configured before deployment.

## Table of Contents

1. [Pre-Deployment Validation](#pre-deployment-validation)
2. [Azure Secrets Verification](#azure-secrets-verification)
3. [Environment Variables Validation](#environment-variables-validation)
4. [GitHub Repository Secrets](#github-repository-secrets)
5. [External API Keys Verification](#external-api-keys-verification)
6. [Database Configuration](#database-configuration)
7. [Security Validation](#security-validation)
8. [Deployment Execution](#deployment-execution)
9. [Post-Deployment Verification](#post-deployment-verification)
10. [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Validation

### Prerequisites Check

- [ ] **Azure CLI Authentication**
  ```bash
  az account show
  # Verify you're logged in to the correct subscription
  ```

- [ ] **GitHub CLI Authentication** (if using)
  ```bash
  gh auth status
  # Verify GitHub access for secrets management
  ```

- [ ] **Required Permissions**
  - [ ] Azure Subscription: Contributor or Owner role
  - [ ] GitHub Repository: Admin access
  - [ ] Azure Active Directory: Application Administrator role

- [ ] **Tools Installed**
  - [ ] Azure CLI (version 2.30.0+)
  - [ ] GitHub CLI (optional but recommended)
  - [ ] PowerShell 7.0+ or Bash shell
  - [ ] PostgreSQL client (for connection testing)

### Resource Group Verification

- [ ] **Resource Group Exists**
  ```bash
  az group show --name sentiment-analysis-rg
  ```

- [ ] **Required Azure Resources**
  - [ ] App Service: `sentiment-analysis-api`
  - [ ] App Service Plan: `sentiment-analysis-plan`
  - [ ] PostgreSQL Server: `sentiment-analysis-db-server`
  - [ ] Application Insights: `sentiment-analysis-insights`
  - [ ] Key Vault: `sentiment-analysis-kv`
  - [ ] Redis Cache: `sentiment-analysis-cache` (optional)

## Azure Secrets Verification

### Service Principal Configuration

- [ ] **Service Principal Exists**
  ```bash
  az ad sp show --id "095e79da-f422-426b-b581-ee59c2debd5e"
  ```

- [ ] **Service Principal Role Assignments**
  ```bash
  az role assignment list --assignee "095e79da-f422-426b-b581-ee59c2debd5e" --output table
  ```
  - [ ] Contributor role on resource group
  - [ ] Web Plan Contributor role
  - [ ] SQL DB Contributor role (if applicable)

- [ ] **Service Principal Client Secret Valid**
  - [ ] Client secret not expired
  - [ ] Client secret accessible for GitHub Actions

### Azure Key Vault Setup

- [ ] **Key Vault Exists and Accessible**
  ```bash
  az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg
  ```

- [ ] **Key Vault Access Policies**
  ```bash
  az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query properties.accessPolicies
  ```
  - [ ] Service principal has `get`, `list` permissions
  - [ ] App Service managed identity has `get`, `list` permissions

- [ ] **Required Secrets in Key Vault**
  ```bash
  az keyvault secret list --vault-name sentiment-analysis-kv --output table
  ```
  - [ ] `DatabasePassword`
  - [ ] `ApplicationInsightsConnectionString`
  - [ ] `RedditClientId`
  - [ ] `RedditClientSecret`
  - [ ] `TwitterApiKey`
  - [ ] `TwitterApiSecret`
  - [ ] `TwitterBearerToken`
  - [ ] `JwtSigningKey` (if using JWT authentication)

### App Service Managed Identity

- [ ] **Managed Identity Enabled**
  ```bash
  az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg
  ```

- [ ] **Managed Identity Access to Key Vault**
  ```bash
  # Get managed identity principal ID
  MANAGED_IDENTITY=$(az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query principalId -o tsv)
  
  # Verify Key Vault access policy includes managed identity
  az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query "properties.accessPolicies[?objectId=='$MANAGED_IDENTITY']"
  ```

## Environment Variables Validation

### Required Environment Variables

Run the validation script to check all required variables:

```bash
# Download and run the validation script
curl -o validate-env-vars.sh https://raw.githubusercontent.com/your-repo/scripts/validate-environment-variables.sh
chmod +x validate-env-vars.sh
./validate-env-vars.sh production
```

- [ ] **Database Configuration**
  - [ ] `DB_HOST` = `sentiment-analysis-db-server.postgres.database.azure.com`
  - [ ] `DB_NAME` = `sentiment_analysis_prod`
  - [ ] `DB_USER` = `dbadmin`
  - [ ] `DB_PASSWORD` = Key Vault reference
  - [ ] `DB_PORT` = `5432`

- [ ] **Application Configuration**
  - [ ] `ASPNETCORE_ENVIRONMENT` = `Production`
  - [ ] `FRONTEND_DOMAIN` = Your frontend domain
  - [ ] `AZURE_STATIC_WEB_APP_URL` = Your static web app URL

- [ ] **Monitoring Configuration**
  - [ ] `APPLICATIONINSIGHTS_CONNECTION_STRING` = Key Vault reference
  - [ ] `AZURE_KEY_VAULT_URI` = `https://sentiment-analysis-kv.vault.azure.net/`

- [ ] **External API Configuration**
  - [ ] `REDDIT_CLIENT_ID` = Key Vault reference
  - [ ] `REDDIT_CLIENT_SECRET` = Key Vault reference
  - [ ] `TWITTER_BEARER_TOKEN` = Key Vault reference
  - [ ] `TWITTER_API_KEY` = Key Vault reference
  - [ ] `TWITTER_API_SECRET` = Key Vault reference

### Environment-Specific Validation

#### Development Environment
- [ ] `ASPNETCORE_ENVIRONMENT` = `Development`
- [ ] `ENABLE_SWAGGER` = `true`
- [ ] `LOG_LEVEL` = `Debug`
- [ ] Local database connection working

#### Staging Environment
- [ ] `ASPNETCORE_ENVIRONMENT` = `Staging`
- [ ] Staging database configured
- [ ] Limited API quotas configured
- [ ] `ENABLE_SWAGGER` = `false`

#### Production Environment
- [ ] `ASPNETCORE_ENVIRONMENT` = `Production`
- [ ] Production database configured
- [ ] Full API quotas configured
- [ ] `ENABLE_SWAGGER` = `false`
- [ ] `ENABLE_DETAILED_ERRORS` = `false`

## GitHub Repository Secrets

### Critical GitHub Secrets

Verify these secrets exist in your GitHub repository:

```bash
# Using GitHub CLI
gh secret list
```

- [ ] **Azure Service Principal Secrets**
  - [ ] `AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E`
  - [ ] `AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF`
  - [ ] `AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130`

- [ ] **Azure App Service Secrets**
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE`
  - [ ] `AZURE_WEBAPP_PUBLISH_PROFILE_STAGING` (if using staging)

- [ ] **Database Connection Secrets**
  - [ ] `PRODUCTION_DATABASE_CONNECTION_STRING`
  - [ ] `STAGING_DATABASE_CONNECTION_STRING`

### GitHub Secrets Validation Script

```bash
#!/bin/bash
# Validate GitHub secrets
echo "🔍 Validating GitHub repository secrets..."

REQUIRED_SECRETS=(
    "AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E"
    "AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF"
    "AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130"
    "AZURE_WEBAPP_PUBLISH_PROFILE"
    "PRODUCTION_DATABASE_CONNECTION_STRING"
    "STAGING_DATABASE_CONNECTION_STRING"
)

MISSING_COUNT=0
for secret in "${REQUIRED_SECRETS[@]}"; do
    if gh secret list | grep -q "$secret"; then
        echo "✅ $secret"
    else
        echo "❌ $secret - MISSING"
        ((MISSING_COUNT++))
    fi
done

if [ $MISSING_COUNT -eq 0 ]; then
    echo "🎉 All GitHub secrets are configured!"
else
    echo "❌ $MISSING_COUNT secrets are missing"
    exit 1
fi
```

## External API Keys Verification

### Reddit API Configuration

- [ ] **Reddit App Created**
  - [ ] App registered at https://www.reddit.com/prefs/apps
  - [ ] App type: Script
  - [ ] Client ID obtained
  - [ ] Client Secret obtained

- [ ] **Reddit API Keys Stored**
  ```bash
  az keyvault secret show --vault-name sentiment-analysis-kv --name RedditClientId
  az keyvault secret show --vault-name sentiment-analysis-kv --name RedditClientSecret
  ```

- [ ] **Reddit API Access Test**
  ```bash
  # Test Reddit API access
  curl -A "SentimentAnalysis/1.0" -u "$REDDIT_CLIENT_ID:$REDDIT_CLIENT_SECRET" \
    -d "grant_type=client_credentials" \
    https://www.reddit.com/api/v1/access_token
  ```

### Twitter API Configuration

- [ ] **Twitter Developer Account**
  - [ ] Developer account approved
  - [ ] Project and app created
  - [ ] API keys generated

- [ ] **Twitter API Keys Stored**
  ```bash
  az keyvault secret show --vault-name sentiment-analysis-kv --name TwitterApiKey
  az keyvault secret show --vault-name sentiment-analysis-kv --name TwitterApiSecret
  az keyvault secret show --vault-name sentiment-analysis-kv --name TwitterBearerToken
  ```

- [ ] **Twitter API Access Test**
  ```bash
  # Test Twitter API access
  curl -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
    "https://api.twitter.com/2/tweets/search/recent?query=test&max_results=10"
  ```

## Database Configuration

### Database Connectivity

- [ ] **Database Server Accessible**
  ```bash
  az postgres flexible-server show --name sentiment-analysis-db-server --resource-group sentiment-analysis-rg
  ```

- [ ] **Database Exists**
  ```bash
  az postgres flexible-server db show \
    --resource-group sentiment-analysis-rg \
    --server-name sentiment-analysis-db-server \
    --database-name sentiment_analysis_prod
  ```

- [ ] **Firewall Rules Configured**
  ```bash
  az postgres flexible-server firewall-rule list \
    --resource-group sentiment-analysis-rg \
    --name sentiment-analysis-db-server
  ```
  - [ ] Azure services allowed (0.0.0.0 - 0.0.0.0)
  - [ ] App Service subnet allowed (if using VNet integration)

- [ ] **Database Connection Test**
  ```bash
  # Test database connection
  psql -h sentiment-analysis-db-server.postgres.database.azure.com \
       -U dbadmin \
       -d sentiment_analysis_prod \
       -c "SELECT version();"
  ```

### Database Migrations

- [ ] **Migration Scripts Available**
  - [ ] `SentimentAnalysis.API/Scripts/migrate-database.sh`
  - [ ] `SentimentAnalysis.API/Scripts/migrate-database.ps1`

- [ ] **Entity Framework Tools Installed**
  ```bash
  dotnet tool list -g | grep dotnet-ef
  ```

- [ ] **Migration Dry Run**
  ```bash
  dotnet ef database update --dry-run \
    --project SentimentAnalysis.Infrastructure.Data \
    --startup-project SentimentAnalysis.API \
    --connection "$DATABASE_CONNECTION_STRING"
  ```

## Security Validation

### SSL/TLS Configuration

- [ ] **HTTPS Only Enabled**
  ```bash
  az webapp show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query httpsOnly
  ```

- [ ] **SSL Certificate Valid**
  ```bash
  openssl s_client -connect sentiment-analysis-api.azurewebsites.net:443 -servername sentiment-analysis-api.azurewebsites.net
  ```

### Security Headers

- [ ] **web.config Security Headers**
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Strict-Transport-Security` (HSTS)

### Access Control

- [ ] **Key Vault Network Access**
  - [ ] Public access disabled (if using private endpoints)
  - [ ] Firewall rules configured
  - [ ] VNet integration configured (if applicable)

- [ ] **Database Network Access**
  - [ ] SSL required
  - [ ] Firewall rules restrictive
  - [ ] No public access (if using private endpoints)

## Deployment Execution

### Pre-Deployment Steps

- [ ] **Code Quality Checks**
  - [ ] All tests passing locally
  - [ ] Code review completed
  - [ ] Security scan passed
  - [ ] No secrets in source code

- [ ] **Backup Current State**
  ```bash
  # Create database backup
  az postgres flexible-server backup list \
    --resource-group sentiment-analysis-rg \
    --server-name sentiment-analysis-db-server
  
  # Note current App Service version
  az webapp deployment list --name sentiment-analysis-api --resource-group sentiment-analysis-rg --limit 1
  ```

### Deployment Methods

#### GitHub Actions Deployment

- [ ] **Workflow File Updated**
  - [ ] `.github/workflows/azure-backend-deployment.yml` exists
  - [ ] Workflow references correct secrets
  - [ ] Environment variables configured in workflow

- [ ] **Trigger Deployment**
  ```bash
  git add .
  git commit -m "Deploy with updated secrets configuration"
  git push origin main
  ```

- [ ] **Monitor Deployment**
  - [ ] GitHub Actions workflow status
  - [ ] Build logs reviewed
  - [ ] Deployment logs reviewed

#### Manual Deployment

- [ ] **Build Application**
  ```bash
  dotnet restore
  dotnet build --configuration Release
  dotnet publish --configuration Release --output ./publish
  ```

- [ ] **Deploy to Azure**
  ```bash
  cd publish
  zip -r ../deployment.zip .
  cd ..
  
  az webapp deployment source config-zip \
    --resource-group sentiment-analysis-rg \
    --name sentiment-analysis-api \
    --src deployment.zip
  ```

### Database Migration

- [ ] **Run Migrations**
  ```bash
  cd SentimentAnalysis.API/Scripts
  export DATABASE_CONNECTION_STRING="Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;"
  ./migrate-database.sh
  ```

- [ ] **Verify Migration Success**
  ```bash
  dotnet ef migrations list \
    --project SentimentAnalysis.Infrastructure.Data \
    --startup-project SentimentAnalysis.API \
    --connection "$DATABASE_CONNECTION_STRING"
  ```

## Post-Deployment Verification

### Application Health Checks

- [ ] **Basic Connectivity**
  ```bash
  curl -I https://sentiment-analysis-api.azurewebsites.net
  ```

- [ ] **Health Endpoint**
  ```bash
  curl https://sentiment-analysis-api.azurewebsites.net/health
  ```

- [ ] **API Information Endpoint**
  ```bash
  curl https://sentiment-analysis-api.azurewebsites.net/
  ```

### Functionality Testing

- [ ] **Database Connectivity**
  - [ ] Application can connect to database
  - [ ] Database queries working
  - [ ] No connection pool issues

- [ ] **External API Integration**
  - [ ] Reddit API calls working
  - [ ] Twitter API calls working
  - [ ] API rate limits respected

- [ ] **Authentication** (if configured)
  - [ ] JWT token validation working
  - [ ] Authorization policies enforced

### CORS Validation

- [ ] **Frontend Integration**
  ```bash
  curl -H "Origin: https://yourdomain.com" \
       -H "Access-Control-Request-Method: GET" \
       -X OPTIONS \
       https://sentiment-analysis-api.azurewebsites.net/
  ```

- [ ] **CORS Headers Present**
  - [ ] `Access-Control-Allow-Origin`
  - [ ] `Access-Control-Allow-Methods`
  - [ ] `Access-Control-Allow-Headers`

### Performance Verification

- [ ] **Response Times**
  - [ ] Health endpoint < 1 second
  - [ ] API endpoints < 5 seconds
  - [ ] Database queries optimized

- [ ] **Resource Utilization**
  ```bash
  az monitor metrics list \
    --resource /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg/providers/Microsoft.Web/sites/sentiment-analysis-api \
    --metric "CpuPercentage,MemoryPercentage,ResponseTime"
  ```

### Monitoring Validation

- [ ] **Application Insights**
  - [ ] Telemetry data flowing
  - [ ] Custom events tracked
  - [ ] Error tracking working

- [ ] **Logging**
  ```bash
  az webapp log tail --name sentiment-analysis-api --resource-group sentiment-analysis-rg
  ```

- [ ] **Alerts Configured**
  - [ ] High error rate alerts
  - [ ] Performance degradation alerts
  - [ ] Availability alerts

## Rollback Procedures

### Immediate Rollback

If critical issues are detected:

- [ ] **Stop Traffic to New Version**
  ```bash
  # If using deployment slots
  az webapp deployment slot swap \
    --resource-group sentiment-analysis-rg \
    --name sentiment-analysis-api \
    --slot staging \
    --target-slot production
  ```

- [ ] **Revert Database Changes** (if necessary)
  ```bash
  # Point-in-time restore
  az postgres flexible-server restore \
    --resource-group sentiment-analysis-rg \
    --name sentiment-analysis-db-server-restored \
    --source-server sentiment-analysis-db-server \
    --restore-time "2024-01-01T10:00:00Z"
  ```

### Rollback Validation

- [ ] **Verify Rollback Success**
  - [ ] Application responding correctly
  - [ ] Database connectivity restored
  - [ ] External APIs working
  - [ ] Frontend integration working

- [ ] **Document Issues**
  - [ ] Root cause identified
  - [ ] Lessons learned documented
  - [ ] Process improvements identified

## Emergency Contacts

### Internal Team
- **Development Team Lead**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **Database Administrator**: [Contact Information]

### External Support
- **Azure Support**: Available through Azure Portal
- **GitHub Support**: For repository and Actions issues
- **Reddit API Support**: https://www.reddit.com/dev/api/
- **Twitter API Support**: https://developer.twitter.com/en/support

## Deployment Sign-off

### Technical Validation

- [ ] **Development Team Sign-off**
  - [ ] All functionality tested
  - [ ] Performance requirements met
  - [ ] Security requirements satisfied

- [ ] **Operations Team Sign-off**
  - [ ] Infrastructure configured correctly
  - [ ] Monitoring in place
  - [ ] Backup and recovery tested

### Business Validation

- [ ] **Stakeholder Approval**
  - [ ] Functional requirements met
  - [ ] Performance requirements met
  - [ ] Security requirements met
  - [ ] Go-live approval obtained

---

## Deployment Record

**Deployment Date**: _______________

**Deployed By**: _______________

**Version**: _______________

**Environment**: _______________

**GitHub Commit**: _______________

**Database Migration Version**: _______________

**Issues Encountered**:
_________________________________
_________________________________
_________________________________

**Resolution Actions**:
_________________________________
_________________________________
_________________________________

**Post-Deployment Notes**:
_________________________________
_________________________________
_________________________________

**Next Review Date**: _______________

---

## Summary

This deployment checklist ensures:

1. **All critical secrets are properly configured**
2. **Environment variables are validated before deployment**
3. **External API integrations are working**
4. **Database connectivity is verified**
5. **Security configurations are in place**
6. **Post-deployment verification is thorough**
7. **Rollback procedures are ready**

**Critical Success Factors:**
- Complete all validation steps before deployment
- Test all integrations thoroughly
- Monitor deployment progress closely
- Have rollback plan ready
- Document all issues and resolutions

For related documentation, see:
- [Azure Secrets Configuration Guide](./AZURE_SECRETS_CONFIGURATION.md)
- [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md)
- [Azure Backend Deployment Guide](./AZURE_BACKEND_DEPLOYMENT_GUIDE.md)
- [Backend Troubleshooting Guide](./BACKEND_TROUBLESHOOTING_GUIDE.md)

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-20  
**Maintained By**: Development Team  
**Review Schedule**: After each deployment