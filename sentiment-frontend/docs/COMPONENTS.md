# Component Documentation

## Overview

This document provides comprehensive documentation for all components in the Social Media Sentiment Analysis frontend application.

## Component Categories

### UI Components (`src/components/ui/`)

#### Core Components

##### Button
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `disabled`: boolean
- `onClick`: () => void

##### Card
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
</Card>
```

##### Form Components
```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

<Form>
  <FormField
    control={control}
    name="fieldName"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Label</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
</Form>
```

#### Enhanced UI Components

##### EmptyState
```tsx
import { EmptyState, NoPostsFound } from "@/components/ui/empty-state";

<EmptyState
  icon="search"
  title="No results found"
  description="Try adjusting your search criteria"
  action={{ label: "Reset", onClick: handleReset }}
/>

// Or use specialized components
<NoPostsFound onReset={handleReset} />
```

##### EnhancedLoading
```tsx
import { EnhancedLoading, ChartLoading, DataTableLoading } from "@/components/ui/enhanced-loading";

<EnhancedLoading type="spinner" size="md" text="Loading..." />
<ChartLoading title="Sales Data" />
<DataTableLoading />
```

##### ErrorBoundary
```tsx
import { ErrorBoundary, ChartErrorBoundary } from "@/components/ui/error-boundary";

<ErrorBoundary onError={handleError}>
  <YourComponent />
</ErrorBoundary>

<ChartErrorBoundary>
  <ChartComponent />
</ChartErrorBoundary>
```

##### Micro-interactions
```tsx
import { 
  AnimatedButton, 
  ToastNotification, 
  FloatingActionButton,
  ProgressIndicator 
} from "@/components/ui/micro-interactions";

<AnimatedButton variant="success" onClick={handleClick}>
  Save Changes
</AnimatedButton>

<ProgressIndicator value={75} label="Upload Progress" />
```

### Chart Components (`src/components/charts/`)

#### SentimentBarChart
```tsx
import { SentimentBarChart } from "@/components/charts/BarChart";

<SentimentBarChart
  data={platformData}
  title="Sentiment by Platform"
  description="Distribution of sentiment across social media platforms"
/>
```

#### GaugeChart
```tsx
import { GaugeChart } from "@/components/charts/GaugeChart";

<GaugeChart
  initialData={{ name: "Sentiment Score", value: 0.75, unit: "score" }}
  title="Overall Sentiment"
  description="Real-time sentiment gauge"
  socketEvent="sentiment-update"
/>
```

#### WordCloudChart
```tsx
import { WordCloudChart } from "@/components/charts/WordCloudChart";

<WordCloudChart
  data={wordData}
  title="Trending Keywords"
  description="Most mentioned words in social media posts"
/>
```

#### RealtimeLineChart
```tsx
import { RealtimeLineChart } from "@/components/charts/RealtimeLineChart";

<RealtimeLineChart
  data={timeSeriesData}
  title="Sentiment Over Time"
  description="Real-time sentiment trends"
/>
```

#### Lazy Loading Charts
```tsx
import { LazyBarChart, ChartWrapper, OptimizedChart } from "@/components/charts/LazyChart";

<OptimizedChart data-testid="sentiment-chart">
  <LazyBarChart data={data} title="Chart Title" description="Description" />
</OptimizedChart>
```

### Layout Components (`src/components/layout/`)

#### Header
```tsx
import { Header } from "@/components/layout/header";

<Header setIsSidebarOpen={setIsSidebarOpen} />
```

#### Sidebar
```tsx
import { Sidebar } from "@/components/layout/sidebar";

<Sidebar
  items={navigationItems}
  isOpen={isOpen}
  setIsOpen={setIsOpen}
/>
```

#### Navigation
```tsx
import { Navigation } from "@/components/layout/navigation";

<Navigation items={navItems} />
```

### Feature Components (`src/components/features/`)

#### Data Filters
```tsx
import { PlatformFilter } from "@/components/features/data-filters/platform-filter";
import { SentimentTypeFilter } from "@/components/features/data-filters/sentiment-type-filter";
import { TimeRangeFilter } from "@/components/features/data-filters/time-range-filter";

<PlatformFilter
  selectedPlatforms={selectedPlatforms}
  onPlatformChange={handlePlatformChange}
/>

<SentimentTypeFilter
  selectedTypes={selectedTypes}
  onTypeChange={handleTypeChange}
/>

<TimeRangeFilter
  selectedRange={selectedRange}
  onRangeChange={handleRangeChange}
/>
```

#### Search
```tsx
import { SearchBar } from "@/components/features/search/search-bar";

<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={handleSearch}
  placeholder="Search posts..."
/>
```

### Accessibility Components (`src/components/accessibility/`)

#### SkipLink
```tsx
import { SkipLink } from "@/components/accessibility/SkipLink";

<SkipLink href="#main-content">Skip to main content</SkipLink>
```

#### AccessibleHeading
```tsx
import { AccessibleHeading } from "@/components/accessibility/SkipLink";

<AccessibleHeading level={1} id="page-title">
  Dashboard
</AccessibleHeading>
```

#### FocusTrap
```tsx
import { FocusTrap } from "@/components/accessibility/SkipLink";

<FocusTrap enabled={isModalOpen}>
  <Modal>
    {/* Modal content */}
  </Modal>
</FocusTrap>
```

### Performance Components (`src/components/performance/`)

#### PerformanceMonitor
```tsx
import { PerformanceMonitor } from "@/components/performance/PerformanceMonitor";

// Add to your app layout
<PerformanceMonitor />
```

## Hooks Documentation

### API Hooks (`src/lib/api/hooks.ts`)

#### Authentication
```tsx
import { useLogin, useLogout, useUserProfile } from "@/lib/api/hooks";

const { mutate: login, isPending } = useLogin();
const { mutate: logout } = useLogout();
const { data: user, isLoading } = useUserProfile();
```

#### Data Fetching
```tsx
import { 
  useRecentSentiments, 
  useSocialMediaPosts, 
  useRealtimeTrends 
} from "@/lib/api/hooks";

const { data: sentiments } = useRecentSentiments();
const { data: posts } = useSocialMediaPosts(page, pageSize, filters);
const { data: trends } = useRealtimeTrends(timeWindow);
```

### Performance Hooks (`src/hooks/usePerformance.ts`)

```tsx
import { 
  useDebounce, 
  useThrottle, 
  useExpensiveCalculation,
  useIntersectionObserver,
  usePerformanceMetrics 
} from "@/hooks/usePerformance";

const debouncedSearch = useDebounce(handleSearch, 300);
const throttledScroll = useThrottle(handleScroll, 100);
const expensiveResult = useExpensiveCalculation(() => heavyCalculation(), [deps]);
const isVisible = useIntersectionObserver(elementRef);
const { measureOperation } = usePerformanceMetrics("ComponentName");
```

## Styling Guidelines

### Tailwind CSS Classes

#### Layout
- `container`: Max-width container with responsive padding
- `grid`: CSS Grid layout
- `flex`: Flexbox layout
- `space-y-*`: Vertical spacing between children
- `gap-*`: Grid/flex gap

#### Colors
- `bg-background`: Main background color
- `text-foreground`: Main text color
- `text-muted-foreground`: Secondary text color
- `bg-primary`: Primary brand color
- `bg-destructive`: Error/danger color

#### Sentiment Colors
- `text-sentiment-positive`: Green for positive sentiment
- `text-sentiment-neutral`: Gray for neutral sentiment
- `text-sentiment-negative`: Red for negative sentiment

### Component Patterns

#### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

#### Dark Mode Support
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Content */}
</div>
```

#### Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## Testing Guidelines

### Unit Testing

```tsx
import { render, screen } from "@testing-library/react";
import { ComponentName } from "./ComponentName";

describe("ComponentName", () => {
  it("renders correctly", () => {
    render(<ComponentName />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

### Integration Testing

```tsx
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useApiHook } from "./hooks";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe("useApiHook", () => {
  it("fetches data correctly", () => {
    const { result } = renderHook(() => useApiHook(), {
      wrapper: createWrapper(),
    });
    
    expect(result.current.isLoading).toBe(true);
  });
});
```

### E2E Testing

```tsx
import { test, expect } from "@playwright/test";

test("user can navigate dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page.locator("h1")).toBeVisible();
  
  await page.click("text=Posts");
  await expect(page).toHaveURL(/.*posts/);
});
```

## Performance Best Practices

1. **Lazy Loading**: Use dynamic imports for heavy components
2. **Memoization**: Use React.memo for expensive components
3. **Debouncing**: Debounce search and filter operations
4. **Virtual Scrolling**: For large data sets
5. **Image Optimization**: Use Next.js Image component
6. **Bundle Analysis**: Regular bundle size monitoring

## Accessibility Guidelines

1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Provide descriptive labels
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **Color Contrast**: Maintain WCAG AA contrast ratios
5. **Screen Readers**: Test with screen reader software
6. **Focus Management**: Proper focus handling in modals and forms

## Contributing

When adding new components:

1. Follow the existing naming conventions
2. Add proper TypeScript types
3. Include accessibility attributes
4. Write comprehensive tests
5. Document props and usage examples
6. Ensure responsive design
7. Add dark mode support