/** A number in Roman numerals (1 to 3999), for eras, Ages and nights; past 3999, in figures. */
export function roman(value: number): string {
  if (value > 3999) return String(Math.floor(value));
  let rest = Math.max(1, Math.floor(value));
  let out = "";
  for (const [numeral, amount] of [["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]] as const) {
    while (rest >= amount) {
      out += numeral;
      rest -= amount;
    }
  }
  return out;
}
