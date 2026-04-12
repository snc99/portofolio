import { format } from "date-fns";

export function formatWorkPeriod(
  startDate: Date | string,
  endDate?: Date | string | null,
  isPresent?: boolean,
) {
  if (!startDate) return "-";

  const start = new Date(startDate);
  const startFormatted = format(start, "MMM yyyy");

  if (isPresent) {
    return `${startFormatted} - Present`;
  }

  if (!endDate) {
    return `${startFormatted}`;
  }

  const end = new Date(endDate);
  const endFormatted = format(end, "MMM yyyy");

  return `${startFormatted} - ${endFormatted}`;
}
