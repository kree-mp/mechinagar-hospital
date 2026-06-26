const NP_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुस', 'माघ', 'फागुन', 'चैत',
] as const;

// Days per BS month (Baisakh=0 … Chaitra=11), coverage: BS 2060–2090
const BS_DATA: Record<number, readonly number[]> = {
  2060: [32, 31, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2061: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2062: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2063: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2064: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2065: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2066: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2067: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2068: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2069: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2070: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2071: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2072: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2073: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2074: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2075: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2077: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2078: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2079: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2081: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
  2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2088: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
  2090: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
};

// Reference: April 13, 2024 = BS 2081/01/01
const BS_REF_YEAR = 2081;
const AD_REF_EPOCH_DAYS = Math.floor(new Date('2024-04-13T00:00:00Z').getTime() / 86400000);

function adToBs(date: Date): { year: number; month: number; day: number } {
  const adDays = Math.floor(date.getTime() / 86400000);
  let diff = adDays - AD_REF_EPOCH_DAYS;

  let bsYear = BS_REF_YEAR;
  let bsMonth = 0;
  let bsDay = 1;

  if (diff >= 0) {
    while (diff > 0) {
      const months = BS_DATA[bsYear];
      if (!months) throw new Error(`BS year ${bsYear} not in lookup table`);
      const remaining = months[bsMonth] - bsDay;
      if (diff <= remaining) {
        bsDay += diff;
        diff = 0;
      } else {
        diff -= remaining + 1;
        bsDay = 1;
        bsMonth++;
        if (bsMonth === 12) { bsMonth = 0; bsYear++; }
      }
    }
  } else {
    diff = -diff;
    while (diff > 0) {
      if (diff < bsDay) {
        bsDay -= diff;
        diff = 0;
      } else {
        diff -= bsDay;
        bsMonth--;
        if (bsMonth < 0) { bsMonth = 11; bsYear--; }
        const months = BS_DATA[bsYear];
        if (!months) throw new Error(`BS year ${bsYear} not in lookup table`);
        bsDay = months[bsMonth];
      }
    }
  }

  return { year: bsYear, month: bsMonth + 1, day: bsDay };
}

function toNepaliDigits(n: number): string {
  return String(n).split('').map((d) => '०१२३४५६७८९'[Number(d)]).join('');
}

export function formatBsDay(date: Date): string {
  const { day } = adToBs(date);
  return toNepaliDigits(day).padStart(2, '०');
}

export function formatBsMonth(date: Date): string {
  const { month } = adToBs(date);
  return NP_MONTHS[month - 1];
}
