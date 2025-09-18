# Social Media Sentiment Analysis Frontend - Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Social Media Sentiment Analysis frontend application to various platforms, with detailed domain configuration for both local development and production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Development Setup](#local-development-setup)
4. [Production Deployment](#production-deployment)
5. [Domain Configuration](#domain-configuration)
6. [Platform-Specific Guides](#platform-specific-guides)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Access to your C# .NET backend API
- Git repository access

## Environment Configuration

### Understanding Environment Variables

The application uses the following key environment variables:

| Variable | Description | Local Development | Production Example |
|----------|-------------|-------------------|-------------------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | `http://localhost:5142/api` | `https://your-api.herokuapp.com/api` |
| `NEXT_PUBLIC_WS_URL` | WebSocket endpoint | `ws://localhost:5142` | `wss://your-api.herokuapp.com` |
| `NEXT_PUBLIC_APP_ENV` | Application environment | `development` | `production` |

### Setting Up Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update the variables in `.env.local`:**
   ```env
   # For local development
   NEXT_PUBLIC_API_URL=http://localhost:5142/api
   NEXT_PUBLIC_WS_URL=ws://localhost:5142
   NEXT_PUBLIC_APP_ENV=development
   ```

## Local Development Setup

### 1. Backend Configuration

Your C# .NET backend should be configured to run on:
- **HTTP**: `http://localhost:5142`
- **HTTPS**: `https://localhost:7018`

Verify your backend `launchSettings.json` contains:
```json
{
  "profiles": {
    "https": {
      "applicationUrl": "https://localhost:7018;http://localhost:5142"
    }
  }
}
```

### 2. Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create local environment file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify connection:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5142/api`
   - Backend Health Check: `http://localhost:5142/health`

## Production Deployment

### Vercel Deployment (Recommended)

#### 1. Prepare Your Backend

First, deploy your C# .NET backend to a cloud provider:

**Popular Options:**
- **Heroku**: `https://your-app.herokuapp.com`
- **Azure App Service**: `https://your-app.azurewebsites.net`
- **AWS Elastic Beanstalk**: `https://your-app.region.elasticbeanstalk.com`
- **Railway**: `https://your-app.railway.app`

#### 2. Configure Environment Variables in Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Set environment variables:**
   ```bash
   # Set your production API URL
   vercel env add NEXT_PUBLIC_API_URL production
   # Enter: https://your-backend-domain.com/api

   # Set your production WebSocket URL
   vercel env add NEXT_PUBLIC_WS_URL production
   # Enter: wss://your-backend-domain.com

   # Set environment
   vercel env add NEXT_PUBLIC_APP_ENV production
   # Enter: production
   ```

4. **Deploy:**
   ```bash
   vercel --prod
   ```

#### 3. Alternative: Vercel Dashboard Configuration

1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-domain.com/api` | Production |
| `NEXT_PUBLIC_WS_URL` | `wss://your-backend-domain.com` | Production |
| `NEXT_PUBLIC_APP_ENV` | `production` | Production |

## Domain Configuration

### Determining Your Backend Domain

#### If you haven't deployed your backend yet:

1. **Choose a platform** (Heroku, Azure, AWS, Railway)
2. **Deploy your C# .NET backend**
3. **Note the provided domain**

#### Common Backend Domain Patterns:

- **Heroku**: `https://your-app-name.herokuapp.com`
- **Azure**: `https://your-app-name.azurewebsites.net`
- **Railway**: `https://your-app-name.railway.app`
- **Custom Domain**: `https://api.yourdomain.com`

### Frontend Domain Configuration

#### For Vercel:
- **Automatic**: `https://your-project.vercel.app`
- **Custom Domain**: Configure in Vercel dashboard

#### Environment Variable Examples:

```env
# Example 1: Heroku Backend
NEXT_PUBLIC_API_URL=https://sentiment-api.herokuapp.com/api
NEXT_PUBLIC_WS_URL=wss://sentiment-api.herokuapp.com

# Example 2: Azure Backend
NEXT_PUBLIC_API_URL=https://sentiment-api.azurewebsites.net/api
NEXT_PUBLIC_WS_URL=wss://sentiment-api.azurewebsites.net

# Example 3: Custom Domain
NEXT_PUBLIC_API_URL=https://api.yourcompany.com/api
NEXT_PUBLIC_WS_URL=wss://api.yourcompany.com
```

## Platform-Specific Guides

### Netlify Deployment

1. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NEXT_PUBLIC_WS_URL=wss://your-backend-domain.com
   NEXT_PUBLIC_APP_ENV=production
   ```

### Docker Deployment

1. **Build the image:**
   ```bash
   docker build -t sentiment-frontend .
   ```

2. **Run with environment variables:**
   ```bash
   docker run -p 3000:3000 \
     -e NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api \
     -e NEXT_PUBLIC_WS_URL=wss://your-backend-domain.com \
     -e NEXT_PUBLIC_APP_ENV=production \
     sentiment-frontend
   ```

## Backend CORS Configuration

Ensure your C# .NET backend allows requests from your frontend domain:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",           // Local development
            "https://your-app.vercel.app",     // Production frontend
            "https://your-custom-domain.com"   // Custom domain
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
    });
});
```

## Troubleshooting

### Common Issues

#### 1. API Connection Failed
**Symptoms:** Network errors, 404 responses
**Solutions:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check if backend is running and accessible
- Verify CORS configuration in backend

#### 2. WebSocket Connection Failed
**Symptoms:** Real-time features not working
**Solutions:**
- Verify `NEXT_PUBLIC_WS_URL` is correct
- Ensure WebSocket endpoint is available
- Check for proxy/firewall blocking WebSocket connections

#### 3. Environment Variables Not Loading
**Symptoms:** Using default localhost URLs in production
**Solutions:**
- Ensure variables start with `NEXT_PUBLIC_`
- Verify variables are set in deployment platform
- Check for typos in variable names

#### 4. CORS Errors
**Symptoms:** Browser console shows CORS errors
**Solutions:**
- Add frontend domain to backend CORS policy
- Verify backend CORS middleware is properly configured
- Check if credentials are required

### Debugging Steps

1. **Check environment variables:**
   ```bash
   # In your deployed app console
   console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
   console.log('WS URL:', process.env.NEXT_PUBLIC_WS_URL);
   ```

2. **Test API connectivity:**
   ```bash
   # Test your backend API
   curl https://your-backend-domain.com/api/health
   ```

3. **Verify backend logs:**
   - Check your backend deployment logs
   - Look for CORS or connection errors

## Security Considerations

1. **Environment Variables:**
   - Never commit `.env.local` to version control
   - Use different credentials for development and production
   - Regularly rotate API keys and secrets

2. **CORS Configuration:**
   - Only allow necessary origins
   - Avoid using wildcard (*) in production
   - Enable credentials only when needed

3. **HTTPS:**
   - Always use HTTPS in production
   - Use WSS for WebSocket connections in production
   - Ensure backend supports HTTPS

## Performance Optimization

1. **Caching:**
   - Configure appropriate cache headers
   - Use CDN for static assets
   - Enable compression

2. **Bundle Optimization:**
   - Analyze bundle size with `npm run analyze`
   - Implement code splitting
   - Optimize images and assets

## Support

If you encounter issues:

1. Check the [troubleshooting section](#troubleshooting)
2. Verify your backend is properly deployed and accessible
3. Ensure environment variables are correctly configured
4. Check browser console for error messages
5. Review backend logs for API errors

For additional help, please refer to the project documentation or create an issue in the repository.