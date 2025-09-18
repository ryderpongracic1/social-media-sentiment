# Social Media Sentiment Analysis Platform - Frontend

A modern, enterprise-grade Next.js 14 frontend for real-time social media sentiment analysis with advanced data visualization and analytics.

## 🚀 Features

### Core Technologies
- **Next.js 14** with App Router and Server Components
- **TypeScript 5.3** with strict type checking
- **Tailwind CSS 3.4** with custom design system
- **Zustand** for state management
- **TanStack Query v5** for data fetching and caching

### UI/UX Features
- **Framer Motion** for smooth animations and micro-interactions
- **Radix UI** for accessible components
- **Recharts & Tremor** for advanced data visualization
- **Dark/Light mode** with system preference detection
- **Responsive design** for all device sizes
- **Progressive Web App (PWA)** capabilities

### Performance & Quality
- **Code splitting** and lazy loading for optimal performance
- **Service Worker** for offline functionality and caching
- **Performance monitoring** with Core Web Vitals tracking
- **Comprehensive testing** (Unit, Integration, E2E)
- **Accessibility compliance** (WCAG 2.1 AA)
- **Enterprise-grade tooling** (ESLint, Prettier, Jest, Playwright)

## 📁 Project Structure

```
sentiment-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   ├── analytics/
│   │   │   ├── sentiment/
│   │   │   ├── trends/
│   │   │   └── posts/
│   │   ├── (admin)/                  # Admin routes
│   │   │   ├── users/
│   │   │   ├── settings/
│   │   │   └── system/
│   │   ├── api/                      # API routes
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # Reusable components
│   │   ├── ui/                       # Base UI components
│   │   ├── charts/                   # Chart components
│   │   ├── layout/                   # Layout components
│   │   └── features/                 # Feature-specific components
│   ├── hooks/                        # Custom React hooks
│   ├── lib/                          # Utility functions
│   ├── providers/                    # React context providers
│   ├── store/                        # Zustand stores
│   ├── styles/                       # Global styles
│   └── types/                        # TypeScript type definitions
├── tests/                            # Test files
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── docs/                            # Documentation
├── public/                          # Static assets
├── jest.config.js                   # Jest configuration
├── jest.setup.js                    # Jest setup
├── .prettierrc                      # Prettier configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
└── eslint.config.mjs                # ESLint configuration
```

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sentiment-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm run test         # Run unit tests with Jest
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run end-to-end tests with Playwright
npm run test:e2e:ui  # Run E2E tests with UI mode

# Code Quality
npm run lint         # Run ESLint
npm run audit        # Run Lighthouse performance audit

# Performance
npm run analyze      # Analyze bundle size
```

## 🏗️ Architecture

### State Management

The application uses **Zustand** for state management with the following stores:

- **Auth Store**: User authentication and session management
- **Posts Store**: Social media posts data and filtering
- **Analytics Store**: Dashboard statistics and trends
- **UI Store**: Global UI state (theme, notifications, etc.)

### Data Fetching

**TanStack Query v5** handles all data fetching with:

- Automatic caching and background updates
- Optimistic updates
- Request deduplication
- Error handling and retries
- Real-time updates via WebSockets

### Component Architecture

- **UI Components**: Reusable, accessible components built with Radix UI
- **Feature Components**: Business logic components
- **Layout Components**: Page layout and navigation
- **Chart Components**: Data visualization components

### Routing

Uses Next.js 14 App Router with:

- **Route Groups**: Organized routes by feature (`(auth)`, `(dashboard)`, `(admin)`)
- **Dynamic Routes**: Parameterized routes for entities
- **Loading States**: Automatic loading UI
- **Error Boundaries**: Graceful error handling

## 🎨 Design System

### Colors

The design system includes custom sentiment colors:

```css
--sentiment-positive: #10b981;
--sentiment-neutral: #6b7280;
--sentiment-negative: #ef4444;
```

### Typography

- **Font Family**: Inter (system font stack)
- **Scale**: Fluid typography with responsive sizing
- **Weights**: 400, 500, 600, 700

### Components

All components follow the shadcn/ui design system with:

- Consistent spacing and sizing
- Accessible keyboard navigation
- Dark mode support
- Responsive design

## 🔧 Configuration

### TypeScript

Strict TypeScript configuration with:

- Strict null checks
- No implicit any
- Exact optional properties
- Path mapping for clean imports

### ESLint

Comprehensive linting rules including:

- TypeScript recommended rules
- React best practices
- Accessibility rules
- Import organization
- Security rules

### Prettier

Code formatting with:

- Tailwind CSS class sorting
- Consistent quotes and semicolons
- 80 character line width
- Trailing commas

### Testing

Comprehensive testing setup with:

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: API and component integration testing
- **E2E Tests**: Playwright for cross-browser testing
- **Performance Tests**: Lighthouse auditing
- **Coverage**: 70% threshold for statements, branches, functions, and lines
- **Accessibility Tests**: Automated a11y testing

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Performance Optimization

The application includes several performance optimizations:

- **Bundle splitting** for vendor, common, and feature-specific chunks
- **Image optimization** with WebP/AVIF formats
- **Service Worker** for caching and offline functionality
- **Lazy loading** for charts and heavy components
- **Tree shaking** to eliminate unused code
- **Compression** enabled for all assets

### Environment Variables

Production environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
```

### PWA Features

The application supports Progressive Web App features:

- **Offline functionality** with service worker caching
- **Install prompt** for mobile and desktop
- **Push notifications** for real-time updates
- **App shortcuts** for quick navigation

### Docker Deployment

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Code Standards

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all CI checks pass

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Radix UI](https://www.radix-ui.com/) - Accessible UI components
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

Built with ❤️ for enterprise-grade sentiment analysis
