# Azure Deployment Guide for Next.js Frontend

## Overview

This comprehensive guide covers deploying the Social Media Sentiment Analysis Next.js frontend to Microsoft Azure using three different deployment options:

1. **Azure Static Web Apps** (Recommended for Next.js)
2. **Azure App Service** (Traditional web hosting)
3. **Azure Container Instances** (Containerized deployment)

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Static Web Apps Deployment](#azure-static-web-apps-deployment)
3. [Azure App Service Deployment](#azure-app-service-deployment)
4. [Azure Container Instances Deployment](#azure-container-instances-deployment)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Custom Domain Setup](#custom-domain-setup)
7. [SSL Certificate Configuration](#ssl-certificate-configuration)
8. [Cost Comparison](#cost-comparison)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Tools
- Azure CLI (`az`) installed and configured
- Node.js 18+ installed locally
- Git repository with your Next.js application
- Azure subscription with appropriate permissions

### Azure CLI Setup
```bash
# Install Azure CLI (if not already installed)
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "your-subscription-id"
```

### Required Azure Resources
- Resource Group
- Azure Active Directory App Registration (for authentication)

## Azure Static Web Apps Deployment

### Why Choose Azure Static Web Apps?
- **Best for Next.js**: Native support for static site generation and API routes
- **Global CDN**: Built-in content delivery network
- **Free SSL**: Automatic HTTPS certificates
- **Custom Domains**: Easy domain configuration
- **GitHub Integration**: Seamless CI/CD with GitHub Actions
- **Cost-Effective**: Generous free tier

### Step 1: Create Azure Static Web App

#### Using Azure Portal
1. Navigate to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Static Web App"
3. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `sentiment-frontend-swa`
   - **Plan Type**: Free (for development) or Standard (for production)
   - **Region**: Choose closest to your users
   - **Source**: GitHub
   - **GitHub Account**: Connect your GitHub account
   - **Repository**: Select your repository
   - **Branch**: `main`
   - **Build Presets**: Next.js
   - **App Location**: `sentiment-frontend`
   - **Output Location**: `out`

#### Using Azure CLI
```bash
# Create resource group
az group create --name sentiment-analysis-rg --location eastus

# Create static web app
az staticwebapp create \
  --name sentiment-frontend-swa \
  --resource-group sentiment-analysis-rg \
  --source https://github.com/yourusername/your-repo \
  --location eastus \
  --branch main \
  --app-location "sentiment-frontend" \
  --output-location "out" \
  --login-with-github
```

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add these secrets:

```
AZURE_STATIC_WEB_APPS_API_TOKEN: [Get from Azure Portal → Static Web App → Manage deployment token]
AZURE_API_URL: https://your-backend-api.azurewebsites.net/api
AZURE_WS_URL: wss://your-backend-api.azurewebsites.net
```

### Step 3: Deploy Using GitHub Actions

The deployment will automatically trigger when you push to the main branch. The workflow file is already created at `.github/workflows/azure-static-web-apps.yml`.

### Step 4: Configure Static Web App Settings

Update the `staticwebapp.config.json` file (already created) to customize:
- Routing rules
- Authentication
- Security headers
- API proxying

## Azure App Service Deployment

### Why Choose Azure App Service?
- **Full Control**: Complete server environment control
- **Scaling**: Easy horizontal and vertical scaling
- **Monitoring**: Built-in application insights
- **Deployment Slots**: Blue-green deployments
- **Custom Runtime**: Support for custom Node.js versions

### Step 1: Create Azure App Service

#### Using Azure Portal
1. Navigate to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource" → "Web App"
3. Fill in the details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: `sentiment-analysis-rg`
   - **Name**: `sentiment-frontend-app`
   - **Runtime Stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: East US
   - **App Service Plan**: Create new (B1 Basic or higher)

#### Using Azure CLI
```bash
# Create App Service Plan
az appservice plan create \
  --name sentiment-frontend-plan \
  --resource-group sentiment-analysis-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group sentiment-analysis-rg \
  --plan sentiment-frontend-plan \
  --name sentiment-frontend-app \
  --runtime "NODE|18-lts" \
  --deployment-local-git
```

### Step 2: Configure App Service Settings

```bash
# Set Node.js version
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-frontend-app \
  --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0"

# Set environment variables
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-frontend-app \
  --settings \
    NEXT_PUBLIC_API_URL="https://your-backend-api.azurewebsites.net/api" \
    NEXT_PUBLIC_WS_URL="wss://your-backend-api.azurewebsites.net" \
    NEXT_PUBLIC_APP_ENV="production" \
    AZURE_DEPLOYMENT="true"
```

### Step 3: Configure GitHub Secrets for App Service

Add these additional secrets to your GitHub repository:

```
AZUREAPPSERVICE_PUBLISHPROFILE: [Download from Azure Portal → App Service → Get publish profile]
AZURE_RESOURCE_GROUP: sentiment-analysis-rg
```

### Step 4: Deploy Using GitHub Actions

The workflow file `.github/workflows/azure-app-service.yml` will handle the deployment automatically.

## Azure Container Instances Deployment

### Why Choose Azure Container Instances?
- **Containerized**: Full Docker support
- **Serverless**: Pay per second of execution
- **Fast Startup**: Quick container startup times
- **Isolation**: Complete application isolation
- **Custom Images**: Use any Docker image

### Step 1: Create Azure Container Registry

```bash
# Create Azure Container Registry
az acr create \
  --resource-group sentiment-analysis-rg \
  --name sentimentfrontendregistry \
  --sku Basic \
  --admin-enabled true

# Get ACR credentials
az acr credential show --name sentimentfrontendregistry
```

### Step 2: Configure GitHub Secrets for Container Deployment

Add these secrets to your GitHub repository:

```
ACR_USERNAME: [From ACR credentials]
ACR_PASSWORD: [From ACR credentials]
AZURE_CREDENTIALS: [Service Principal JSON - see below]
```

#### Create Service Principal for Azure Credentials

```bash
# Create service principal
az ad sp create-for-rbac \
  --name "sentiment-frontend-sp" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/sentiment-analysis-rg \
  --sdk-auth

# Copy the JSON output to AZURE_CREDENTIALS secret
```

### Step 3: Deploy Using GitHub Actions

The workflow file `.github/workflows/azure-container-instances.yml` will:
1. Build Docker image
2. Push to Azure Container Registry
3. Deploy to Azure Container Instances
4. Clean up old images

## Environment Variables Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `https://sentiment-api.azurewebsites.net/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket endpoint | `wss://sentiment-api.azurewebsites.net` |
| `NEXT_PUBLIC_APP_ENV` | Application environment | `production` |

### Azure-Specific Variables

| Variable | Description | Used In |
|----------|-------------|---------|
| `AZURE_DEPLOYMENT` | Enables standalone build | App Service |
| `WEBSITE_NODE_DEFAULT_VERSION` | Node.js version | App Service |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | Enable build on deploy | App Service |

### Setting Environment Variables

#### Azure Static Web Apps
```bash
# Using Azure CLI
az staticwebapp appsettings set \
  --name sentiment-frontend-swa \
  --setting-names \
    NEXT_PUBLIC_API_URL="https://your-api.azurewebsites.net/api" \
    NEXT_PUBLIC_WS_URL="wss://your-api.azurewebsites.net" \
    NEXT_PUBLIC_APP_ENV="production"
```

#### Azure App Service
```bash
# Using Azure CLI
az webapp config appsettings set \
  --resource-group sentiment-analysis-rg \
  --name sentiment-frontend-app \
  --settings \
    NEXT_PUBLIC_API_URL="https://your-api.azurewebsites.net/api" \
    NEXT_PUBLIC_WS_URL="wss://your-api.azurewebsites.net" \
    NEXT_PUBLIC_APP_ENV="production"
```

## Custom Domain Setup

### Azure Static Web Apps

1. **Purchase Domain**: Buy domain from Azure or external provider
2. **Add Custom Domain**:
   ```bash
   az staticwebapp hostname set \
     --name sentiment-frontend-swa \
     --hostname yourdomain.com
   ```
3. **Configure DNS**: Add CNAME record pointing to your Static Web App URL

### Azure App Service

1. **Add Custom Domain**:
   ```bash
   az webapp config hostname add \
     --webapp-name sentiment-frontend-app \
     --resource-group sentiment-analysis-rg \
     --hostname yourdomain.com
   ```
2. **Configure DNS**: Add CNAME or A record

## SSL Certificate Configuration

### Automatic SSL (Recommended)

Both Azure Static Web Apps and App Service provide free SSL certificates:

```bash
# For App Service - bind SSL certificate
az webapp config ssl bind \
  --certificate-thumbprint {thumbprint} \
  --ssl-type SNI \
  --name sentiment-frontend-app \
  --resource-group sentiment-analysis-rg
```

### Custom SSL Certificate

Upload your own certificate if needed:

```bash
# Upload certificate to App Service
az webapp config ssl upload \
  --certificate-file path/to/certificate.pfx \
  --certificate-password {password} \
  --name sentiment-frontend-app \
  --resource-group sentiment-analysis-rg
```

## Cost Comparison

### Azure Static Web Apps
- **Free Tier**: 
  - 100 GB bandwidth/month
  - 0.5 GB storage
  - Custom domains
  - SSL certificates
- **Standard Tier**: $9/month
  - 100 GB bandwidth included
  - Additional bandwidth: $0.20/GB
  - Advanced features

### Azure App Service
- **Basic B1**: ~$13/month
  - 1 core, 1.75 GB RAM
  - 10 GB storage
  - Custom domains & SSL
- **Standard S1**: ~$56/month
  - 1 core, 1.75 GB RAM
  - 50 GB storage
  - Deployment slots
  - Auto-scaling

### Azure Container Instances
- **Pay-per-use**: 
  - $0.0012/vCPU/second
  - $0.00017/GB memory/second
  - Example: 1 vCPU, 1.5GB RAM = ~$32/month (continuous)

### Recommendation by Use Case

| Use Case | Recommended Service | Reason |
|----------|-------------------|---------|
| **Development/Testing** | Static Web Apps (Free) | Cost-effective, easy setup |
| **Production (Low Traffic)** | Static Web Apps (Standard) | Best performance, global CDN |
| **Production (High Traffic)** | App Service (Standard+) | Better scaling, monitoring |
| **Microservices** | Container Instances | Isolation, custom runtime |

## Performance Considerations

### Azure Static Web Apps
- ✅ Global CDN distribution
- ✅ Edge caching
- ✅ Optimized for static content
- ❌ Limited server-side processing

### Azure App Service
- ✅ Full server control
- ✅ Auto-scaling capabilities
- ✅ Application Insights integration
- ❌ Single region deployment (without additional setup)

### Azure Container Instances
- ✅ Fast startup times
- ✅ Resource isolation
- ✅ Custom runtime environments
- ❌ No built-in load balancing

## Troubleshooting

### Common Issues

#### 1. Build Failures
**Symptoms**: Deployment fails during build step
**Solutions**:
```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Install dependencies
npm ci

# Build locally first
npm run build
```

#### 2. Environment Variables Not Loading
**Symptoms**: App uses default/localhost URLs in production
**Solutions**:
- Verify variables start with `NEXT_PUBLIC_`
- Check Azure portal configuration
- Restart the service after setting variables

#### 3. Static Web Apps Routing Issues
**Symptoms**: 404 errors on direct URL access
**Solutions**:
- Check `staticwebapp.config.json` routing rules
- Ensure `navigationFallback` is configured
- Verify build output location

#### 4. App Service Deployment Issues
**Symptoms**: Deployment succeeds but app doesn't start
**Solutions**:
```bash
# Check application logs
az webapp log tail --name sentiment-frontend-app --resource-group sentiment-analysis-rg

# Verify web.config is present
# Check Node.js version compatibility
# Ensure standalone build is enabled
```

#### 5. Container Registry Authentication
**Symptoms**: Cannot push/pull images
**Solutions**:
```bash
# Login to ACR
az acr login --name sentimentfrontendregistry

# Check credentials
az acr credential show --name sentimentfrontendregistry

# Test image pull
docker pull sentimentfrontendregistry.azurecr.io/sentiment-frontend:latest
```

### Debugging Commands

```bash
# Check resource status
az resource list --resource-group sentiment-analysis-rg --output table

# View deployment logs
az webapp log tail --name sentiment-frontend-app --resource-group sentiment-analysis-rg

# Test connectivity
curl -I https://sentiment-frontend-app.azurewebsites.net

# Check DNS resolution
nslookup yourdomain.com

# Validate SSL certificate
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### Performance Monitoring

#### Application Insights Setup
```bash
# Create Application Insights
az monitor app-insights component create \
  --app sentiment-frontend-insights \
  --location eastus \
  --resource-group sentiment-analysis-rg

# Get instrumentation key
az monitor app-insights component show \
  --app sentiment-frontend-insights \
  --resource-group sentiment-analysis-rg \
  --query instrumentationKey
```

#### Key Metrics to Monitor
- Response time
- Request rate
- Error rate
- Memory usage
- CPU utilization

## Security Best Practices

### 1. Network Security
- Use HTTPS only
- Configure proper CORS headers
- Implement Content Security Policy (CSP)

### 2. Authentication
- Use Azure Active Directory integration
- Implement proper session management
- Use secure cookie settings

### 3. Environment Variables
- Never commit secrets to version control
- Use Azure Key Vault for sensitive data
- Rotate credentials regularly

### 4. Monitoring
- Enable Application Insights
- Set up alerts for errors
- Monitor security events

## Next Steps

After successful deployment:

1. **Set up monitoring**: Configure Application Insights and alerts
2. **Performance testing**: Use Azure Load Testing to validate performance
3. **Security scanning**: Run security scans on your deployed application
4. **Backup strategy**: Implement backup and disaster recovery plans
5. **CI/CD optimization**: Fine-tune your deployment pipelines

## Support Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Container Instances Documentation](https://docs.microsoft.com/en-us/azure/container-instances/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

For additional help, check the troubleshooting section or create an issue in the repository.