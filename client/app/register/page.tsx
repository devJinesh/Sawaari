"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ApiClient } from "@/lib/api"
import { isAuthenticated } from "@/lib/auth"
import { Header } from "@/components/layout/header"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/")
    } else {
      setChecking(false)
    }
  }, [router])
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (formData.username.length < 3 || formData.username.length > 50) {
      setError("Username must be between 3 and 50 characters")
      setLoading(false)
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      setError("Username can only contain letters, numbers, and underscores")
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number")
      setLoading(false)
      return
    }

    if (formData.phone && !/^[0-9]{10,15}$/.test(formData.phone)) {
      setError("Phone number must be 10-15 digits")
      setLoading(false)
      return
    }

    try {
      const response = await ApiClient.post("/api/users/register", formData, false)

      if (response.success) {
        router.push("/login?registered=true")
      } else {
        const errorMsg = response.error || response.errors?.[0]?.msg || "Registration failed"
        setError(errorMsg)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[380px] mx-auto px-5 pt-12">
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight mb-1">Create account</h1>
            <p className="text-sm text-muted-foreground">Start booking with Sawaari</p>
          </div>

          {error && (
            <div className="py-2.5 px-3 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
                pattern="[a-zA-Z0-9_]+"
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="john_doe"
              />
              <p className="text-xs text-muted-foreground/70 mt-1">Letters, numbers, underscores</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="••••••••"
              />
              <p className="text-xs text-muted-foreground/70 mt-1">8+ chars, uppercase, lowercase, number</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Phone <span className="text-muted-foreground/50">(optional)</span></label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10,15}"
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="9876543210"
              />
            </div>

              <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            Have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
