"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"
import Link from "next/link"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
}

export default function AdminPage() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const user = getUser()
    if (!isAuthenticated() || !user?.admin) {
      router.push("/")
      return
    }

    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars")
        if (response.success) {
          setCars(response.cars || [])
        } else {
          setError(response.error || "Failed to load cars")
        }
      } catch (err) {
        setError("Failed to load cars")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [router])

  const handleDeleteCar = async (carId: string) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return

    try {
      const response = await ApiClient.post("/api/cars/deletecar", { carid: carId })
      if (response.success) {
        setCars(cars.filter((c) => c._id !== carId))
      } else {
        setError(response.error || "Failed to delete car")
      }
    } catch (err) {
      setError("Failed to delete car")
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9 pt-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Admin</p>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
            </div>
            <Link
              href="/admin/add-car"
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add car
            </Link>
          </div>

          {error && (
            <div className="py-2.5 px-3 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-surface h-72 animate-pulse" />
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="text-center py-16 border border-border">
              <p className="text-muted-foreground mb-1">No vehicles</p>
              <p className="text-sm text-muted-foreground/70 mb-6">Add your first car to get started</p>
              <Link
                href="/admin/add-car"
                className="inline-block px-5 py-2.5 text-sm font-medium text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
              >
                Add car
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cars.map((car) => (
                <div key={car._id} className="bg-surface border border-border">
                  <div className="h-44 bg-muted overflow-hidden">
                    <img
                      src={car.image || "/placeholder.svg"}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-base font-semibold text-foreground">{car.name}</h3>
                      <span className="text-sm font-medium text-primary">₹{car.rentPerHour}/hr</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">{car.fuelType} · {car.capacity} seats</p>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/edit-car/${car._id}`}
                        className="flex-1 px-3 py-2 text-sm font-medium text-center text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-colors duration-100"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteCar(car._id)}
                        className="flex-1 px-3 py-2 text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors duration-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
