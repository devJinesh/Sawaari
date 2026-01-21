"use client"

import * as React from "react"

interface DateTimePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  minDate?: Date
  disabled?: boolean
}

export function DateTimePicker({
  date,
  setDate,
  label,
  placeholder = "Select date and time",
  minDate,
  disabled = false,
}: DateTimePickerProps) {
  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const formatDisplay = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}/${month}/${year} ${hours}:${minutes}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setDate(new Date(e.target.value))
    } else {
      setDate(undefined)
    }
  }

  const minDateString = minDate ? formatDateTimeLocal(minDate) : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        value={date ? formatDateTimeLocal(date) : ''}
        onChange={handleChange}
        min={minDateString}
        disabled={disabled}
        className="w-full h-11 px-3 border border-border bg-background text-foreground text-sm focus:outline-none focus:border-primary transition-colors duration-100"
      />
      {date && (
        <p className="text-xs text-muted-foreground mt-1">
          {formatDisplay(date)}
        </p>
      )}
    </div>
  )
}
