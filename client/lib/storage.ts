export const Storage = {
  booking: {
    save: (data: any) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("bookingData", JSON.stringify(data))
      }
    },
    get: () => {
      if (typeof window === "undefined") return null
      const data = localStorage.getItem("bookingData")
      return data ? JSON.parse(data) : null
    },
    clear: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("bookingData")
      }
    },
  },
}
