export interface MonthRange {
  startDate: string;
  endDate: string;
  label: string;
}

const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// YYYY-MM-DD from the local date parts (not toISOString, which is UTC and can
// shift the day). The API counts the end date as the whole day.
function toDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getMonthRange(offset: number): MonthRange {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1);

  const start = new Date(target.getFullYear(), target.getMonth(), 1);
  const end = new Date(target.getFullYear(), target.getMonth() + 1, 0);

  return {
    startDate: toDateOnly(start),
    endDate: toDateOnly(end),
    label: capitalize(MONTH_LABEL_FORMATTER.format(target)),
  };
}

export function formatDateOnlyBR(dateOnly: string): string {
  const [year, month, day] = dateOnly.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}
