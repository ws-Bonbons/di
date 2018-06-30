import {
  BonbonsConfigCollection,
  BonbonsDIContainer,
  BonbonsTokenGenerator,
  BonbonsToken,
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

export const ENV_MODE: BonbonsToken<IENV> = createToken<IENV>("ENV_MODE");
export const DEPLOY_MODE: BonbonsToken<IDepolyENV> = createToken<IDepolyENV>("DEPLOY_MODE");
export const CONFIG_COLLECTION: BonbonsToken<BonbonsConfigCollection> = createToken<BonbonsConfigCollection>("CONFIG_COLLECTION");
export const DI_CONTAINER: BonbonsToken<BonbonsDIContainer> = createToken<BonbonsDIContainer>("DI_CONTAINER");
export const STATIC_TYPED_RESOLVER: BonbonsToken<IStaticTypedResolver> = createToken<IStaticTypedResolver>("STATIC_TYPED_RESOLVER");
export const JSON_RESULT_OPTIONS: BonbonsToken<JsonResultOptions> = createToken<JsonResultOptions>("JSON_RESULT_OPTIONS");
export const STRING_RESULT_OPTIONS: BonbonsToken<StringResultOptions> = createToken<StringResultOptions>("STRING_RESULT_OPTIONS");
export const BODY_PARSE_OPTIONS: BonbonsToken<KOABodyParseOptions> = createToken<KOABodyParseOptions>("BODY_PARSE_OPTIONS");
export const JSON_FORM_OPTIONS: BonbonsToken<JsonFormOptions> = createToken<JsonFormOptions>("JSON_FORM_OPTIONS");
export const URL_FORM_OPTIONS: BonbonsToken<URLFormOptions> = createToken<URLFormOptions>("URL_FORM_OPTIONS");
export const TEXT_FORM_OPTIONS: BonbonsToken<TextFormOptions> = createToken<TextFormOptions>("TEXT_FORM_OPTIONS");