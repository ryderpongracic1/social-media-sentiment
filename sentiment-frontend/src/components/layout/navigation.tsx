"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

interface NavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string
    title: string
  }[]
}

export function Navigation({ className, items, ...props }: NavigationProps) {
  const pathname = usePathname()

  return (
    <motion.nav
      className={cn("flex space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items.map((item) => (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        </motion.div>
      ))}
    </motion.nav>
  )
}