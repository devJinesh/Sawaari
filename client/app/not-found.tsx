import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-6xl font-bold text-foreground mb-2">404</p>
          <p className="text-muted-foreground mb-8">Page not found</p>
          <Link
            href="/"
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100"
          >
            Go home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
