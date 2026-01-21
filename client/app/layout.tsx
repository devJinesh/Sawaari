import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Sawaari - Car Rental Service",
  description: "Book your perfect car rental with ease. Fast, secure, and reliable car rental service.",
  keywords: "car rental, vehicle booking, transportation",
  openGraph: {
    title: "Sawaari - Car Rental Service",
    description: "Book your perfect car rental with ease",
    type: "website",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d9488",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
    </html>
  )
}
