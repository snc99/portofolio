export function mapZodErrors(
  fields: Record<string, string[]>,
): Record<string, string> {
  const formatted: Record<string, string> = {};

  Object.keys(fields).forEach((key) => {
    if (fields[key] && fields[key].length > 0) {
      formatted[key] = fields[key][0]; // ambil error pertama saja
    }
  });

  return formatted;
}
