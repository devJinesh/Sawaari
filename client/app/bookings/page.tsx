"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ApiClient } from "@/lib/api"
import { isAuthenticated, getUser } from "@/lib/auth"
import { LOGO_WHITE_BASE64 } from "@/lib/logo"
import moment from "moment"

interface Booking {
  _id: string
  car: {
    _id: string
    name: string
    image: string
    rentPerHour: number
  }
  user: {
    username: string
    email: string
    phone: string
  }
  bookedTimeSlots: {
    from: string
    to: string
  }
  totalMins: number
  totalAmount: number
  driverRequired: boolean
  address?: string
  transactionId?: string
  createdAt: string
}

export default function BookingsPage() {
  const router = useRouter()
  const user = getUser()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        setLoading(true)
        const response = await ApiClient.get<{ bookings: Booking[] }>("/api/bookings/getallbookings")
        if (response.success) {
          setBookings(response.bookings || response.data || [])
        } else {
          setError(response.error || "Failed to load bookings")
        }
      } catch (err) {
        setError("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [router])

  const generatePDF = async (booking: Booking) => {
    try {
      const { jsPDF } = await import("jspdf")
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      const primaryColor: [number, number, number] = [196, 93, 53]
      const darkColor: [number, number, number] = [26, 25, 23]
      const lightGray: [number, number, number] = [232, 230, 227]
      
      // Header
      doc.setFillColor(...primaryColor)
      doc.rect(0, 0, pageWidth, 45, 'F')
      
      const logoWidth = 28
      const logoHeight = 28
      doc.addImage(LOGO_WHITE_BASE64, 'PNG', (pageWidth - logoWidth) / 2, 4, logoWidth, logoHeight)
      
      doc.setFontSize(14)
      doc.setFont("courier", "bold")
      doc.setTextColor(255, 255, 255)
      doc.text("Sawaari", pageWidth / 2, 38, { align: "center" })
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("BOOKING INVOICE", 14, 57)
      
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text(`Date: ${moment(booking.createdAt).format("DD/MM/YYYY")}`, 14, 65)
      doc.setFontSize(8)
      doc.text(`Booking ID: ${booking._id}`, 14, 71)
      
      // Customer
      let yPos = 85
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("CUSTOMER", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.setLineWidth(0.5)
      doc.line(14, yPos + 2, 60, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      yPos += 10
      
      doc.text(`Name: ${booking.user?.username || "N/A"}`, 14, yPos)
      doc.text(`Email: ${booking.user?.email || "N/A"}`, 14, yPos + 6)
      doc.text(`Phone: ${booking.user?.phone || "N/A"}`, 14, yPos + 12)
      if (booking.address) {
        const addressLines = doc.splitTextToSize(`Address: ${booking.address}`, pageWidth - 28)
        doc.text(addressLines, 14, yPos + 18)
        yPos += (addressLines.length - 1) * 5
      }
      
      // Booking
      yPos += 30
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("BOOKING DETAILS", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.line(14, yPos + 2, 80, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      yPos += 10
      
      doc.text(`Vehicle: ${booking.car?.name || "N/A"}`, 14, yPos)
      doc.text(`From: ${booking.bookedTimeSlots?.from || "N/A"}`, 14, yPos + 8)
      doc.text(`To: ${booking.bookedTimeSlots?.to || "N/A"}`, 14, yPos + 16)
      doc.text(`Duration: ${Math.floor(booking.totalMins / 60)}h ${booking.totalMins % 60}m`, 14, yPos + 24)
      
      if (booking.driverRequired) {
        doc.setTextColor(...primaryColor)
        doc.text("* Driver service included", 14, yPos + 34)
        yPos += 10
      }
      
      // Payment
      yPos += 40
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(...primaryColor)
      doc.text("PAYMENT", 14, yPos)
      
      doc.setDrawColor(...primaryColor)
      doc.line(14, yPos + 2, 50, yPos + 2)
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      yPos += 10
      
      doc.text(`Rate: Rs. ${booking.car?.rentPerHour}/hr`, 14, yPos)
      doc.text(`Duration: ${(booking.totalMins / 60).toFixed(2)} hours`, 14, yPos + 8)
      
      if (booking.driverRequired) {
        const driverCost = ((booking.totalMins * 300) / 1440).toFixed(2)
        doc.text(`Driver: Rs. ${driverCost}`, 14, yPos + 16)
        yPos += 8
      }
      
      // Total
      yPos += 20
      doc.setFillColor(...primaryColor)
      doc.rect(14, yPos - 4, pageWidth - 28, 12, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(11)
      doc.setFont("helvetica", "bold")
      doc.text("TOTAL", 18, yPos + 4)
      doc.text(`Rs. ${booking.totalAmount.toFixed(2)}`, pageWidth - 18, yPos + 4, { align: "right" })
      
      if (booking.transactionId) {
        yPos += 16
        doc.setTextColor(...darkColor)
        doc.setFontSize(8)
        doc.setFont("helvetica", "normal")
        doc.text(`Transaction ID: ${booking.transactionId}`, 14, yPos)
      }
      
      // Footer
      doc.setFillColor(...lightGray)
      doc.rect(0, pageHeight - 24, pageWidth, 24, 'F')
      
      doc.setTextColor(...darkColor)
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text("Thank you for choosing Sawaari.", pageWidth / 2, pageHeight - 14, { align: "center" })
      doc.text("For queries: hello@sawaari.in", pageWidth / 2, pageHeight - 8, { align: "center" })
      
      doc.save(`Sawaari_Invoice_${booking._id.slice(-8)}_${moment(booking.createdAt).format("DDMMYYYY")}.pdf`)
    } catch (err) {
      console.error("PDF generation error:", err)
    }
  }

  const convertMinutesToHrsMins = (mins: number) => {
    const hours = Math.floor(mins / 60)
    const minutes = mins % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9 pt-8">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Account</p>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Bookings</h1>
          </div>

          {error && (
            <div className="py-2.5 px-3 bg-destructive/5 text-destructive text-sm border-l-2 border-destructive mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface border border-border h-64 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 border border-border">
              <p className="text-muted-foreground mb-1">No bookings yet</p>
              <p className="text-sm text-muted-foreground/70 mb-6">Book your first car to get started</p>
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 text-sm font-medium text-primary border border-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-100"
              >
                Browse cars
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-surface border border-border hover:border-primary/30 transition-colors duration-100"
                >
                  <div className="flex gap-4 p-5">
                    <div className="w-32 h-32 flex-shrink-0 bg-muted overflow-hidden">
                      <img
                        src={booking.car?.image || "/placeholder.svg"}
                        alt={booking.car?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{booking.car?.name}</h3>
                      <p className="text-xs text-muted-foreground mb-3">
                        {moment(booking.createdAt).format("DD/MM/YYYY")}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-0.5 bg-foreground/5 text-xs">
                          ₹{booking.car?.rentPerHour}/hr
                        </span>
                        {booking.driverRequired && (
                          <span className="px-2 py-0.5 bg-foreground/5 text-xs">
                            + Driver
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-5 py-4 border-t border-border bg-foreground/[0.02]">
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">From</p>
                        <p className="font-medium">{booking.bookedTimeSlots?.from || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">To</p>
                        <p className="font-medium">{booking.bookedTimeSlots?.to || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Duration</p>
                        <p className="font-medium">{convertMinutesToHrsMins(booking.totalMins)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Total</p>
                        <p className="font-semibold text-primary">₹{booking.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => generatePDF(booking)}
                      className="w-full py-2.5 text-sm font-medium text-muted-foreground border border-border hover:border-foreground hover:text-foreground transition-colors duration-100 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download invoice
                    </button>
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
