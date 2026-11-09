import { formatResendLabel, getRemainingSeconds } from '@/lib/resend-countdown';

describe('getRemainingSeconds', () => {
  it('starts at 60 right after the send', () => {
    expect(getRemainingSeconds(1_000_000, 1_000_000)).toBe(60);
  });

  it('counts down rounding up', () => {
    expect(getRemainingSeconds(1_000_000, 1_015_000)).toBe(45);
    expect(getRemainingSeconds(1_000_000, 1_015_400)).toBe(45);
  });

  it('never goes below zero', () => {
    expect(getRemainingSeconds(1_000_000, 1_060_000)).toBe(0);
    expect(getRemainingSeconds(1_000_000, 1_999_999)).toBe(0);
  });
});

describe('formatResendLabel', () => {
  it('shows the countdown while locked', () => {
    expect(formatResendLabel(45)).toBe('Reenviar código em 45 s');
  });

  it('shows the plain label when unlocked', () => {
    expect(formatResendLabel(0)).toBe('Reenviar código');
  });
});
