import { formatDateOnlyBR, getMonthRange } from '@/lib/month-range';

describe('getMonthRange', () => {
  afterEach(() => jest.useRealTimers());

  it('returns the first and last day of the current month', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 10, 15));
    const range = getMonthRange(0);
    expect(range.startDate).toBe('2026-11-01');
    expect(range.endDate).toBe('2026-11-30');
  });

  it('handles negative offsets across a year boundary', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 31));
    const range = getMonthRange(-1);
    expect(range.startDate).toBe('2025-12-01');
    expect(range.endDate).toBe('2025-12-31');
  });

  it('handles leap-year February', () => {
    jest.useFakeTimers().setSystemTime(new Date(2024, 0, 10));
    expect(getMonthRange(1).endDate).toBe('2024-02-29');
  });

  it('is not shifted by a 31st day when moving to a shorter month', () => {
    jest.useFakeTimers().setSystemTime(new Date(2026, 0, 31));
    expect(getMonthRange(1).startDate).toBe('2026-02-01');
  });
});

describe('formatDateOnlyBR', () => {
  it('formats YYYY-MM-DD as DD/MM/YYYY and ignores a time part', () => {
    expect(formatDateOnlyBR('2026-11-04')).toBe('04/11/2026');
    expect(formatDateOnlyBR('2026-11-04T10:00:00')).toBe('04/11/2026');
  });
});
