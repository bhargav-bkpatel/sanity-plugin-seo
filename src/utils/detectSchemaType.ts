import { Schema } from '../types/Types';
import seoType from '../schemas/types/seo/list/seoType';
import seo from '../patterns/seo';

type List =
  | string
  | {
      optgroup?: string;
      list?: string[];
    };

const findSchemaType = (typeList: List[], schemaType: string) => {
  const result = typeList.find(item => {
    if (typeof item === 'string' && item === schemaType) {
      return schemaType;
    }
    if (typeof item === 'object' && item.optgroup && item.list) {
      const findInList = item.list.find(
        (subitem: string) => subitem === schemaType.replace(/([A-Z])/g, ' $1').trim()
      );
      if (findInList) {
        return schemaType;
      }
      return undefined;
    }
    return undefined;
  });
  if (typeof result === 'string') {
    return schemaType;
  }
  if (typeof result === 'object' && result.optgroup && result.list) {
    const findInList = result?.list.find(
      (subitem: string) => subitem === schemaType.replace(/([A-Z])/g, ' $1').trim()
    );
    if (findInList) {
      return schemaType;
    }
    return undefined;
  }
  return undefined;
};

const detectSchemaType = (schema: Schema) => {
  const { type } = schema;
  switch (type) {
    case findSchemaType(seoType, type):
      return seo;
    default:
      return undefined;
  }
};

export default detectSchemaType;
