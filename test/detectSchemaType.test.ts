import seo from '../src/patterns/seo';
import detectSchemaType from '../src/utils/detectSchemaType';

describe('detectSchemaType', () => {
  test('should return seo schema type', () => {
    const schema = { type: 'SEO' };
    const result = detectSchemaType(schema);
    expect(result).toBe(seo);
  });

  test('should return undefined for unknown schema type', () => {
    const schema = { type: 'UnknownType' };
    const result = detectSchemaType(schema);
    expect(result).toBeUndefined();
  });
});
