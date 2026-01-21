"use client"

import { useRouter, usePathname } from "next/navigation"
import { GeistMono } from "geist/font/mono"
import Image from "next/image"

export function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBrowseCars = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pathname === "/") {
      const event = new CustomEvent('showCarsSection')
      window.dispatchEvent(event)
    } else {
      router.push("/#cars")
    }
  }

  return (
    <footer className="bg-header text-foreground mt-auto border-t border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Image 
                src="/logo.svg" 
                alt="Sawaari" 
                width={28} 
                height={28}
                className="object-contain"
              />
              <h3 className={`${GeistMono.className} font-medium text-lg tracking-tight`}>Sawaari</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">Car rental for your journey. Simple booking, fair prices.</p>
          </div>
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Navigate</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/#cars" onClick={handleBrowseCars} className="text-sm text-foreground/80 hover:text-primary transition-colors duration-100 cursor-pointer">Cars</a>
              </li>
              <li>
                <a href="/about" className="text-sm text-foreground/80 hover:text-primary transition-colors duration-100">About</a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Help</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="/contact" className="text-sm text-foreground/80 hover:text-primary transition-colors duration-100">Contact</a>
              </li>
              <li>
                <a href="/faq" className="text-sm text-foreground/80 hover:text-primary transition-colors duration-100">FAQ</a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wide text-muted-foreground mb-4">Reach us</h4>
            <div className="text-sm text-foreground/80 space-y-1.5">
              <p>hello@sawaari.in</p>
              <p>+91 98765 43210</p>
              <p className="pt-2 text-muted-foreground">A-12, Connaught Place<br/>New Delhi 110001</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">© 2026 Sawaari. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">
            Built by <a href="https://jinkz.me" target="_blank" rel="noopener noreferrer" className="text-foreground/70 hover:text-primary transition-colors duration-100">Jinkz</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
