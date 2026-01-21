export interface User {
  _id: string
  username: string
  email: string
  phone?: string
  admin: boolean
  token?: string
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user))
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export function clearUser(): void {
  localStorage.removeItem("user")
}

export function isAuthenticated(): boolean {
  return getUser() !== null
}

export function isAdmin(): boolean {
  return getUser()?.admin ?? false
}
