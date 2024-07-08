import matchAndRemoveKeys from '../src/utils/matchAndRemoveKeys'; // Replace with the actual path to your file

describe('matchAndRemoveKeys', () => {
  it('should return the original object if pattern is not provided', () => {
    const obj = { a: 1, b: { c: 2 } };
    const result = matchAndRemoveKeys(obj);
    expect(result).toEqual(obj);
  });

  it('should match and remove keys based on the provided pattern', () => {
    const obj = {
      a: 1,
      b: { c: 2, d: 3 },
      e: [{ f: 4 }, { g: 5 }],
      h: [{ i: 6 }, { j: 7 }]
    };

    const pattern = {
      a: true,
      b: { c: true },
      e: [{ f: true }],
      h: [{ i: true }]
    };

    const expected = {
      a: 1,
      b: { c: 2 },
      e: [{ f: 4 }, {}],
      h: [{ i: 6 }, {}]
    };

    const result = matchAndRemoveKeys(obj, pattern);
    expect(result).toEqual(expected);
  });

  it('should handle arrays of objects in a nested manner', () => {
    const obj = {
      a: [{ b: 1 }, { c: 2 }],
      d: [{ e: 3 }, { f: 4 }]
    };

    const pattern = {
      a: [{ b: true }, {}],
      d: [{ f: 4 }]
    };

    const expected = {
      a: [{ b: 1 }, {}],
      d: [{}, { f: 4 }]
    };

    const result = matchAndRemoveKeys(obj, pattern);
    expect(result).toEqual(expected);
  });

  it('should handle arrays of strings', () => {
    const obj = {
      a: ['apple', 'banana', 'cherry'],
      b: ['blueberry', 'blackberry']
    };

    const pattern = {
      a: true,
      b: false
    };

    const expected = {
      a: ['apple', 'banana', 'cherry'],
      b: ['blueberry', 'blackberry']
    };

    const result = matchAndRemoveKeys(obj, pattern);
    expect(result).toEqual(expected);
  });
});
