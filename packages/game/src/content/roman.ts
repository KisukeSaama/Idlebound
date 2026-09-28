/** A number in Roman numerals (1 to 3999), for eras, Ages and nights. */
export function roman(value: number): string {
  let rest = Math.max(1, Math.min(3999, Math.floor(value)));
  let out = "";
  for (const [numeral, amount] of [["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1]] as const) {
    while (rest >= amount) {
      out += numeral;
      rest -= amount;
    }
  }
  return out;
}
