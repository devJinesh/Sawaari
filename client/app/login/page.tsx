"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ApiClient } from "@/lib/api"
import { setUser, isAuthenticated } from "@/lib/auth"
import { Header } from "@/components/layout/header"

export default function LoginPage() {
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
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const response = await ApiClient.post("/api/users/login", formData, false)

      if (response.success && response.token) {
        setUser({
          ...response.user,
          token: response.token,
        })
        router.push("/")
      } else {
        setError(response.error || "Login failed")
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
            <h1 className="text-2xl font-bold tracking-tight mb-1">Sign in</h1>
            <p className="text-sm text-muted-foreground">Access your Sawaari account</p>
          </div>

          {error && <div className="py-2.5 px-3 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground mt-6">
            No account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
