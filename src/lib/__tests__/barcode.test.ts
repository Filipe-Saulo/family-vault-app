import { formatBarcode, onlyDigits } from '../barcode';

describe('formatBarcode', () => {
  it('groups a 47-digit bank slip line as printed', () => {
    expect(formatBarcode('23793381286000782713695000063305975520000370000')).toBe(
      '23793.38128 60007.827136 95000.063305 9 75520000370000'
    );
  });

  it('groups a 48-digit utility line in four blocks with check digits', () => {
    expect(formatBarcode('858900000013040201790011902501202310171801001050')).toBe(
      '85890000001-3 04020179001-1 90250120231-0 17180100105-0'
    );
  });

  it('ignores the dots and spaces already in the line', () => {
    expect(formatBarcode('23793.38128 60007.827136 95000.063305 9 75520000370000')).toBe(
      '23793.38128 60007.827136 95000.063305 9 75520000370000'
    );
  });

  it('falls back to blocks of 5 digits for an unexpected length', () => {
    expect(formatBarcode('123456789012')).toBe('12345 67890 12');
  });

  it('keeps a value without digits as it came', () => {
    expect(formatBarcode('  sem código ')).toBe('sem código');
  });
});

describe('onlyDigits', () => {
  it('strips everything but the digits, for copying', () => {
    expect(onlyDigits('23793.38128 60007')).toBe('2379338128' + '60007');
  });
});
