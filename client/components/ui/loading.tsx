"use client"

export function LoadingSpinner({ fullscreen = false, size = "default" }: { fullscreen?: boolean; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "w-5 h-5 border",
    default: "w-8 h-8 border-2",
    large: "w-12 h-12 border-2"
  }

  const spinner = (
    <div className={`${sizeClasses[size]} border-primary border-t-transparent animate-spin`} />
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-background/90 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center p-4">{spinner}</div>
}
