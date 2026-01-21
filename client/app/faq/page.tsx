"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Is this a real car rental service?",
      answer: "No, this is a demonstration project showcasing a car rental platform. It is not an actual rental service and no real bookings or transactions can be made. All data, prices, and availability shown are for demonstration purposes only."
    },
    {
      question: "What documents do I need to rent a car?",
      answer: "You'll need a valid driving license, government-issued ID (Aadhaar/Passport), and a credit/debit card for the security deposit. International customers need an International Driving Permit along with their home country license."
    },
    {
      question: "Is there a security deposit?",
      answer: "Yes, we require a refundable security deposit that varies by vehicle category. Economy cars require ₹5,000, sedans ₹10,000, and SUVs/luxury vehicles ₹15,000–25,000. The deposit is fully refunded within 3–5 business days after return."
    },
    {
      question: "What is your fuel policy?",
      answer: "All vehicles are provided with a full tank. Please return the car with a full tank to avoid refueling charges. If returned with less fuel, we charge the refueling cost plus a ₹250 service fee."
    },
    {
      question: "Can I extend my booking?",
      answer: "Yes, extensions are possible subject to availability. Contact us at least 6 hours before your scheduled return time. Extended hours are charged at the standard hourly rate."
    },
    {
      question: "What happens if I return the car late?",
      answer: "A grace period of 30 minutes is provided. Beyond that, you'll be charged for an additional hour. Returns more than 3 hours late may incur a full day's charge."
    },
    {
      question: "Is insurance included?",
      answer: "Basic insurance covering third-party liability is included in all rentals. Comprehensive coverage with zero deductible is available as an add-on for ₹500/day."
    },
    {
      question: "Do you offer airport pickup/drop?",
      answer: "Yes, we offer pickup and drop services at Indira Gandhi International Airport. Airport transfers require a minimum 4-hour booking. Our representative will meet you at the arrivals area."
    },
    {
      question: "What is the minimum rental period?",
      answer: "The minimum rental period is 4 hours for city use. For outstation trips, the minimum is 24 hours with a daily kilometer limit of 300 km."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Free cancellation is available up to 24 hours before pickup. Cancellations within 24 hours incur a 25% fee. No-shows are charged 50% of the booking amount."
    },
    {
      question: "Do you provide drivers?",
      answer: "Yes, professional drivers are available on request at ₹150/hour (minimum 4 hours). All our drivers are verified, licensed, and have local area expertise."
    }
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[900px] mx-auto px-5 sm:px-7 lg:px-9 pt-12">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Support</p>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Frequently asked questions</h1>
            <p className="text-muted-foreground">Common questions about renting with us.</p>
          </div>

          <div className="space-y-px bg-border">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-background"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-5 flex items-start gap-4 group"
                >
                  <span className="text-xs text-muted-foreground/50 font-mono pt-0.5">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium transition-colors duration-150 ${openIndex === index ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                      {faq.question}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-200 ${openIndex === index ? 'max-h-48 mt-3' : 'max-h-0'}`}>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                  <span className={`text-muted-foreground/50 text-lg leading-none transition-transform duration-150 ${openIndex === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-foreground/[0.03] border-l-2 border-primary px-6 py-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Still have questions?</p>
            <p className="text-sm text-foreground/90 mb-4">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <a 
              href="/contact" 
              className="inline-block text-xs uppercase tracking-wide text-primary hover:text-primary/80 transition-colors duration-100"
            >
              Contact us →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
