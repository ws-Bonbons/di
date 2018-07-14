import { Contracts as api } from "@bonbons/contracts";
export declare type Scope = api.InjectScope;
declare type Entry = api.BonbonsDIEntry;
declare type Container = api.BonbonsDIContainer;
declare type IJTToken<T = any> = api.InjectDIToken<T>;
declare type IMPValue = api.ImplementDIValue;
declare class DIEntry implements Entry {
    private scope;
    private _instance;
    private _fac?;
    constructor(scope: Scope);
    getInstance(): any;
}
export declare class DIContainer implements Container {
    private deps_queue;
    protected _pool: Map<api.InjectDIToken<api.IBonbonsInjectable>, DIEntry>;
    readonly count: number;
    get<T>(token: IJTToken<T>): T;
    register(selector: IJTToken, value: IMPValue, scope: Scope): void;
    resolveDeps(value: any): {}[];
    complete(): void;
}
export {};
