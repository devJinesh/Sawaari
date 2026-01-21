"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import Link from "next/link"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
}

export default function ServicesPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCars, setShowCars] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
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
  }, [])

  const services = [
    {
      name: "Airport transfer",
      description: "IGI Airport pickup & drop",
      note: "Meet at arrivals, min 4 hrs",
    },
    {
      name: "Day trips",
      description: "Agra, Jaipur, Mathura & more",
      note: "250 km included",
    },
    {
      name: "Outstation",
      description: "Weekend getaways, hill stations",
      note: "300 km/day limit",
    },
    {
      name: "Corporate",
      description: "Monthly billing, dedicated fleet",
      note: "For businesses",
    },
    {
      name: "Events",
      description: "Weddings, functions, parties",
      note: "Decorated cars available",
    },
  ]

  const handleBookService = () => {
    setShowCars(true)
    setTimeout(() => {
      document.getElementById("available-cars")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-7 lg:px-9 pt-12">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Services</p>
            <h1 className="text-2xl font-bold tracking-tight mb-3">What we offer</h1>
            <p className="text-muted-foreground">Car rental services for every need.</p>
          </div>

          {error && <div className="p-3 border border-red-600/30 text-red-400 text-sm mb-8">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-foreground/[0.02] border-l-2 border-border hover:border-primary p-5 transition-colors duration-150"
              >
                <span className="text-xs text-muted-foreground/40 font-mono mb-2 block">0{index + 1}</span>
                <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors duration-150">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                <p className="text-xs text-primary/70 mb-4">{service.note}</p>
                <button
                  onClick={handleBookService}
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
                >
                  Book →
                </button>
              </div>
            ))}
          </div>

          {showCars && (
            <div id="available-cars">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Fleet</p>
              <h2 className="text-xl font-bold mb-6">Available cars</h2>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border border-border h-64 animate-pulse bg-muted/20" />
                  ))}
                </div>
              ) : cars.length === 0 ? (
                <p className="text-muted-foreground text-sm">No cars available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cars.map((car) => (
                    <Link key={car._id} href={`/booking/${car._id}`}>
                      <div className="group border border-border hover:border-primary/50 transition-colors duration-150 cursor-pointer h-full overflow-hidden">
                        <div className="h-40 bg-muted overflow-hidden">
                          <img
                            src={car.image || "/placeholder.svg"}
                            alt={car.name}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 bg-foreground/[0.02]">
                          <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors duration-150">{car.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{car.fuelType} · {car.capacity} seats</p>
                          <div className="flex items-baseline justify-between">
                            <p className="text-sm font-medium">₹{car.rentPerHour}/hr</p>
                            <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">Book →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
