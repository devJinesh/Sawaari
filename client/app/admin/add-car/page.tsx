"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"

export default function AddCarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    fuelType: "Petrol",
    capacity: "5",
    rentPerHour: "",
  })

  useEffect(() => {
    if (!isAuthenticated() || !getUser()?.admin) {
      router.push("/")
    }
  }, [router])

  if (!isAuthenticated() || !getUser()?.admin) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await ApiClient.post("/api/cars/addcar", {
        ...formData,
        capacity: Number.parseInt(formData.capacity),
        rentPerHour: Number.parseFloat(formData.rentPerHour),
      })

      if (response.success) {
        router.push("/admin")
      } else {
        setError(response.error || "Failed to add car")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[600px] mx-auto px-5 sm:px-7 lg:px-9 pt-8">
          <button
            onClick={() => router.back()}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors duration-100 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Admin</p>
            <h1 className="text-2xl font-bold tracking-tight">Add car</h1>
          </div>

          {error && (
            <div className="py-2.5 px-3 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Car name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="e.g., Toyota Camry 2024"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="https://example.com/car-image.jpg"
              />
              {formData.image && (
                <div className="mt-3 border border-border p-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview</p>
                  <div className="aspect-video w-full bg-muted overflow-hidden">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = "/placeholder.svg")} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Fuel type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100"
                >
                  <option>Petrol</option>
                  <option>Diesel</option>
                  <option>Electric</option>
                  <option>Hybrid</option>
                  <option>CNG</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Seats</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Rate per hour (₹)</label>
              <input
                type="number"
                name="rentPerHour"
                value={formData.rentPerHour}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="w-full px-3 py-2.5 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100 placeholder:text-muted-foreground/50"
                placeholder="e.g., 500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Adding..." : "Add car"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 text-sm font-medium text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-colors duration-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
