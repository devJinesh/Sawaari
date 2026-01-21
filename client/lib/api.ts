const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ApiResponse<T> {
  success?: boolean
  data?: T
  message?: string
  error?: string
  errors?: Array<{ msg: string }>
  [key: string]: any
}

export class ApiClient {
  private static getToken(): string | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user).token : null
  }

  private static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    return headers
  }

  static async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(includeAuth),
      })
      return await response.json()
    } catch (error) {
      console.error("API GET error:", error)
      throw error
    }
  }

  static async post<T>(endpoint: string, body?: Record<string, any>, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: this.getHeaders(includeAuth),
        body: body ? JSON.stringify(body) : undefined,
      })
      return await response.json()
    } catch (error) {
      console.error("API POST error:", error)
      throw error
    }
  }

  static async put<T>(endpoint: string, body?: Record<string, any>, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers: this.getHeaders(includeAuth),
        body: body ? JSON.stringify(body) : undefined,
      })
      return await response.json()
    } catch (error) {
      console.error("API PUT error:", error)
      throw error
    }
  }

  static async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers: this.getHeaders(includeAuth),
      })
      return await response.json()
    } catch (error) {
      console.error("API DELETE error:", error)
      throw error
    }
  }
}
