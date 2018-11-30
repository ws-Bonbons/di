import { IConfigCollection, IToken, IEntry } from "./declares";
declare type Configs = IConfigCollection;
declare type Token<T> = IToken<T>;
export declare class ConfigCollection implements Configs {
    protected _pool: Map<symbol, {
        value: any;
    }>;
    set<T>(token: Token<T>, entry: T): void;
    get<T>(token: Token<T>): T;
    toArray(): IEntry<any>[];
}
export {};
