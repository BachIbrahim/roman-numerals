/**
 * Convert an integer to a Roman numeral.
 *
 * Supports integers from 1 to 3999 inclusive, which is the range that can be
 * represented with standard Roman numerals without using a vinculum
 * (overbar) for numbers 4000 and above. This is a deliberate boundary so the
 * library has a single, unambiguous behaviour for every valid input.
 *
 * @param {number} value Integer to convert.
 * @returns {string} Roman numeral representation.
 * @throws {RangeError} If value is not an integer or is outside 1..3999.
 */
export function toRoman(value) {
  if (!Number.isInteger(value)) {
    throw new RangeError('toRoman expects an integer');
  }
  if (value < 1 || value > 3999) {
    throw new RangeError('toRoman supports integers from 1 to 3999');
  }

  const table = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];

  let remaining = value;
  let result = '';

  for (const [arabic, roman] of table) {
    while (remaining >= arabic) {
      result += roman;
      remaining -= arabic;
    }
  }

  return result;
}

/**
 * Convert a Roman numeral string to an integer.
 *
 * Accepts the conventional subtractive forms (IV, IX, XL, XC, CD, CM) and
 * rejects malformed or out-of-range input rather than guessing. Uppercase
 * letters are required because Roman numerals are traditionally written in
 * uppercase and accepting mixed case would require making an undocumented
 * choice about whether "iv" means 4 or is invalid.
 *
 * @param {string} roman Roman numeral to parse.
 * @returns {number} Integer value.
 * @throws {RangeError} If input is empty, invalid, or outside 1..3999.
 */
export function fromRoman(roman) {
  if (typeof roman !== 'string' || roman.length === 0) {
    throw new RangeError('fromRoman expects a non-empty string');
  }

  const values = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let total = 0;
  let previous = 0;
  let repeatCount = 1;
  let lastSymbol = null;

  for (let i = 0; i < roman.length; i += 1) {
    const symbol = roman[i];
    const current = values[symbol];

    if (current === undefined) {
      throw new RangeError(`invalid Roman numeral character: ${symbol}`);
    }

    if (lastSymbol === symbol) {
      repeatCount += 1;
    } else {
      repeatCount = 1;
      lastSymbol = symbol;
    }

    // No standard Roman numeral repeats a symbol more than three times in
    // a row. Five-hundreds (D) and fives (V, L) never repeat at all.
    if (repeatCount > 3) {
      throw new RangeError(`invalid repetition of ${symbol}`);
    }
    if (repeatCount > 1 && (symbol === 'V' || symbol === 'L' || symbol === 'D')) {
      throw new RangeError(`${symbol} cannot repeat`);
    }

    if (previous !== 0 && current > previous) {
      // Subtractive pair. Only I, X, and C may precede a larger value, and
      // the preceding value must be exactly one tenth or one fifth of the
      // larger value (e.g. IV, IX, XL, XC, CD, CM).
      const validSubtractive =
        (previous === 1 && (current === 5 || current === 10)) ||
        (previous === 10 && (current === 50 || current === 100)) ||
        (previous === 100 && (current === 500 || current === 1000));

      if (!validSubtractive) {
        throw new RangeError(`invalid subtractive pair: ${roman[i - 1]}${symbol}`);
      }

      total += current - 2 * previous;
      previous = current;
      continue;
    }

    total += current;
    previous = current;
  }

  if (total < 1 || total > 3999) {
    throw new RangeError('Roman numeral out of range (1..3999)');
  }

  return total;
}
