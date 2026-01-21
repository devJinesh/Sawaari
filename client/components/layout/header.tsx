"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { getUser, clearUser, isAdmin } from "@/lib/auth"
import { GeistMono } from "geist/font/mono"
import type { User } from "@/lib/auth"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const currentUser = getUser()
    setUser(currentUser)
  }, [])

  const handleLogout = () => {
    clearUser()
    setUser(null)
    setIsOpen(false)
    router.push("/login")
  }

  const handleBrowseCars = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (pathname === "/") {
      const event = new CustomEvent('showCarsSection')
      window.dispatchEvent(event)
    } else {
      router.push("/#cars")
    }
  }

  const isAuthPage = pathname === "/login" || pathname === "/register"

  return (
    <header className="fixed top-0 w-full bg-header border-b border-border/60 z-50">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9">
        <div className="flex justify-between items-center h-[72px]">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9">
              <Image 
                src="/logo.svg" 
                alt="Sawaari" 
                width={36} 
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <span className={`${GeistMono.className} text-foreground text-lg tracking-tight font-medium`}>Sawaari</span>
          </Link>

          <nav className="hidden md:flex gap-7 items-center">
            <a href="/#cars" onClick={handleBrowseCars} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 cursor-pointer">
              Cars
            </a>
            <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
              Services
            </Link>
            {mounted && user && (
              <Link href="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
                Bookings
              </Link>
            )}
            {mounted && isAdmin(user) && (
              <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
                Admin
              </Link>
            )}
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {mounted && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border border-border hover:border-primary/60 transition-colors duration-150"
                >
                  <span>{user.username}</span>
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-surface border border-border overflow-hidden animate-fade-in">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Account</p>
                      <p className="text-sm font-medium text-foreground truncate mt-0.5">{user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors duration-100 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : mounted && !isAuthPage ? (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-150"
                >
                  Sign up
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  )
}
