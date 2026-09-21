import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toRoman, fromRoman } from '../src/core.js';

describe('toRoman', () => {
  it('converts basic symbols', () => {
    assert.equal(toRoman(1), 'I');
    assert.equal(toRoman(5), 'V');
    assert.equal(toRoman(10), 'X');
    assert.equal(toRoman(50), 'L');
    assert.equal(toRoman(100), 'C');
    assert.equal(toRoman(500), 'D');
    assert.equal(toRoman(1000), 'M');
  });

  it('uses subtractive notation for 4, 9, 40, 90, 400, 900', () => {
    assert.equal(toRoman(4), 'IV');
    assert.equal(toRoman(9), 'IX');
    assert.equal(toRoman(40), 'XL');
    assert.equal(toRoman(90), 'XC');
    assert.equal(toRoman(400), 'CD');
    assert.equal(toRoman(900), 'CM');
  });

  it('combines symbols for compound numbers', () => {
    assert.equal(toRoman(3), 'III');
    assert.equal(toRoman(14), 'XIV');
    assert.equal(toRoman(19), 'XIX');
    assert.equal(toRoman(44), 'XLIV');
    assert.equal(toRoman(99), 'XCIX');
    assert.equal(toRoman(444), 'CDXLIV');
    assert.equal(toRoman(999), 'CMXCIX');
  });

  it('handles the maximum supported value', () => {
    assert.equal(toRoman(3999), 'MMMCMXCIX');
  });

  it('rejects out-of-range integers', () => {
    assert.throws(() => toRoman(0), RangeError);
    assert.throws(() => toRoman(-1), RangeError);
    assert.throws(() => toRoman(4000), RangeError);
  });

  it('rejects non-integers', () => {
    assert.throws(() => toRoman(3.5), RangeError);
    assert.throws(() => toRoman('3'), RangeError);
    assert.throws(() => toRoman(null), RangeError);
    assert.throws(() => toRoman(undefined), RangeError);
  });
});

describe('fromRoman', () => {
  it('parses basic symbols', () => {
    assert.equal(fromRoman('I'), 1);
    assert.equal(fromRoman('V'), 5);
    assert.equal(fromRoman('X'), 10);
    assert.equal(fromRoman('L'), 50);
    assert.equal(fromRoman('C'), 100);
    assert.equal(fromRoman('D'), 500);
    assert.equal(fromRoman('M'), 1000);
  });

  it('parses subtractive pairs', () => {
    assert.equal(fromRoman('IV'), 4);
    assert.equal(fromRoman('IX'), 9);
    assert.equal(fromRoman('XL'), 40);
    assert.equal(fromRoman('XC'), 90);
    assert.equal(fromRoman('CD'), 400);
    assert.equal(fromRoman('CM'), 900);
  });

  it('parses compound numerals', () => {
    assert.equal(fromRoman('III'), 3);
    assert.equal(fromRoman('XIV'), 14);
    assert.equal(fromRoman('XIX'), 19);
    assert.equal(fromRoman('XLIV'), 44);
    assert.equal(fromRoman('XCIX'), 99);
    assert.equal(fromRoman('CDXLIV'), 444);
    assert.equal(fromRoman('CMXCIX'), 999);
  });

  it('parses the maximum supported value', () => {
    assert.equal(fromRoman('MMMCMXCIX'), 3999);
  });

  it('round-trips all values from 1 to 3999', () => {
    for (let i = 1; i <= 3999; i += 1) {
      assert.equal(fromRoman(toRoman(i)), i);
    }
  });

  it('rejects invalid characters', () => {
    assert.throws(() => fromRoman('IVX'), RangeError);
    assert.throws(() => fromRoman('A'), RangeError);
    assert.throws(() => fromRoman('i'), RangeError);
  });

  it('rejects invalid repetition', () => {
    assert.throws(() => fromRoman('IIII'), RangeError);
    assert.throws(() => fromRoman('VV'), RangeError);
    assert.throws(() => fromRoman('LL'), RangeError);
    assert.throws(() => fromRoman('DD'), RangeError);
    assert.throws(() => fromRoman('XXXX'), RangeError);
  });

  it('rejects invalid subtractive pairs', () => {
    assert.throws(() => fromRoman('IL'), RangeError);
    assert.throws(() => fromRoman('IC'), RangeError);
    assert.throws(() => fromRoman('XD'), RangeError);
    assert.throws(() => fromRoman('XM'), RangeError);
    assert.throws(() => fromRoman('VX'), RangeError);
    assert.throws(() => fromRoman('LC'), RangeError);
    assert.throws(() => fromRoman('DM'), RangeError);
  });

  it('rejects empty and non-string input', () => {
    assert.throws(() => fromRoman(''), RangeError);
    assert.throws(() => fromRoman(null), RangeError);
    assert.throws(() => fromRoman(undefined), RangeError);
    assert.throws(() => fromRoman(42), RangeError);
  });
});
