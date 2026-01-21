"use client"

export function ServicesSection() {
  const services = [
    {
      title: "Safe",
      description: "Maintained vehicles, full insurance coverage."
    },
    {
      title: "Fair pricing",
      description: "Transparent rates. No hidden fees."
    },
    {
      title: "Always on",
      description: "24/7 support when you need it."
    },
    {
      title: "Drivers available",
      description: "Professional drivers on request."
    },
    {
      title: "Fast booking",
      description: "Book in under two minutes."
    },
    {
      title: "Delivery",
      description: "We bring the car to you."
    }
  ]

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Why us</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">What we offer</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="group border-l-2 border-border hover:border-primary pl-4 py-3 transition-colors duration-150"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs text-muted-foreground/50 font-mono">0{index + 1}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-150">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
