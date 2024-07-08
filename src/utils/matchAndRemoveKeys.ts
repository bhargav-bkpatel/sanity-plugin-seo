/* eslint-disable @typescript-eslint/no-explicit-any */
type NestedObj = Record<string, any>;
function matchAndRemoveKeys(obj: NestedObj, pattern?: NestedObj) {
  if (typeof pattern !== 'object' || pattern === undefined) {
    return obj;
  }
  const matchedObj = {} as NestedObj;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in pattern) {
    if (key in obj) {
      const value = obj[key];
      if (typeof value === 'object' && !Array.isArray(value)) {
        if (value.strLogo) {
          const { strLogo, ...rest } = value;
          const modifiedValue = {
            logo: strLogo,
            ...rest
          };
          matchedObj[key] = matchAndRemoveKeys(modifiedValue, pattern[key]);
        } else {
          matchedObj[key] = matchAndRemoveKeys(value, pattern[key]);
        }
      } else if (Array.isArray(value) && typeof value[0] === 'string') {
        matchedObj[key] = value;
      } else if (Array.isArray(value) && typeof value[0] === 'object') {
        matchedObj[key] = value.map((item: NestedObj) => matchAndRemoveKeys(item, pattern[key][0]));
      } else {
        matchedObj[key] = matchAndRemoveKeys(value, pattern[key]);
      }
    }
  }

  return matchedObj;
}

export default matchAndRemoveKeys;
