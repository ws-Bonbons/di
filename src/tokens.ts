import {
  BonbonsConfigCollection,
  BonbonsDIContainer,
  BonbonsTokenGenerator,
  IStaticTypedResolver,
  IENV,
  IDepolyENV,
  JsonResultOptions,
  StringResultOptions,
  JsonFormOptions,
  URLFormOptions,
  TextFormOptions,
  KOABodyParseOptions
} from "@bonbons/contracts";

export const createToken: BonbonsTokenGenerator = (key: string) => ({ key: Symbol(`BONBONS-KOA2-TOKEN:${key}`) });

export const ENV_MODE = createToken<IENV>("ENV_MODE");
export const DEPLOY_MODE = createToken<IDepolyENV>("DEPLOY_MODE");
export const CONFIG_COLLECTION = createToken<BonbonsConfigCollection>("CONFIG_COLLECTION");
export const DI_CONTAINER = createToken<BonbonsDIContainer>("DI_CONTAINER");
export const STATIC_TYPED_RESOLVER = createToken<IStaticTypedResolver>("STATIC_TYPED_RESOLVER");
export const JSON_RESULT_OPTIONS = createToken<JsonResultOptions>("JSON_RESULT_OPTIONS");
export const STRING_RESULT_OPTIONS = createToken<StringResultOptions>("STRING_RESULT_OPTIONS");
export const BODY_PARSE_OPTIONS = createToken<KOABodyParseOptions>("BODY_PARSE_OPTIONS");
export const JSON_FORM_OPTIONS = createToken<JsonFormOptions>("JSON_FORM_OPTIONS");
export const URL_FORM_OPTIONS = createToken<URLFormOptions>("URL_FORM_OPTIONS");
export const TEXT_FORM_OPTIONS = createToken<TextFormOptions>("TEXT_FORM_OPTIONS");