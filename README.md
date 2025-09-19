# Social Media Sentiment Analysis Platform

A comprehensive real-time sentiment analysis platform for social media content, built with .NET 9, Next.js, and deployed on Microsoft Azure.

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

### **Backend (.NET 9)**
- **Framework**: ASP.NET Core 9 Web API
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
- **CI/CD**: GitHub Actions (planned)

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- .NET 9 SDK
- PostgreSQL database
- Redis instance (optional for development)

### **Local Development**

#### **Backend Setup**
```bash
# Navigate to API project
cd SentimentAnalysis.API

# Restore dependencies
dotnet restore

# Update database connection string in appsettings.Development.json
# Run database migrations
dotnet ef database update

# Start the API
dotnet run
```

#### **Frontend Setup**
```bash
# Navigate to frontend project
cd sentiment-frontend

# Install dependencies
npm install

# Create environment file
cp .env.production .env.local

# Update API URL for local development
echo "NEXT_PUBLIC_API_URL=http://localhost:5142/api" > .env.local

# Start development server
npm run dev
```

### **Environment Variables**

#### **Frontend (.env.production)**
```env
NEXT_PUBLIC_API_URL=https://sentiment-analysis-api-1.azurewebsites.net/api
NEXT_PUBLIC_APP_NAME=Social Media Sentiment Analysis
NEXT_PUBLIC_APP_VERSION=1.0.0
AZURE_DEPLOYMENT=true
NODE_ENV=production
```

#### **Backend (Azure App Settings)**
```env
DB_HOST=your-supabase-host
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-password
DB_PORT=5432
APPLICATIONINSIGHTS_CONNECTION_STRING=your-app-insights-connection
REDDIT_CLIENT_ID=your-reddit-client-id
REDDIT_CLIENT_SECRET=your-reddit-client-secret
```

## 📁 Project Structure

```
social-media-sentiment/
├── sentiment-frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/               # Utilities and API clients
│   │   └── types/             # TypeScript type definitions
│   ├── public/                # Static assets
│   └── docs/                  # Frontend documentation
├── SentimentAnalysis.API/      # .NET Web API
│   ├── Controllers/           # API controllers
│   ├── Models/               # Data models
│   └── Services/             # Business logic
├── SentimentAnalysis.Domain/   # Domain entities and enums
├── SentimentAnalysis.Infrastructure.Data/  # Data access layer
└── docs/                      # Project documentation
```

## 🧪 Testing

### **Frontend Testing**
```bash
cd sentiment-frontend

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### **Backend Testing**
```bash
cd SentimentAnalysis.API

# Run unit tests
dotnet test

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

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

## 🔧 Deployment

### **Azure Resources**
- **Resource Group**: `rg-sentiment-analysis`
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure App Service (Linux)
- **Database**: Supabase PostgreSQL
- **Monitoring**: Azure Application Insights

### **Deployment Status**
- ✅ Frontend deployed to Azure Static Web Apps
- ✅ Backend deployed to Azure App Service
- ✅ Database configured with Supabase
- ✅ CORS configured for cross-origin requests
- ✅ Environment variables configured
- ✅ Health checks operational

### **Manual Deployment**

#### **Frontend Deployment**
```bash
cd sentiment-frontend
npm run build
# Deploy to Azure Static Web Apps via Azure portal or CLI
```

#### **Backend Deployment**
```bash
cd SentimentAnalysis.API
dotnet publish -c Release
# Deploy to Azure App Service via Azure portal or CLI
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the [documentation](./docs/) folder
- Review the API documentation at the Swagger endpoint

## 🔄 Version History

- **v1.0.0** - Initial production deployment
  - Complete frontend and backend implementation
  - Azure deployment with Supabase database
  - Real-time sentiment analysis capabilities
  - Comprehensive monitoring and health checks

---

**Last Updated**: September 2025  
**Status**: ✅ Production Ready  
**Deployment**: ✅ Live on Azure