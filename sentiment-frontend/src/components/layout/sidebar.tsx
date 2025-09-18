"use client"

import { Home, LineChart, TrendingUp, Settings, Users, Database, Key, BarChart3 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type SidebarProps = {
  items: Array<{
    href: string
    title: string
    icon: React.ElementType
  }>
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className, items, isOpen, setIsOpen, ...props }: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-4",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
          onClick={() => setIsOpen(false)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="pr-0">
          <div className="flex flex-col h-full">
            <div className="p-4 pb-2">
              <Link href="/" className="text-2xl font-bold" onClick={() => setIsOpen(false)}>
                SentimentApp
              </Link>
            </div>
            <div className="flex-1 overflow-auto">
              {sidebarContent}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export const sidebarNavItems = [
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
];