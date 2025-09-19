# Azure Deployment Checklist

## Pre-Deployment Checklist

### Prerequisites
- [ ] Azure subscription with appropriate permissions
- [ ] Azure CLI installed and configured (`az --version`)
- [ ] Node.js 18+ installed locally
- [ ] GitHub repository with Next.js application
- [ ] Backend API deployed and accessible

### Repository Setup
- [ ] All Azure configuration files are present:
  - [ ] `staticwebapp.config.json`
  - [ ] `web.config`
  - [ ] `.github/workflows/azure-static-web-apps.yml`
  - [ ] `.github/workflows/azure-app-service.yml`
  - [ ] `.github/workflows/azure-container-instances.yml`
- [ ] Environment variable example file created (`.env.azure.example`)
- [ ] Dockerfile is optimized for production
- [ ] `next.config.ts` includes Azure deployment configuration

## Azure Static Web Apps Deployment

### Resource Creation
- [ ] Resource group created: `sentiment-analysis-rg`
- [ ] Static Web App created with correct configuration:
  - [ ] Name: `sentiment-frontend-swa`
  - [ ] Plan: Free (development) or Standard (production)
  - [ ] GitHub integration configured
  - [ ] Build preset: Next.js
  - [ ] App location: `sentiment-frontend`
  - [ ] Output location: `out`

### GitHub Configuration
- [ ] GitHub secrets configured:
  - [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN`
  - [ ] `AZURE_API_URL`
  - [ ] `AZURE_WS_URL`
- [ ] GitHub Actions workflow file is working
- [ ] First deployment completed successfully

### Environment Variables
- [ ] Production environment variables set in Azure Portal:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_WS_URL`
  - [ ] `NEXT_PUBLIC_APP_ENV=production`

### Testing
- [ ] Application loads correctly
- [ ] API connectivity working
- [ ] WebSocket connections established
- [ ] Routing works for all pages
- [ ] Static assets loading properly
- [ ] SSL certificate is active

## Azure App Service Deployment

### Resource Creation
- [ ] App Service Plan created:
  - [ ] Name: `sentiment-frontend-plan`
  - [ ] SKU: B1 Basic or higher
  - [ ] Operating System: Linux
- [ ] Web App created:
  - [ ] Name: `sentiment-frontend-app`
  - [ ] Runtime: Node 18 LTS
  - [ ] Deployment source configured

### Configuration
- [ ] App Service settings configured:
  - [ ] `WEBSITE_NODE_DEFAULT_VERSION=18.17.0`
  - [ ] `SCM_DO_BUILD_DURING_DEPLOYMENT=true`
  - [ ] `AZURE_DEPLOYMENT=true`
- [ ] Environment variables set:
  - [ ] `NEXT_PUBLIC_API_URL`
  - [ ] `NEXT_PUBLIC_WS_URL`
  - [ ] `NEXT_PUBLIC_APP_ENV=production`

### GitHub Configuration
- [ ] GitHub secrets configured:
  - [ ] `AZUREAPPSERVICE_PUBLISHPROFILE`
  - [ ] `AZURE_RESOURCE_GROUP`
  - [ ] `AZURE_API_URL`
  - [ ] `AZURE_WS_URL`

### Testing
- [ ] Application starts successfully
- [ ] Logs show no startup errors
- [ ] All routes accessible
- [ ] API integration working
- [ ] Performance is acceptable

## Azure Container Instances Deployment

### Container Registry Setup
- [ ] Azure Container Registry created:
  - [ ] Name: `sentimentfrontendregistry`
  - [ ] SKU: Basic
  - [ ] Admin user enabled
- [ ] Registry credentials obtained

### GitHub Configuration
- [ ] GitHub secrets configured:
  - [ ] `ACR_USERNAME`
  - [ ] `ACR_PASSWORD`
  - [ ] `AZURE_CREDENTIALS` (Service Principal)
  - [ ] `AZURE_API_URL`
  - [ ] `AZURE_WS_URL`

### Service Principal Setup
- [ ] Service Principal created with appropriate permissions
- [ ] JSON credentials added to GitHub secrets
- [ ] Permissions verified for resource group

### Container Deployment
- [ ] Docker image builds successfully
- [ ] Image pushes to ACR without errors
- [ ] Container instance deploys successfully
- [ ] Container starts and runs properly

### Testing
- [ ] Container instance is running
- [ ] Application accessible via public IP/FQDN
- [ ] All functionality working correctly
- [ ] Resource usage within expected limits

## Post-Deployment Configuration

### Custom Domain Setup (Optional)
- [ ] Domain purchased or available
- [ ] DNS records configured:
  - [ ] CNAME record pointing to Azure service
  - [ ] A record (if using apex domain)
- [ ] Custom domain added in Azure Portal
- [ ] SSL certificate configured and active

### Monitoring Setup
- [ ] Application Insights configured:
  - [ ] Instrumentation key obtained
  - [ ] Connection string configured
  - [ ] Basic telemetry working
- [ ] Alerts configured for:
  - [ ] Application errors
  - [ ] High response times
  - [ ] Service availability

### Security Configuration
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] Security headers configured
- [ ] CORS policy updated to include Azure domains
- [ ] Authentication configured (if required)

### Performance Optimization
- [ ] CDN configured (if using App Service)
- [ ] Compression enabled
- [ ] Caching headers configured
- [ ] Static assets optimized

## Testing & Validation

### Functional Testing
- [ ] All pages load correctly
- [ ] Navigation works properly
- [ ] Forms submit successfully
- [ ] API calls return expected data
- [ ] WebSocket connections stable
- [ ] Error handling works correctly

### Performance Testing
- [ ] Page load times acceptable (<3 seconds)
- [ ] Lighthouse score >90 for performance
- [ ] No console errors in browser
- [ ] Memory usage within limits
- [ ] CPU usage reasonable

### Security Testing
- [ ] HTTPS working correctly
- [ ] Security headers present
- [ ] No sensitive data exposed
- [ ] Authentication working (if applicable)
- [ ] CORS policy restrictive enough

### Cross-Browser Testing
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Backup & Recovery

### Backup Strategy
- [ ] Source code backed up in Git
- [ ] Database backups configured (if applicable)
- [ ] Configuration documented
- [ ] Deployment scripts saved

### Disaster Recovery Plan
- [ ] Recovery procedures documented
- [ ] Alternative deployment method available
- [ ] Contact information for team members
- [ ] Escalation procedures defined

## Documentation

### Technical Documentation
- [ ] Deployment guide updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Architecture diagrams current

### Operational Documentation
- [ ] Monitoring procedures documented
- [ ] Maintenance schedules defined
- [ ] Update procedures documented
- [ ] Contact information current

## Cost Management

### Cost Monitoring
- [ ] Azure Cost Management configured
- [ ] Budget alerts set up
- [ ] Resource tagging implemented
- [ ] Regular cost reviews scheduled

### Cost Optimization
- [ ] Right-sized resources for workload
- [ ] Unused resources identified and removed
- [ ] Reserved instances considered (if applicable)
- [ ] Auto-scaling configured appropriately

## Maintenance

### Regular Tasks
- [ ] Security updates scheduled
- [ ] Dependency updates planned
- [ ] Performance monitoring active
- [ ] Log review procedures in place

### Update Procedures
- [ ] Staging environment available
- [ ] Deployment rollback plan
- [ ] Change management process
- [ ] Testing procedures defined

## Sign-off

### Technical Sign-off
- [ ] Development team approval
- [ ] QA team approval
- [ ] Security team approval (if applicable)
- [ ] Operations team approval

### Business Sign-off
- [ ] Product owner approval
- [ ] Stakeholder approval
- [ ] Go-live authorization
- [ ] Communication plan executed

---

## Deployment Completion

**Deployment Date:** _______________

**Deployed By:** _______________

**Deployment Method:** 
- [ ] Azure Static Web Apps
- [ ] Azure App Service
- [ ] Azure Container Instances

**Production URL:** _______________

**Notes:** 
_________________________________
_________________________________
_________________________________

**Next Review Date:** _______________