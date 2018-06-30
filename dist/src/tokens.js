export const createToken = (key) => ({ key: Symbol(`BONBONS-KOA2-TOKEN:${key}`) });
export const ENV_MODE = createToken("ENV_MODE");
export const DEPLOY_MODE = createToken("DEPLOY_MODE");
export const CONFIG_COLLECTION = createToken("CONFIG_COLLECTION");
export const DI_CONTAINER = createToken("DI_CONTAINER");
export const STATIC_TYPED_RESOLVER = createToken("STATIC_TYPED_RESOLVER");
export const JSON_RESULT_OPTIONS = createToken("JSON_RESULT_OPTIONS");
export const STRING_RESULT_OPTIONS = createToken("STRING_RESULT_OPTIONS");
export const BODY_PARSE_OPTIONS = createToken("BODY_PARSE_OPTIONS");
export const JSON_FORM_OPTIONS = createToken("JSON_FORM_OPTIONS");
export const URL_FORM_OPTIONS = createToken("URL_FORM_OPTIONS");
export const TEXT_FORM_OPTIONS = createToken("TEXT_FORM_OPTIONS");
//# sourceMappingURL=tokens.js.map