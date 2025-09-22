# Deployment Troubleshooting Guide

This guide provides solutions for common deployment issues in the Social Media Sentiment Analysis project.

## Required GitHub Secrets

To fix the deployment failures, you need to configure the following secrets in your GitHub repository:

### Backend Deployment Secrets

1. **AZURE_CREDENTIALS** - Azure Service Principal credentials for authentication
   - Go to GitHub repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `AZURE_CREDENTIALS`
   - Value: JSON format containing Azure service principal credentials:
   ```json
   {
     "clientId": "your-client-id",
     "clientSecret": "your-client-secret",
     "subscriptionId": "your-subscription-id",
     "tenantId": "your-tenant-id"
   }
   ```

### Frontend Deployment Secrets

1. **AZURE_STATIC_WEB_APPS_API_TOKEN_JOLLY_HILL_0777E4F0F** - Azure Static Web Apps deployment token
   - This should already exist if Azure Static Web Apps is configured
   - If missing, get it from Azure Portal → Static Web Apps → Overview → Manage deployment token

## How to Get Azure Credentials

### Method 1: Using Azure CLI (Recommended)

1. Install Azure CLI and login:
   ```bash
   az login
   ```

2. Create a service principal:
   ```bash
   az ad sp create-for-rbac \
     --name "github-actions-social-media-sentiment" \
     --role contributor \
     --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP \
     --sdk-auth
   ```

3. Copy the JSON output and add it as the `AZURE_CREDENTIALS` secret

### Method 2: Using Azure Portal

1. Go to Azure Active Directory → App registrations → New registration
2. Create an app registration
3. Go to Certificates & secrets → New client secret
4. Copy the client secret value
5. Go to Subscriptions → Your subscription → Access control (IAM)
6. Add role assignment → Contributor → Select your app registration
7. Format the credentials as JSON (see format above)

## Common Deployment Issues and Solutions

### 1. Azure Backend Deployment: "No credentials found"

**Error:** `Deployment Failed, Error: No credentials found. Add an Azure login action before this action.`

**Solution:**
- Add the `AZURE_CREDENTIALS` secret (see above)
- Ensure the Azure login step is present in the workflow (already fixed)

### 2. Azure Static Web Apps: "Web app warm up timed out"

**Error:** `Deployment Failed :( Deployment Failure Reason: Web app warm up timed out. Please try again later.`

**Solutions:**
- Added timeout configuration (20 minutes)
- Pre-build the Next.js application before deployment
- Skip the app build in Azure Static Web Apps since we build it manually
- Added path filters to only trigger on frontend changes

### 3. Missing Resource Group Error

**Error:** `argument --resource-group/-g: expected one argument`

**Solution:**
- Removed the rollback job that required the resource group secret
- Simplified the deployment process to focus on core functionality

## Manual Deployment Steps (If Automated Deployment Fails)

### Backend Manual Deployment

1. Build and publish locally:
   ```bash
   cd SentimentAnalysis.API
   dotnet publish -c Release -o ../publish
   ```

2. Create deployment package:
   ```bash
   cd ../publish
   zip -r deployment.zip .
   ```

3. Deploy via Azure CLI:
   ```bash
   az webapp deployment source config-zip \
     --resource-group your-resource-group \
     --name sentiment-analysis-api-1 \
     --src deployment.zip
   ```

### Frontend Manual Deployment

1. Build the Next.js application:
   ```bash
   cd sentiment-frontend
   npm install
   npm run build
   ```

2. Deploy via Azure Static Web Apps CLI:
   ```bash
   npm install -g @azure/static-web-apps-cli
   swa deploy --deployment-token your-deployment-token
   ```

## Environment Configuration

### Production Environment Variables

**Frontend (.env.production):**
```
NEXT_PUBLIC_API_URL=https://sentiment-analysis-api-1.azurewebsites.net
NODE_ENV=production
```

**Backend (Azure App Service Configuration):**
- `ASPNETCORE_ENVIRONMENT=Production`
- `ConnectionStrings__DefaultConnection=your-database-connection-string`
- Any other required environment variables

## Health Checks and Verification

After deployment, verify the services are working:

### Backend Health Check
```bash
curl https://sentiment-analysis-api-1.azurewebsites.net/health
```

### Frontend Accessibility
```bash
curl https://jolly-hill-0777e4f0f.azurestaticapps.net
```

## Monitoring and Logs

### Azure App Service Logs
1. Go to Azure Portal → App Services → sentiment-analysis-api-1
2. Navigate to Monitoring → Log stream
3. Enable Application Logging if not already enabled

### Azure Static Web Apps Logs
1. Go to Azure Portal → Static Web Apps → jolly-hill-0777e4f0f
2. Navigate to Functions → Monitor (if using Azure Functions)
3. Check Application Insights for detailed logs

### GitHub Actions Logs
1. Go to GitHub repository → Actions
2. Click on the failed workflow run
3. Expand the failed job steps to see detailed error messages

## Next Steps

1. **Configure the required secrets** in your GitHub repository
2. **Test the deployment** by pushing a small change to the main branch
3. **Monitor the workflow runs** to ensure they complete successfully
4. **Set up monitoring and alerting** for production deployments

## Support

If you continue to experience issues:
1. Check the GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly configured
3. Ensure Azure resources are properly configured
4. Consider reaching out to Azure support for infrastructure-related issues

---

**Last Updated:** September 22, 2025
**Status:** Active deployment fixes applied