"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Props {
  month: number | null;
  year: number | null;
  onChange: (month: number, year: number) => void;
  minYear?: number;
  maxYear?: number;
  disabled?: boolean;
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MonthYearPicker({
  month,
  year,
  onChange,
  minYear = 2010,
  maxYear = new Date().getFullYear(),
  disabled = false,
}: Props) {
  const [localMonth, setLocalMonth] = useState<number | null>(month);
  const [localYear, setLocalYear] = useState<number | null>(year);

  useEffect(() => {
    setLocalMonth(month);
    setLocalYear(year);
  }, [month, year]);

  useEffect(() => {
    if (localMonth !== null && localYear !== null) {
      onChange(localMonth, localYear);
    }
  }, [localMonth, localYear]);

  const years = [];
  for (let y = maxYear; y >= minYear; y--) {
    years.push(y);
  }

  return (
    <div className="flex gap-2">
      <Select
        disabled={disabled}
        value={localMonth !== null ? String(localMonth) : undefined}
        onValueChange={(value) => {
          setLocalMonth(Number(value));
        }}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m, i) => (
            <SelectItem key={m} value={String(i)}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        disabled={disabled}
        value={localYear !== null ? String(localYear) : undefined}
        onValueChange={(value) => {
          setLocalYear(Number(value));
        }}
      >
        <SelectTrigger className="h-9 text-sm w-24">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
