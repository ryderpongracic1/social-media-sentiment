"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@/lib/utils"

type NavigationProps = {
  items: Array<{
    href: string
    title: string
  }>
} & React.HTMLAttributes<HTMLDivElement>

export function Navigation({ className, items, ...props }: NavigationProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn("flex space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}