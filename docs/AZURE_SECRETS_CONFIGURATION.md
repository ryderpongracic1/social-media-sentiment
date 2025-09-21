# Azure Secrets Configuration Guide

## Overview

This guide provides comprehensive instructions for configuring Azure secrets and service principals required for successful deployment of the Social Media Sentiment Analysis application. This documentation addresses the critical missing secrets that cause deployment failures.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Service Principal Setup](#azure-service-principal-setup)
3. [GitHub Repository Secrets Configuration](#github-repository-secrets-configuration)
4. [Azure Key Vault Setup](#azure-key-vault-setup)
5. [Application Secrets Management](#application-secrets-management)
6. [External API Keys Configuration](#external-api-keys-configuration)
7. [Security Best Practices](#security-best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Validation Scripts](#validation-scripts)

## Prerequisites

### Required Tools
- Azure CLI (`az`) version 2.30.0 or later
- GitHub CLI (`gh`) or access to GitHub web interface
- PowerShell 7.0+ or Bash shell
- Azure subscription with appropriate permissions

### Required Permissions
- **Azure Subscription**: Contributor or Owner role
- **GitHub Repository**: Admin access to manage secrets
- **Azure Active Directory**: Application Administrator role (for service principal creation)

### Initial Setup
```bash
# Install Azure CLI (if not already installed)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Set your subscription
az account set --subscription "your-subscription-id"

# Install GitHub CLI (optional)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh
```

## Azure Service Principal Setup

### Step 1: Create Service Principal for GitHub Actions

The following service principal is required for GitHub Actions to deploy to Azure App Service:

```bash
# Create service principal with contributor role
az ad sp create-for-rbac \
  --name "sentiment-analysis-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg \
  --sdk-auth
```

**Expected Output:**
```json
{
  "clientId": "095e79da-f422-426b-b581-ee59c2debd5e",
  "clientSecret": "your-client-secret",
  "subscriptionId": "eee389fc-bb0c-48e2-8b1f-4f6dce0af130",
  "tenantId": "01b9ccdc-9f88-4bd0-beca-e75a6bbf3adf",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

### Step 2: Extract Required Values

From the service principal output, extract these values for GitHub secrets:

| GitHub Secret Name | Value from Output | Description |
|-------------------|-------------------|-------------|
| `AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E` | `clientId` | Service principal client ID |
| `AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF` | `tenantId` | Azure tenant ID |
| `AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130` | `subscriptionId` | Azure subscription ID |

> ⚠️ **Security Warning**: The exact secret names include the actual IDs. Replace the IDs in the secret names with your actual values.

### Step 3: Assign Additional Permissions

```bash
# Get the service principal object ID
SP_OBJECT_ID=$(az ad sp show --id "095e79da-f422-426b-b581-ee59c2debd5e" --query objectId -o tsv)

# Assign Web Plan Contributor role for App Service operations
az role assignment create \
  --assignee $SP_OBJECT_ID \
  --role "Web Plan Contributor" \
  --scope /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg

# Assign SQL DB Contributor role for database operations
az role assignment create \
  --assignee $SP_OBJECT_ID \
  --role "SQL DB Contributor" \
  --scope /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg
```

## GitHub Repository Secrets Configuration

### Step 1: Access GitHub Secrets

1. Navigate to your GitHub repository
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Step 2: Configure Required Secrets

#### Azure Service Principal Secrets

Add these secrets with the values from your service principal:

```bash
# Using GitHub CLI
gh secret set AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E --body "095e79da-f422-426b-b581-ee59c2debd5e"
gh secret set AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF --body "01b9ccdc-9f88-4bd0-beca-e75a6bbf3adf"
gh secret set AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130 --body "eee389fc-bb0c-48e2-8b1f-4f6dce0af130"
```

#### Azure App Service Secrets

```bash
# Get publish profile from Azure Portal or CLI
az webapp deployment list-publishing-profiles \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg \
  --xml

# Add publish profile as secret
gh secret set AZURE_WEBAPP_PUBLISH_PROFILE --body "$(cat publish-profile.xml)"
```

#### Database Connection Secrets

```bash
# Production database connection string
gh secret set PRODUCTION_DATABASE_CONNECTION_STRING --body "Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;Trust Server Certificate=true;"

# Staging database connection string
gh secret set STAGING_DATABASE_CONNECTION_STRING --body "Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_staging;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;Trust Server Certificate=true;"
```

### Step 3: Verify Secrets Configuration

Create a validation script to check if all required secrets are configured:

```bash
#!/bin/bash
# scripts/validate-github-secrets.sh

echo "Validating GitHub repository secrets..."

REQUIRED_SECRETS=(
    "AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E"
    "AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF"
    "AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130"
    "AZURE_WEBAPP_PUBLISH_PROFILE"
    "PRODUCTION_DATABASE_CONNECTION_STRING"
    "STAGING_DATABASE_CONNECTION_STRING"
)

for secret in "${REQUIRED_SECRETS[@]}"; do
    if gh secret list | grep -q "$secret"; then
        echo "✅ $secret - Configured"
    else
        echo "❌ $secret - Missing"
    fi
done
```

## Azure Key Vault Setup

### Step 1: Create Key Vault

```bash
# Create Key Vault
az keyvault create \
  --name sentiment-analysis-kv \
  --resource-group sentiment-analysis-rg \
  --location eastus \
  --enable-soft-delete true \
  --retention-days 90

# Get Key Vault URI
KEYVAULT_URI=$(az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query properties.vaultUri -o tsv)
echo "Key Vault URI: $KEYVAULT_URI"
```

### Step 2: Configure Access Policies

```bash
# Grant access to service principal
az keyvault set-policy \
  --name sentiment-analysis-kv \
  --spn "095e79da-f422-426b-b581-ee59c2debd5e" \
  --secret-permissions get list

# Grant access to App Service (using managed identity)
az webapp identity assign \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg

# Get App Service managed identity
MANAGED_IDENTITY=$(az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg --query principalId -o tsv)

# Grant Key Vault access to managed identity
az keyvault set-policy \
  --name sentiment-analysis-kv \
  --object-id $MANAGED_IDENTITY \
  --secret-permissions get list
```

### Step 3: Store Secrets in Key Vault

```bash
# Database password
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "DatabasePassword" \
  --value "YourSecurePassword123!"

# JWT signing key
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "JwtSigningKey" \
  --value "your-jwt-signing-key"

# Application Insights connection string
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "ApplicationInsightsConnectionString" \
  --value "InstrumentationKey=your-key;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/"
```

## Application Secrets Management

### Step 1: Configure App Service to Use Key Vault

```bash
# Set Key Vault references in App Service
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    AZURE_KEY_VAULT_URI="$KEYVAULT_URI" \
    DB_PASSWORD="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=DatabasePassword)" \
    JWT_SIGNING_KEY="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=JwtSigningKey)" \
    APPLICATIONINSIGHTS_CONNECTION_STRING="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=ApplicationInsightsConnectionString)"
```

### Step 2: Configure Environment-Specific Settings

#### Development Environment
```bash
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --slot development \
  --settings \
    ASPNETCORE_ENVIRONMENT="Development" \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_dev" \
    DB_USER="dbadmin" \
    DB_PORT="5432" \
    FRONTEND_DOMAIN="localhost:3000"
```

#### Staging Environment
```bash
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --slot staging \
  --settings \
    ASPNETCORE_ENVIRONMENT="Staging" \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_staging" \
    DB_USER="dbadmin" \
    DB_PORT="5432" \
    FRONTEND_DOMAIN="staging.yourdomain.com"
```

#### Production Environment
```bash
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    ASPNETCORE_ENVIRONMENT="Production" \
    DB_HOST="sentiment-analysis-db-server.postgres.database.azure.com" \
    DB_NAME="sentiment_analysis_prod" \
    DB_USER="dbadmin" \
    DB_PORT="5432" \
    FRONTEND_DOMAIN="yourdomain.com" \
    AZURE_STATIC_WEB_APP_URL="your-app.azurestaticapps.net"
```

## External API Keys Configuration

### Step 1: Obtain API Keys

#### Reddit API Keys
1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill in the details:
   - **Name**: Social Media Sentiment Analysis
   - **App type**: Script
   - **Description**: Sentiment analysis of Reddit posts
   - **About URL**: Your application URL
   - **Redirect URI**: Not needed for script type
4. Note down the **Client ID** and **Client Secret**

#### Twitter API Keys
1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Generate the following keys:
   - **API Key** (Consumer Key)
   - **API Secret Key** (Consumer Secret)
   - **Bearer Token**
   - **Access Token** and **Access Token Secret** (if needed)

### Step 2: Store API Keys Securely

#### In Azure Key Vault
```bash
# Reddit API keys
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "RedditClientId" \
  --value "your-reddit-client-id"

az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "RedditClientSecret" \
  --value "your-reddit-client-secret"

# Twitter API keys
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "TwitterApiKey" \
  --value "your-twitter-api-key"

az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "TwitterApiSecret" \
  --value "your-twitter-api-secret"

az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "TwitterBearerToken" \
  --value "your-twitter-bearer-token"
```

#### In App Service Configuration
```bash
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    REDDIT_CLIENT_ID="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientId)" \
    REDDIT_CLIENT_SECRET="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=RedditClientSecret)" \
    TWITTER_API_KEY="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiKey)" \
    TWITTER_API_SECRET="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterApiSecret)" \
    TWITTER_BEARER_TOKEN="@Microsoft.KeyVault(VaultName=sentiment-analysis-kv;SecretName=TwitterBearerToken)"
```

### Step 3: Configure JWT Authentication

```bash
# JWT configuration for authentication
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-analysis-api \
  --settings \
    JWT_AUTHORITY="https://login.microsoftonline.com/your-tenant-id/v2.0" \
    JWT_AUDIENCE="api://sentiment-analysis-api" \
    JWT_ISSUER="https://login.microsoftonline.com/your-tenant-id/v2.0"
```

## Security Best Practices

### 1. Secret Rotation Strategy

#### Automated Secret Rotation
```bash
# Create script for rotating secrets
cat > scripts/rotate-secrets.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting secret rotation..."

# Rotate database password
NEW_DB_PASSWORD=$(openssl rand -base64 32)
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "DatabasePassword" \
  --value "$NEW_DB_PASSWORD"

# Update database user password
az postgres flexible-server parameter set \
  --resource-group sentiment-analysis-rg \
  --server-name sentiment-analysis-db-server \
  --name password_encryption \
  --value scram-sha-256

# Rotate JWT signing key
NEW_JWT_KEY=$(openssl rand -base64 64)
az keyvault secret set \
  --vault-name sentiment-analysis-kv \
  --name "JwtSigningKey" \
  --value "$NEW_JWT_KEY"

echo "Secret rotation completed successfully!"
EOF

chmod +x scripts/rotate-secrets.sh
```

#### Schedule Secret Rotation
```bash
# Create Azure Automation runbook for scheduled rotation
az automation runbook create \
  --automation-account-name sentiment-analysis-automation \
  --resource-group sentiment-analysis-rg \
  --name "RotateSecrets" \
  --type PowerShell \
  --description "Automated secret rotation"
```

### 2. Access Control and Monitoring

#### Configure Audit Logging
```bash
# Enable Key Vault logging
az monitor diagnostic-settings create \
  --name "KeyVaultAuditLogs" \
  --resource $(az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query id -o tsv) \
  --logs '[{"category":"AuditEvent","enabled":true,"retentionPolicy":{"enabled":true,"days":90}}]' \
  --workspace $(az monitor log-analytics workspace show --workspace-name sentiment-analysis-logs --resource-group sentiment-analysis-rg --query id -o tsv)
```

#### Set Up Alerts
```bash
# Create alert for unauthorized Key Vault access
az monitor metrics alert create \
  --name "UnauthorizedKeyVaultAccess" \
  --resource-group sentiment-analysis-rg \
  --scopes $(az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query id -o tsv) \
  --condition "count 'Unauthorized' > 0" \
  --description "Alert when unauthorized access to Key Vault is detected"
```

### 3. Network Security

#### Configure Private Endpoints
```bash
# Create private endpoint for Key Vault
az network private-endpoint create \
  --name sentiment-analysis-kv-pe \
  --resource-group sentiment-analysis-rg \
  --vnet-name sentiment-analysis-vnet \
  --subnet private-endpoints \
  --private-connection-resource-id $(az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query id -o tsv) \
  --group-id vault \
  --connection-name sentiment-analysis-kv-connection
```

#### Restrict Key Vault Access
```bash
# Configure firewall rules for Key Vault
az keyvault network-rule add \
  --name sentiment-analysis-kv \
  --resource-group sentiment-analysis-rg \
  --vnet-name sentiment-analysis-vnet \
  --subnet app-service-subnet

# Deny public access
az keyvault update \
  --name sentiment-analysis-kv \
  --resource-group sentiment-analysis-rg \
  --default-action Deny
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Service Principal Authentication Failures

**Symptoms:**
- GitHub Actions fails with authentication errors
- "AADSTS70002: Error validating credentials" messages

**Solutions:**
```bash
# Verify service principal exists and is active
az ad sp show --id "095e79da-f422-426b-b581-ee59c2debd5e"

# Check role assignments
az role assignment list --assignee "095e79da-f422-426b-b581-ee59c2debd5e"

# Regenerate client secret if expired
az ad sp credential reset --id "095e79da-f422-426b-b581-ee59c2debd5e"
```

#### 2. Key Vault Access Denied

**Symptoms:**
- App Service cannot retrieve secrets from Key Vault
- "Access denied" errors in application logs

**Solutions:**
```bash
# Verify managed identity is assigned
az webapp identity show --name sentiment-analysis-api --resource-group sentiment-analysis-rg

# Check Key Vault access policies
az keyvault show --name sentiment-analysis-kv --resource-group sentiment-analysis-rg --query properties.accessPolicies

# Test Key Vault access
az keyvault secret show --vault-name sentiment-analysis-kv --name DatabasePassword
```

#### 3. Database Connection Issues

**Symptoms:**
- Application cannot connect to database
- Connection timeout errors

**Solutions:**
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
echo "Host=sentiment-analysis-db-server.postgres.database.azure.com;Database=sentiment_analysis_prod;Username=dbadmin;Password=YourSecurePassword123!;Port=5432;SSL Mode=Require;Trust Server Certificate=true;"
```

### Diagnostic Commands

```bash
# Check all App Service configuration
az webapp config appsettings list \
  --name sentiment-analysis-api \
  --resource-group sentiment-analysis-rg

# Verify Key Vault secrets
az keyvault secret list --vault-name sentiment-analysis-kv

# Test GitHub secrets (requires GitHub CLI)
gh secret list

# Check service principal permissions
az role assignment list --assignee "095e79da-f422-426b-b581-ee59c2debd5e" --output table
```

## Validation Scripts

### Complete Secrets Validation Script

```bash
#!/bin/bash
# scripts/validate-all-secrets.sh

set -e

echo "🔍 Validating Azure Secrets Configuration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
RESOURCE_GROUP="sentiment-analysis-rg"
APP_NAME="sentiment-analysis-api"
KEYVAULT_NAME="sentiment-analysis-kv"
SP_CLIENT_ID="095e79da-f422-426b-b581-ee59c2debd5e"

echo "📋 Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  App Service: $APP_NAME"
echo "  Key Vault: $KEYVAULT_NAME"
echo "  Service Principal: $SP_CLIENT_ID"
echo ""

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

# 1. Check Azure CLI authentication
echo "🔐 Checking Azure CLI authentication..."
az account show > /dev/null 2>&1
check_status "Azure CLI authenticated"

# 2. Check service principal
echo "👤 Checking service principal..."
az ad sp show --id "$SP_CLIENT_ID" > /dev/null 2>&1
check_status "Service principal exists"

# 3. Check role assignments
echo "🔑 Checking role assignments..."
ROLE_COUNT=$(az role assignment list --assignee "$SP_CLIENT_ID" --query "length(@)")
if [ "$ROLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Service principal has $ROLE_COUNT role assignments${NC}"
else
    echo -e "${RED}❌ Service principal has no role assignments${NC}"
fi

# 4. Check Key Vault
echo "🔒 Checking Key Vault..."
az keyvault show --name "$KEYVAULT_NAME" --resource-group "$RESOURCE_GROUP" > /dev/null 2>&1
check_status "Key Vault exists"

# 5. Check Key Vault secrets
echo "🗝️  Checking Key Vault secrets..."
REQUIRED_SECRETS=("DatabasePassword" "JwtSigningKey" "ApplicationInsightsConnectionString" "RedditClientId" "RedditClientSecret" "TwitterApiKey" "TwitterApiSecret" "TwitterBearerToken")

for secret in "${REQUIRED_SECRETS[@]}"; do
    if az keyvault secret show --vault-name "$KEYVAULT_NAME" --name "$secret" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Secret: $secret${NC}"
    else
        echo -e "${RED}❌ Secret missing: $secret${NC}"
    fi
done

# 6. Check App Service
echo "🌐 Checking App Service..."
az webapp show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" > /dev/null 2>&1
check_status "App Service exists"

# 7. Check App Service managed identity
echo "🆔 Checking App Service managed identity..."
MANAGED_IDENTITY=$(az webapp identity show --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query principalId -o tsv 2>/dev/null)
if [ -n "$MANAGED_IDENTITY" ]; then
    echo -e "${GREEN}✅ Managed identity configured: $MANAGED_IDENTITY${NC}"
else
    echo -e "${RED}❌ Managed identity not configured${NC}"
fi

# 8. Check App Service configuration
echo "⚙️  Checking App Service configuration..."
REQUIRED_SETTINGS=("AZURE_KEY_VAULT_URI" "DB_HOST" "DB_NAME" "DB_USER" "DB_PORT" "ASPNETCORE_ENVIRONMENT")

for setting in "${REQUIRED_SETTINGS[@]}"; do
    VALUE=$(az webapp config appsettings list --name "$APP_NAME" --resource-group "$RESOURCE_GROUP" --query "[?name=='$setting'].value" -o tsv 2>/dev/null)
    if [ -n "$VALUE" ]; then
        echo -e "${GREEN}✅ Setting: $setting${NC}"
    else
        echo -e "${RED}❌ Setting missing: $setting${NC}"
    fi
done

# 9. Check GitHub secrets (if GitHub CLI is available)
if command -v gh &> /dev/null; then
    echo "🐙 Checking GitHub secrets..."
    GITHUB_SECRETS=("AZUREAPPSERVICE_CLIENTID_095E79DAF422426BB581EE59C2DEBD5E" "AZUREAPPSERVICE_TENANTID_01B9CCDC9F884BD0BECAE75A6BBF3ADF" "AZUREAPPSERVICE_SUBSCRIPTIONID_EEE389FCBB0C48E28B1F4F6DCE0AF130" "AZURE_WEBAPP_PUBLISH_PROFILE" "PRODUCTION_DATABASE_CONNECTION_STRING" "STAGING_DATABASE_CONNECTION_STRING")
    
    for secret in "${GITHUB_SECRETS[@]}"; do
        if gh secret list | grep -q "$secret"; then
            echo -e "${GREEN}✅ GitHub secret: $secret${NC}"
        else
            echo -e "${RED}❌ GitHub secret missing: $secret${NC}"
        fi
    done
else
    echo -e "${YELLOW}⚠️  GitHub CLI not available - skipping GitHub secrets validation${NC}"
fi

echo ""
echo "🎉 Validation completed!"
echo ""
echo "📝 Next steps if issues found:"
echo "  1. Review the Azure Secrets Configuration Guide"
echo "  2. Run the setup scripts for missing components"
echo "  3. Verify permissions and access policies"
echo "  4. Test deployment after fixing issues"
```

### Quick Setup Script

```bash
#!/bin/bash
# scripts/quick-setup-secrets.sh

set -e

echo "🚀 Quick Azure Secrets Setup..."

# Configuration
RESOURCE_GROUP="sentiment-analysis-rg"
APP_NAME="sentiment-analysis-api"
KEYVAULT_NAME="sentiment-analysis-kv"
LOCATION="eastus"

# Create service principal
echo "👤 Creating service principal..."
SP_OUTPUT=$(az ad sp create-for-rbac \
  --name "sentiment-analysis-github-actions" \
  --role contributor \
  --scopes /subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP \
  --sdk-auth)

echo "Service Principal created. Save this output for GitHub secrets:"
echo "$SP_OUTPUT"

# Create Key Vault
echo "🔒 Creating Key Vault..."
az keyvault create \
  --name $KEYVAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --enable-soft-delete true

# Enable managed identity for App Service
echo "🆔 Enabling managed identity..."
az webapp identity assign \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP

# Configure Key Vault access
echo "🔑 Configuring Key Vault access..."
MANAGED_IDENTITY=$(az webapp identity show --name $APP_NAME --resource-group $RESOURCE_GROUP --query principalId -o tsv)
az keyvault set-policy \
  --name $KEYVAULT_NAME \
  --object-id $MANAGED_IDENTITY \
  --secret-permissions get list

echo "✅ Basic setup completed!"
echo ""
echo "📝 Next steps:"
echo "  1. Add the service principal output to GitHub secrets"
echo "  2. Store your API keys in Key Vault using the provided scripts"
echo "  3. Configure App Service settings to reference Key Vault secrets"
echo "  4. Run the validation script to verify everything is working"
```

---

## Summary

This guide provides comprehensive instructions for configuring all Azure secrets required for successful deployment. The key components covered include:

1. **Service Principal Setup** - For GitHub Actions authentication
2. **GitHub Secrets Configuration** - Repository secrets for CI/CD
3. **Azure Key Vault Setup** - Secure secret storage
4. **Application Configuration** - Environment variables and settings
5. **External API Keys** - Reddit, Twitter, and other service integrations
6. **Security Best Practices** - Rotation, monitoring, and access control
7. **Troubleshooting** - Common issues and solutions
8. **Validation Scripts** - Automated verification tools

**Important Security Reminders:**
- Never commit secrets to source code
- Use Key Vault references in App Service settings
- Implement secret rotation policies
- Monitor access and usage
- Follow principle of least privilege

For additional help, refer to the [Environment Variables Reference](./ENVIRONMENT_VARIABLES.md) and [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md).

---

**Document Version**: 1.0  
**Last Updated**: 2024-12-20  
**Maintained By**: Development Team  
**Review Schedule**: Monthly