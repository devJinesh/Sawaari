"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function AboutPage() {
  const reasons = [
    { title: "Wide selection", desc: "Diverse fleet for any occasion." },
    { title: "Fair pricing", desc: "Competitive rates, no surprises." },
    { title: "Easy booking", desc: "Book online in minutes." },
    { title: "24/7 support", desc: "Help when you need it." },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-[72px] pb-16">
        <div className="max-w-[900px] mx-auto px-5 sm:px-7 lg:px-9 pt-12">
          <div className="mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">About</p>
            <h1 className="text-2xl font-bold tracking-tight mb-3">Sawaari</h1>
            <p className="text-muted-foreground">Your partner for car rentals in Delhi NCR.</p>
          </div>

          <div className="space-y-16">
            <section className="bg-foreground/[0.03] border-l-2 border-primary px-6 py-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Mission</p>
              <p className="text-base text-foreground/90 leading-relaxed">
                We make car rental simple and transparent. No hidden fees, no complexity. 
                Book in minutes, drive away in a well-maintained vehicle.
              </p>
            </section>

            <section>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Why us</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
                {reasons.map((item, i) => (
                  <div key={i} className="bg-background p-5 flex gap-4">
                    <span className="text-2xl font-light text-primary/60 leading-none">0{i + 1}</span>
                    <div>
                      <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-border pt-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Fleet</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                Modern vehicles from economy to premium. Regularly serviced and inspected 
                for safety and comfort.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
