
import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  onSelect?: (date: Date | undefined) => void
  defaultMonth?: Date
  mode?: "single"
  className?: string
  placeholder?: string
}

export function DatePicker({
  value,
  onChange,
  onSelect,
  defaultMonth,
  mode = "single",
  className,
  placeholder = "Pick a date"
}: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value)

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onChange) onChange(selectedDate)
    if (onSelect) onSelect(selectedDate)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={mode}
          selected={date}
          onSelect={handleSelect}
          defaultMonth={defaultMonth}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  )
}
