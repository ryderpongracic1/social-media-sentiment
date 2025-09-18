# Deployment Guide

This guide covers multiple deployment options for the Social Media Sentiment Analysis frontend application.

## 🚀 Quick Deploy Options

### 1. Vercel (Recommended for Next.js)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ryderpongracic1/social-media-sentiment&project-name=sentiment-frontend&repository-name=social-media-sentiment)

**Steps:**
1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import the project and select the `sentiment-frontend` directory
4. Configure environment variables (see below)
5. Deploy!

**Environment Variables for Vercel:**
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
NEXT_PUBLIC_APP_ENV=production
```

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/ryderpongracic1/social-media-sentiment)

**Steps:**
1. Fork this repository
2. Connect your GitHub account to Netlify
3. Set build directory to `sentiment-frontend`
4. Configure environment variables
5. Deploy!

**Build Settings:**
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: `18`

### 3. Docker Deployment

**Prerequisites:**
- Docker and Docker Compose installed
- Environment variables configured

**Quick Start:**
```bash
# Clone the repository
git clone https://github.com/ryderpongracic1/social-media-sentiment.git
cd social-media-sentiment/sentiment-frontend

# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Build and run with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t sentiment-frontend .
docker run -p 3000:3000 --env-file .env.local sentiment-frontend
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env.local` file (for local development) or configure in your deployment platform:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com

# Application Environment
NEXT_PUBLIC_APP_ENV=production

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_REAL_TIME=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

### Platform-Specific Configuration

#### Vercel
- Set environment variables in the Vercel dashboard
- Use the provided `vercel.json` for optimal configuration
- Automatic deployments on git push

#### Netlify
- Configure in Netlify dashboard or `netlify.toml`
- Supports edge functions and redirects
- Automatic deployments on git push

#### Docker
- Use `.env.local` file or Docker environment variables
- Supports horizontal scaling with load balancers
- Production-ready with multi-stage builds

## 🏗️ Build Process

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Build Optimization
The application includes several optimizations:
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: WebP/AVIF format support
- **Bundle Analysis**: Optimized vendor chunks
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip/Brotli compression

## 🔒 Security Configuration

### Security Headers
All deployment configurations include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Content Security Policy
Configure CSP headers for additional security:
```javascript
// In next.config.ts
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]
```

## 📊 Performance Monitoring

### Built-in Monitoring
- **Performance Monitor**: Real-time performance tracking
- **Error Boundary**: Graceful error handling
- **Lighthouse Integration**: Automated performance audits

### External Monitoring (Optional)
- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior analytics
- **Vercel Analytics**: Built-in analytics for Vercel deployments

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and reinstall dependencies
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
- Ensure all `NEXT_PUBLIC_` prefixed variables are set
- Check for typos in variable names
- Verify API endpoints are accessible

#### Docker Issues
```bash
# Check container logs
docker logs sentiment-frontend

# Rebuild without cache
docker build --no-cache -t sentiment-frontend .

# Check container health
docker exec -it sentiment-frontend curl http://localhost:3000/api/health
```

#### Performance Issues
- Enable production optimizations in `next.config.ts`
- Use CDN for static assets
- Implement proper caching strategies
- Monitor bundle size with `npm run analyze`

### Health Checks

#### Application Health
```bash
# Check if application is running
curl http://localhost:3000/api/health

# Check build output
npm run build 2>&1 | grep -i error
```

#### Docker Health
```bash
# Check container status
docker ps | grep sentiment-frontend

# Check resource usage
docker stats sentiment-frontend
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['sentiment-frontend/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: sentiment-frontend/package-lock.json
      
      - name: Install dependencies
        run: npm ci
        working-directory: sentiment-frontend
      
      - name: Run tests
        run: npm test
        working-directory: sentiment-frontend
      
      - name: Build application
        run: npm run build
        working-directory: sentiment-frontend
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
          NEXT_PUBLIC_WS_URL: ${{ secrets.WS_URL }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: sentiment-frontend
```

## 📈 Scaling Considerations

### Horizontal Scaling
- Use load balancers (Nginx, HAProxy)
- Container orchestration (Kubernetes, Docker Swarm)
- CDN for static assets (Cloudflare, AWS CloudFront)

### Performance Optimization
- Enable ISR (Incremental Static Regeneration)
- Implement proper caching strategies
- Use edge computing for global distribution
- Monitor and optimize Core Web Vitals

## 🆘 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review application logs
3. Verify environment configuration
4. Test API connectivity
5. Check platform-specific documentation

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Docker Documentation](https://docs.docker.com/)