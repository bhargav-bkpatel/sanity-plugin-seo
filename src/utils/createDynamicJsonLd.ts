/* eslint-disable @typescript-eslint/no-explicit-any */
import detectSchemaType from './detectSchemaType';
import matchAndRemoveKeys from './matchAndRemoveKeys';
import { Schema } from '../types/Types';

type JsonLdObject = {
  [key: string]: any;
  '@type': string;
};

function createDynamicJsonLd(schemaObj: Schema) {
  const pattern = detectSchemaType(schemaObj);
  const obj = schemaObj;
  const jsonLd: JsonLdObject = obj.type
    ? { '@id': obj.type, '@type': obj.type }
    : {
        '@type': obj.type
      };
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop) && prop !== '_type') {
      const value = obj[prop];
      const { id, ...rest } = value ?? {};
      if (value) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          if (value?.type === 'OfferCatalog') {
            jsonLd[prop] = {
              '@type': value?.type,
              name: value?.name,
              itemListElement: value?.itemListElement?.map(item => ({
                '@type': item?.type,
                name: item?.name,
                itemListElement: item?.itemListElement?.map(subitem => ({
                  '@type': subitem?.type,
                  itemOffered: {
                    '@type': subitem?.itemOffered?.type,
                    name: subitem?.itemOffered?.name
                  }
                }))
              }))
            };
          } else if (value?.type === 'SeekToAction') {
            jsonLd[prop] = {
              '@type': value?.type,
              target: `${value?.searchUrl}={seek_to_second_number}`,
              'startOffset-input': 'required name=seek_to_second_number',
              ...rest
            };
          } else if (value?.type === 'SearchAction') {
            jsonLd[prop] = {
              '@type': value?.type,
              target: `${value?.searchUrl}{search_term_string}${value?.optionalString}`,
              'query-input': 'required name=search_term_string',
              ...rest
            };
          } else if (value?.logo) {
            const { logo, ...restValue } = value;
            jsonLd[prop] = {
              '@type': value?.type,
              ...restValue
            };
          } else {
            jsonLd[prop] = id
              ? { '@id': id, '@type': value?.type, ...rest }
              : {
                  '@type': value?.type,
                  ...rest
                };
          }
        } else {
          jsonLd[prop] = value;
        }
      }
    }
  }
  return matchAndRemoveKeys(jsonLd, pattern);
}

export default createDynamicJsonLd;
