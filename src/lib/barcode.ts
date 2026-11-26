// Groups a boleto's linha digitável the way it is printed, so it can be read and compared at a glance.
// - 47 digits (bank slip): AAAAA.AAAAA BBBBB.BBBBBB CCCCC.CCCCCC D EEEEEEEEEEEEEE
// - 48 digits (utility/convênio): four blocks of 11 digits plus a check digit, e.g. 85890000001-3 ...
// Anything else (an unexpected length or a code with letters) is grouped in blocks of 5 digits.
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatBarcode(value: string): string {
  const digits = onlyDigits(value);

  if (digits.length === 47) {
    return [
      `${digits.slice(0, 5)}.${digits.slice(5, 10)}`,
      `${digits.slice(10, 15)}.${digits.slice(15, 21)}`,
      `${digits.slice(21, 26)}.${digits.slice(26, 32)}`,
      digits.slice(32, 33),
      digits.slice(33),
    ].join(' ');
  }

  if (digits.length === 48) {
    return [0, 12, 24, 36].map((start) => `${digits.slice(start, start + 11)}-${digits[start + 11]}`).join(' ');
  }

  if (!digits) return value.trim();
  return digits.match(/.{1,5}/g)!.join(' ');
}
