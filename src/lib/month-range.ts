export interface MonthRange {
  startDate: string;
  endDate: string;
  label: string;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getMonthRange(offset: number): MonthRange {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);

  const start = new Date(target.getFullYear(), target.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(target.getFullYear(), target.getMonth() + 1, 0, 23, 59, 59, 999);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    label: capitalize(MONTH_LABEL_FORMATTER.format(target)),
  };
}

// Mirrors DateField's local-date parsing (not `new Date(dateOnly)`, which reads
// YYYY-MM-DD as UTC and can shift the day in negative-offset timezones).
export function dateOnlyToRangeBoundary(dateOnly: string, boundary: 'start' | 'end'): string {
  const [year, month, day] = dateOnly.split('-').map(Number);
  const date =
    boundary === 'start'
      ? new Date(year, month - 1, day, 0, 0, 0, 0)
      : new Date(year, month - 1, day, 23, 59, 59, 999);
  return date.toISOString();
}

export function formatDateOnlyBR(dateOnly: string): string {
  const [year, month, day] = dateOnly.split('-');
  return `${day}/${month}/${year}`;
}
