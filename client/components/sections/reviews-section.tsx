"use client"

export function ReviewsSection() {
  const reviews = [
    {
      name: "Rajesh K.",
      comment: "Car was in perfect condition. Seamless booking.",
      rating: 5
    },
    {
      name: "Priya S.",
      comment: "Professional staff, well-maintained vehicles.",
      rating: 5
    },
    {
      name: "Amit P.",
      comment: "Driver was punctual. Good value.",
      rating: 4
    },
    {
      name: "Sneha R.",
      comment: "Clean cars, fair prices, excellent support.",
      rating: 5
    }
  ]

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-7 lg:px-9">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Testimonials</p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">What people say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-foreground/[0.03] border-l-2 border-transparent hover:border-primary px-5 py-4 transition-colors duration-150"
            >
              <span className="text-3xl text-primary/30 leading-none font-serif">"</span>
              <p className="text-sm text-foreground/90 mb-4 leading-relaxed -mt-2 pl-1">
                {review.comment}
              </p>
              <div className="flex items-center justify-between pl-1">
                <p className="text-xs text-muted-foreground font-medium">{review.name}</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-[10px] ${i < review.rating ? "text-primary" : "text-border"}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
