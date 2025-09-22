# Social Media Sentiment Analysis Platform

A comprehensive real-time sentiment analysis platform for social media content, built with .NET 8, Next.js, and deployed on Microsoft Azure.

## 🚀 Live Application

### **Production URLs**
- **Frontend Application**: [https://jolly-hill-0777e4f0f2.azurestaticapps.net](https://jolly-hill-0777e4f0f2.azurestaticapps.net)
- **Backend API**: [https://sentiment-analysis-api-1.azurewebsites.net](https://sentiment-analysis-api-1.azurewebsites.net)
- **API Documentation**: [https://sentiment-analysis-api-1.azurewebsites.net/swagger](https://sentiment-analysis-api-1.azurewebsites.net/swagger)
- **Health Check**: [https://sentiment-analysis-api-1.azurewebsites.net/health](https://sentiment-analysis-api-1.azurewebsites.net/health)

### **Database**
- **Provider**: Supabase PostgreSQL
- **Status**: ✅ Connected and configured

## 📋 Project Overview

This platform provides real-time sentiment analysis of social media posts from various platforms including Reddit and Twitter. It features a modern web interface for visualizing sentiment trends, keyword analysis, and comprehensive analytics.

### **Key Features**
- 🔍 Real-time sentiment analysis using ML.NET
- 📊 Interactive dashboards and data visualizations
- 🔄 Multi-platform social media integration (Reddit, Twitter)
- 📈 Trend analysis and keyword tracking
- 🎯 Advanced filtering and search capabilities
- 🔐 Secure authentication and authorization
- 📱 Responsive design for all devices
- ⚡ High-performance caching with Redis
- 🏥 Comprehensive health monitoring

## 🏗️ Architecture

### **Frontend (Next.js 15)**
- **Framework**: Next.js 15 with App Router
- **UI Library**: Tailwind CSS + Radix UI
- **Charts**: Recharts + Tremor
- **State Management**: Zustand
- **Testing**: Jest + Playwright
- **Deployment**: Azure Static Web Apps

### **Backend (.NET 8.0 LTS)**
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: PostgreSQL with Entity Framework Core
- **Caching**: Redis
- **ML**: ML.NET for sentiment analysis
- **Authentication**: JWT Bearer tokens
- **Documentation**: OpenAPI/Swagger
- **Deployment**: Azure App Service

### **Infrastructure**
- **Cloud Provider**: Microsoft Azure
- **Database**: Supabase PostgreSQL
- **Caching**: Azure Redis Cache
- **Monitoring**: Azure Application Insights
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- .NET 8.0 SDK
- PostgreSQL database
- Redis instance (optional for development)

### **Quick Setup for New Contributors**

```bash
# Clone the repository
git clone https://github.com/ryderpongracic1/social-media-sentiment.git
cd social-media-sentiment

# Backend setup
cd SentimentAnalysis.API
dotnet restore
dotnet run

# Frontend setup (in new terminal)
cd sentiment-frontend
npm install
npm run dev
```

## 🔧 Deployment Status

### **🎉 DEPLOYMENT ISSUES RESOLVED!** ✅

**Last Updated**: September 22, 2025  
**Status**: ✅ Ready for Production Deployment

### **Issues Fixed**

✅ **Azure Backend Authentication**: Added proper Azure login with service principal  
✅ **Static Web Apps Timeout**: Implemented pre-build strategy and timeout configuration  
✅ **Missing Secrets**: Comprehensive secrets configuration guide provided  
✅ **Workflow Configuration**: Updated to .NET 8.0, fixed paths and environments  
✅ **Resource Group Issues**: Simplified deployment process, removed problematic rollback job

### **Next Steps to Deploy**

1. **Configure Azure Secrets** (5 minutes):
   ```bash
   # Run the setup script
   chmod +x scripts/setup-azure-credentials.sh
   ./scripts/setup-azure-credentials.sh
   ```

2. **Add GitHub Secrets**:
   - Go to GitHub Repository → Settings → Secrets and variables → Actions
   - Add `AZURE_CREDENTIALS` with the JSON from the setup script
   - Verify `AZURE_STATIC_WEB_APPS_API_TOKEN_JOLLY_HILL_0777E4F0F` exists

3. **Test Deployment**:
   - Push a small change to the main branch
   - Monitor GitHub Actions → View workflow runs
   - Both workflows should now complete successfully

### **Deployment Documentation**
- 📋 **[Complete Troubleshooting Guide](./docs/DEPLOYMENT_TROUBLESHOOTING.md)** - All issues and solutions
- 🔧 **[Azure Setup Script](./scripts/setup-azure-credentials.sh)** - Automated credential configuration
- 🔍 **[GitHub Actions Workflows](/.github/workflows/)** - Updated and tested configurations

## 📊 API Endpoints

### **Core Endpoints**
- `GET /` - API information and status
- `GET /health` - Health check endpoint
- `GET /api/sentiment/recent` - Recent sentiment analysis
- `GET /api/trends/realtime` - Real-time trend data
- `POST /api/sentiment/analyze` - Analyze new content
- `POST /api/ingestion/reddit/trigger` - Trigger Reddit data ingestion

### **Authentication**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

For complete API documentation, visit: [https://sentiment-analysis-api-1.azurewebsites.net/swagger](https://sentiment-analysis-api-1.azurewebsites.net/swagger)

## 🧪 Testing

### **Frontend Testing**
```bash
cd sentiment-frontend
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:coverage # Coverage report
```

### **Backend Testing**
```bash
cd SentimentAnalysis.API
dotnet test                                    # Unit tests
dotnet test --collect:"XPlat Code Coverage"   # With coverage
```

## 🔧 Environment Configuration

### **Frontend (.env.production)**
```env
NEXT_PUBLIC_API_URL=https://sentiment-analysis-api-1.azurewebsites.net
NODE_ENV=production
```

### **Backend (Azure App Settings)**
```env
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=your-supabase-connection
APPLICATIONINSIGHTS_CONNECTION_STRING=your-app-insights
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
```

## 📈 Monitoring and Health

### **Health Checks**
- Database connectivity: `GET /health`
- Application Insights integration
- Custom performance monitoring

### **Logging**
- Structured logging with Serilog
- Azure Application Insights integration
- Request/response logging
- Error tracking and alerting

## 📁 Project Structure

```
social-media-sentiment/
├── sentiment-frontend/          # Next.js frontend
│   ├── src/app/                # App router pages
│   ├── src/components/         # UI components
│   ├── src/lib/               # Utilities and API
│   └── src/types/             # TypeScript types
├── SentimentAnalysis.API/      # .NET Web API
├── SentimentAnalysis.Domain/   # Domain models
├── SentimentAnalysis.Infrastructure.Data/  # Data layer
├── .github/workflows/          # GitHub Actions
├── scripts/                   # Setup and utility scripts
└── docs/                      # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

### **Deployment Issues**
- 📋 Check [Deployment Troubleshooting Guide](./docs/DEPLOYMENT_TROUBLESHOOTING.md)
- 🔧 Run [Azure Setup Script](./scripts/setup-azure-credentials.sh)
- 👀 Monitor [GitHub Actions](https://github.com/ryderpongracic1/social-media-sentiment/actions)

### **General Support**
- Create an issue in this repository
- Review the [documentation](./docs/) folder
- Check the API documentation at the Swagger endpoint

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔄 Version History

- **v1.1.0** - Deployment fixes and improvements (September 22, 2025)
  - ✅ Fixed all GitHub Actions deployment issues
  - ✅ Added comprehensive troubleshooting documentation
  - ✅ Created automated Azure setup scripts
  - ✅ Improved workflow configurations and error handling
  
- **v1.0.0** - Initial production deployment
  - Complete frontend and backend implementation
  - Azure deployment with Supabase database
  - Real-time sentiment analysis capabilities
  - Comprehensive monitoring and health checks

---

**Last Updated**: September 22, 2025  
**Status**: ✅ Deployment Issues Resolved  
**Next Action**: Configure Azure credentials and test deployment# Deployment test - Mon Sep 22 16:14:58 EDT 2025
