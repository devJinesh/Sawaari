"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { getUser, isAuthenticated } from "@/lib/auth"
import { LoadingSpinner } from "@/components/ui/loading"
import { DateTimePicker } from "@/components/ui/datetime-picker"
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

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBookedSlots, setShowBookedSlots] = useState(false)
  
  const [startDateTime, setStartDateTime] = useState<Date | null>(null)
  const [endDateTime, setEndDateTime] = useState<Date | null>(null)
  const [driverRequired, setDriverRequired] = useState(false)
  
  const [totalMins, setTotalMins] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchCar = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ cars: Car[] }>("/api/cars/getallcars", false)
        if (response.success) {
          const selectedCar = response.cars?.find((c: Car) => c._id === carId)
          if (selectedCar) {
            setCar(selectedCar)
          } else {
            setError("Car not found")
          }
        }
      } catch (err) {
        setError("Failed to load car details")
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [carId, router])

  useEffect(() => {
    if (startDateTime && endDateTime && car) {
      const start = moment(startDateTime)
      const end = moment(endDateTime)
      const mins = end.diff(start, "minutes")

      if (mins > 0) {
        setTotalMins(mins)
        let amount = (mins * car.rentPerHour) / 60

        if (driverRequired) {
          amount += (mins * 300) / 1440
        }

        amount = Math.round(amount / 5) * 5
        setTotalAmount(amount)
      } else {
        setTotalMins(0)
        setTotalAmount(0)
      }
    }
  }, [startDateTime, endDateTime, driverRequired, car])

  const handlePayment = () => {
    if (!startDateTime || !endDateTime) {
      setError("Please select start and end dates")
      return
    }

    const start = moment(startDateTime)
    const end = moment(endDateTime)

    if (end.isSameOrBefore(start)) {
      setError("End time must be after start time")
      return
    }

    if (totalMins < 60) {
      setError("Minimum booking duration is 1 hour")
      return
    }

    setError(null)
    setSubmitting(true)

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: totalAmount * 100,
      currency: "INR",
      name: "Sawaari",
      description: `Booking for ${car?.name || "Car"}`,
      handler: async function (response: any) {
        try {
          const requestData = {
            car: carId,
            user: getUser()?._id,
            bookedTimeSlots: {
              from: start.format("DD/MM/YYYY HH:mm"),
              to: end.format("DD/MM/YYYY HH:mm"),
            },
            totalMins,
            totalAmount,
            driverRequired: driverRequired,
            razorpay_order_id: response.razorpay_order_id || "order_" + Date.now(),
            razorpay_payment_id: response.razorpay_payment_id || "pay_" + Date.now(),
            razorpay_signature: response.razorpay_signature || "sig_" + Date.now(),
          }

          const bookingResponse = await ApiClient.post("/api/bookings/bookcar", requestData)

          if (bookingResponse.success) {
            router.push("/bookings")
          } else {
            setError(bookingResponse.error || "Booking failed")
            setSubmitting(false)
          }
        } catch (err: any) {
          setError(err.message || "Booking failed")
          setSubmitting(false)
        }
      },
      prefill: {
        name: getUser()?.username || "",
        email: getUser()?.email || "",
      },
      theme: {
        color: "#3b82f6",
      },
      modal: {
        ondismiss: function () {
          setSubmitting(false)
        },
      },
    }

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  }

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullscreen />
      </>
    )
  }

  if (!car) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-[72px] flex items-center justify-center">
          <div className="text-center px-5">
            <p className="text-muted-foreground mb-4">{error || "Car not found"}</p>
            <button onClick={() => router.push("/")} className="text-sm font-medium text-primary hover:underline">
              Back to home
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[1100px] mx-auto px-5 sm:px-7 lg:px-9 pt-8">
          <button
            onClick={() => router.back()}
            className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors duration-100 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <div className="border border-border">
                <div className="aspect-[16/10] bg-muted">
                  <img
                    src={car.image || "/placeholder.svg"}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h1 className="text-xl font-bold mb-4 tracking-tight">{car.name}</h1>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fuel</p>
                      <p className="font-medium">{car.fuelType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Seats</p>
                      <p className="font-medium">{car.capacity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Rate</p>
                      <p className="font-medium text-primary">₹{car.rentPerHour}/hr</p>
                    </div>
                  </div>
                </div>
              </div>

              {car.bookedTimeSlots && car.bookedTimeSlots.length > 0 && (
                <div className="border border-border p-5">
                  <button
                    onClick={() => setShowBookedSlots(!showBookedSlots)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h3 className="text-sm font-medium">Booked slots</h3>
                    <svg
                      className={`w-4 h-4 text-muted-foreground transition-transform duration-100 ${showBookedSlots ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showBookedSlots && (
                    <div className="mt-4 space-y-2">
                      {car.bookedTimeSlots.map((slot, index) => (
                        <div key={index} className="py-2 text-xs text-muted-foreground border-b border-border last:border-0">
                          {slot.from} → {slot.to}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="border border-border p-5 sticky top-[88px]">
                <h2 className="text-base font-semibold mb-5">Book this car</h2>

                {error && (
                  <div className="py-2 px-3 bg-destructive/5 text-destructive text-xs border-l-2 border-destructive mb-5">
                    {error}
                  </div>
                )}

                <div className="space-y-4">
                  <DateTimePicker
                    date={startDateTime || undefined}
                    setDate={(date) => setStartDateTime(date || null)}
                    minDate={new Date()}
                    label="Pickup"
                  />

                  <DateTimePicker
                    date={endDateTime || undefined}
                    setDate={(date) => setEndDateTime(date || null)}
                    minDate={startDateTime || new Date()}
                    label="Return"
                  />

                  <label className="flex items-center gap-2 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={driverRequired}
                      onChange={(e) => setDriverRequired(e.target.checked)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm">Add driver (+₹300/day)</span>
                  </label>

                  {totalMins > 0 && (
                    <div className="py-4 border-t border-border space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span>{Math.floor(totalMins / 60)}h {totalMins % 60}m</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₹{totalAmount}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handlePayment}
                    disabled={submitting || !startDateTime || !endDateTime || totalMins === 0}
                    className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Processing..." : "Pay now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </>
  )
}
