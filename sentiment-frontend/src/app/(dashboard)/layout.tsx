import { Footer } from "@/components/layout/footer"

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
      <Footer />
    </div>
  )
}