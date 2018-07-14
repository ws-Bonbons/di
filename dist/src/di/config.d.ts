import { Contracts as c } from "@bonbons/contracts";
declare type Configs = c.BonbonsConfigCollection;
declare type Token<T> = c.BonbonsToken<T>;
export declare class ConfigCollection implements Configs {
    protected _pool: Map<symbol, {
        value: any;
    }>;
    set<T>(token: Token<T>, entry: T): void;
    get<T>(token: Token<T>): T;
    toArray(): c.BonbonsEntry<any>[];
}
export {};
