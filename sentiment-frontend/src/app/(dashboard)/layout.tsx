import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { Footer } from "@/components/layout/footer"
import { Home, LineChart, TrendingUp, Settings, Users, Database, Key, BarChart3 } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <Sidebar
            items={[
              {
                href: "/dashboard",
                title: "Dashboard",
                icon: Home,
              },
              {
                href: "/sentiment",
                title: "Sentiment Analysis",
                icon: LineChart,
              },
              {
                href: "/trends",
                title: "Trend Analysis",
                icon: TrendingUp,
              },
              {
                href: "/data-sources",
                title: "Data Sources",
                icon: Database,
              },
              {
                href: "/users",
                title: "User Management",
                icon: Users,
              },
              {
                href: "/settings",
                title: "System Settings",
                icon: Settings,
              },
              {
                href: "/api-keys",
                title: "API Keys",
                icon: Key,
              },
              {
                href: "/reports",
                title: "Analytics Reports",
                icon: BarChart3,
              },
            ]}
          />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}