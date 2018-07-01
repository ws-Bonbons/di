import { BonbonsConfigCollection, BonbonsDIContainer, BonbonsTokenGenerator, BonbonsToken, IStaticTypedResolver, IENV, IDepolyENV, JsonResultOptions, StringResultOptions, JsonFormOptions, URLFormOptions, TextFormOptions, KOABodyParseOptions } from "@bonbons/contracts";
export { BonbonsToken };
export declare const createToken: BonbonsTokenGenerator;
export declare const ENV_MODE: BonbonsToken<IENV>;
export declare const DEPLOY_MODE: BonbonsToken<IDepolyENV>;
export declare const CONFIG_COLLECTION: BonbonsToken<BonbonsConfigCollection>;
export declare const DI_CONTAINER: BonbonsToken<BonbonsDIContainer>;
export declare const STATIC_TYPED_RESOLVER: BonbonsToken<IStaticTypedResolver>;
export declare const JSON_RESULT_OPTIONS: BonbonsToken<JsonResultOptions>;
export declare const STRING_RESULT_OPTIONS: BonbonsToken<StringResultOptions>;
export declare const BODY_PARSE_OPTIONS: BonbonsToken<KOABodyParseOptions>;
export declare const JSON_FORM_OPTIONS: BonbonsToken<JsonFormOptions>;
export declare const URL_FORM_OPTIONS: BonbonsToken<URLFormOptions>;
export declare const TEXT_FORM_OPTIONS: BonbonsToken<TextFormOptions>;
