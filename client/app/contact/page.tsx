"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: "", email: "", message: "" })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[900px] mx-auto px-5 sm:px-7 lg:px-9 pt-12">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Contact</p>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Get in touch</h1>
            <p className="text-muted-foreground">We're here to help.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 bg-foreground/[0.02] border-l-2 border-primary p-5 space-y-5 h-fit">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                <p className="text-sm font-medium">hello@sawaari.in</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Phone</p>
                <p className="text-sm font-medium">+91 98765 43210</p>
              </div>
              <div className="border-t border-border pt-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Address</p>
                <p className="text-sm text-muted-foreground">
                  A-12, Connaught Place<br />
                  New Delhi 110001
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Hours</p>
                <p className="text-sm text-muted-foreground">
                  Mon–Fri: 9:00–18:00<br />
                  Sat: 10:00–16:00
                </p>
              </div>
            </div>

            <div className="lg:col-span-3">
              {submitted && (
                <div className="p-3 border-l-2 border-green-500 bg-green-500/5 text-green-400 text-sm mb-6">
                  Message sent. We'll respond soon.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors duration-100"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors duration-100"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wide text-muted-foreground mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors duration-100 resize-none"
                    placeholder="Your message"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors duration-100"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
