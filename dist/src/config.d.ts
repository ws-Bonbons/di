import { Contracts as api } from "@bonbons/contracts";
declare type Configs = api.BonbonsConfigCollection;
declare type Token<T> = api.BonbonsToken<T>;
export declare class ConfigCollection implements Configs {
    protected _pool: Map<symbol, {
        value: any;
    }>;
    set<T>(token: Token<T>, entry: T): void;
    get<T>(token: Token<T>): T;
    toArray(): api.BonbonsEntry<any>[];
}
export {};
