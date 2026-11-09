import { useCallback, useEffect, useState } from 'react';

export const RESEND_INTERVAL_SECONDS = 60;

// Seconds left until the resend button unlocks, counting from `sentAt` (ms epoch).
export function getRemainingSeconds(sentAt: number, now: number, intervalSeconds = RESEND_INTERVAL_SECONDS) {
  return Math.max(0, Math.ceil((sentAt + intervalSeconds * 1000 - now) / 1000));
}

export function formatResendLabel(remaining: number) {
  return remaining > 0 ? `Reenviar código em ${remaining} s` : 'Reenviar código';
}

// The first window starts at `initialSentAt` (the send made on the previous screen).
export function useResendCountdown(initialSentAt: number) {
  const [sentAt, setSentAt] = useState(initialSentAt);
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(initialSentAt, Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(getRemainingSeconds(sentAt, Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [sentAt]);

  const restart = useCallback(() => setSentAt(Date.now()), []);

  return { remaining, restart };
}
