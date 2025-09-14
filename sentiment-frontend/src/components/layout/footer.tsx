import * as React from "react"

import { cn } from "@/lib/utils"

export function Footer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <footer className={cn("border-t py-4 text-center text-sm", className)} {...props}>
      <p>&copy; {new Date().getFullYear()} SentimentApp. All rights reserved.</p>
    </footer>
  )
}