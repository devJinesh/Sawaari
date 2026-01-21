"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ServicesSection } from "@/components/sections/services-section"
import { ReviewsSection } from "@/components/sections/reviews-section"
import { ApiClient } from "@/lib/api"
import { DateTimePicker } from "@/components/ui/datetime-picker"
import Link from "next/link"
import moment from "moment"

interface Car {
  _id: string
  name: string
  image: string
  fuelType: string
  capacity: number
  rentPerHour: number
  bookedTimeSlots?: Array<{ from: string; to: string }>
}

export default function Home() {
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStartDateTime, setFilterStartDateTime] = useState<Date | null>(null)
  const [filterEndDateTime, setFilterEndDateTime] = useState<Date | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [showCarsSection, setShowCarsSection] = useState(false)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
        if (response.success) {
          const carsList = response.cars || []
          setCars(carsList)
          setFilteredCars(carsList)
        } else {
          setError(response.error || "Failed to load cars")
        }
      } catch (err) {
        setError("Failed to load cars. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCars()

    const handleShowCars = () => {
      setShowCarsSection(true)
      setTimeout(() => {
        const carsSection = document.getElementById('cars')
        if (carsSection) {
          const headerHeight = 72
          const elementPosition = carsSection.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }, 100)
    }

    window.addEventListener('showCarsSection', handleShowCars)

    if (window.location.hash === '#cars') {
      handleShowCars()
    }

    return () => {
      window.removeEventListener('showCarsSection', handleShowCars)
    }
  }, [])

  const handleFilter = () => {
    if (!filterStartDateTime || !filterEndDateTime) {
      setFilteredCars(cars)
      return
    }

    const selectedFrom = moment(filterStartDateTime)
    const selectedTo = moment(filterEndDateTime)

    if (selectedTo.isSameOrBefore(selectedFrom)) {
      setError("End date/time must be after start date/time")
      return
    }

    const available = cars.filter((car) => {
      let isAvailable = true

      if (car.bookedTimeSlots && car.bookedTimeSlots.length > 0) {
        for (const booking of car.bookedTimeSlots) {
          const bookingFrom = moment(booking.from, "DD/MM/YYYY HH:mm")
          const bookingTo = moment(booking.to, "DD/MM/YYYY HH:mm")

          const hasOverlap =
            selectedFrom.isBetween(bookingFrom, bookingTo, undefined, "[]") ||
            selectedTo.isBetween(bookingFrom, bookingTo, undefined, "[]") ||
            bookingFrom.isBetween(selectedFrom, selectedTo, undefined, "[]") ||
            bookingTo.isBetween(selectedFrom, selectedTo, undefined, "[]")

          if (hasOverlap) {
            isAvailable = false
            break
          }
        }
      }

      return isAvailable
    })

    setFilteredCars(available)
    setShowFilter(false)
  }

  const clearFilter = () => {
    setFilterStartDateTime(null)
    setFilterEndDateTime(null)
    setFilteredCars(cars)
    setError(null)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px]">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9 pt-10">
          <HeroSection />
          
          {!showCarsSection && (
            <div className="mt-14 mb-10">
              <button
                onClick={() => setShowCarsSection(true)}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-100 flex items-center gap-2"
              >
                View available cars
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {showCarsSection && (
          <div id="cars" className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9 pb-16 animate-fade-in-down">
          <div className="mb-10 pt-6 border-t border-border">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Inventory</p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Available cars</h2>
              </div>
              <button
                onClick={() => setShowFilter(!showFilter)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-100 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
            </div>

            {showFilter && (
              <div className="border border-border p-5 mb-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                  <DateTimePicker
                    date={filterStartDateTime || undefined}
                    setDate={(date) => setFilterStartDateTime(date || null)}
                    label="Start"
                    minDate={new Date()}
                  />
                  <DateTimePicker
                    date={filterEndDateTime || undefined}
                    setDate={(date) => setFilterEndDateTime(date || null)}
                    label="End"
                    minDate={filterStartDateTime || new Date()}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilter}
                      className="flex-1 bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors duration-100"
                    >
                      Apply
                    </button>
                    <button
                      onClick={clearFilter}
                      className="px-4 py-2.5 text-sm font-medium text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-colors duration-100"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="py-3 px-4 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-surface h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-16 border border-border">
                <p className="text-muted-foreground mb-1">No cars available</p>
                <p className="text-sm text-muted-foreground/70">
                  {filterStartDateTime || filterEndDateTime
                    ? "Try different dates"
                    : "Check back later"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCars.map((car) => (
                  <Link key={car._id} href={`/booking/${car._id}`}>
                    <div className="group bg-surface border border-border hover:border-primary/30 transition-colors duration-100 cursor-pointer h-full">
                      <div className="relative h-48 bg-muted overflow-hidden">
                        <img
                          src={car.image || "/luxury-car-sleek-design.png"}
                          alt={car.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-base font-semibold text-foreground">{car.name}</h3>
                          <span className="text-sm font-medium text-primary">₹{car.rentPerHour}/hr</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">{car.fuelType} · {car.capacity} seats</p>
                        <button className="w-full py-2.5 text-sm font-medium text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-100">
                          Book
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        <ServicesSection />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  )
}
