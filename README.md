# Roman Numerals

Convert integers to Roman numerals and Roman numerals back to integers, from 1 to 3999.

```js
import { toRoman, fromRoman } from 'roman-numerals';

toRoman(1999);   // 'MCMXCIX'
fromRoman('MMXXIV'); // 2024
```

This library exists because Roman numeral conversion is a small, well-bounded problem that still has plenty of edge cases: subtractive notation, repetition rules, and input validation. The trade-off made here is strictness — invalid input always throws a `RangeError` rather than returning a best-effort result. That makes the library predictable but means callers must validate or catch errors themselves.

The awkward edge to be aware of is the upper limit of 3999. Standard Roman numerals without an overbar cannot represent 4000 or above, and the parser rejects numerals that would exceed that range rather than silently returning a value that cannot be converted back.

## API

### `toRoman(value: number): string`

Converts an integer from 1 to 3999 inclusive to its Roman numeral representation. Throws `RangeError` if `value` is not an integer or is outside that range.

### `fromRoman(roman: string): number`

Parses an uppercase Roman numeral string and returns its integer value. Accepts the conventional subtractive forms (`IV`, `IX`, `XL`, `XC`, `CD`, `CM`). Throws `RangeError` if the input is empty, contains invalid characters, repeats a symbol more than three times (or repeats `V`, `L`, or `D` at all), or uses an invalid subtractive pair such as `IL`.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

## Contributing

Issues and pull requests are welcome. Please keep the dependency list empty —
that constraint is the point of the project, not an oversight.

