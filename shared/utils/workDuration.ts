export function calculateWorkDuration(
  startDate: string,
  endDate?: string | null,
  isPresent?: boolean,
): string {
  if (!startDate) return "";

  const start = new Date(startDate);
  const end = isPresent || !endDate ? new Date() : new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  // kalau masih negatif berarti invalid range
  if (years < 0 || (years === 0 && months < 0)) return "";

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  }

  if (months > 0) {
    parts.push(`${months} mo${months > 1 ? "s" : ""}`);
  }

  return parts.length > 0 ? parts.join(" ") : "Less than 1 mo";
}
