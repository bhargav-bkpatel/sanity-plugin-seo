import schema from "../Schema";
import metaAttribute from "./seo/list/metaAttribute";
import metaTag from "./seo/list/metaTag";
import openGraph from "./seo/list/openGraph";
import twitter from "./seo/list/twitter";

const types = [schema, metaAttribute, metaTag, openGraph, twitter];

export default types;
