import { Contracts as c } from "@bonbons/contracts";
export declare type Scope = c.InjectScope;
declare type Entry = c.BonbonsDIEntry;
declare type Container = c.BonbonsDIContainer;
declare type IJTToken<T = any> = c.InjectDIToken<T>;
declare type IMPValue = c.ImplementDIValue;
declare class DIEntry implements Entry {
    private scope;
    private _instance;
    private _fac?;
    constructor(scope: Scope);
    getInstance(): any;
}
export declare class DIContainer implements Container {
    private deps_queue;
    protected _pool: Map<c.InjectDIToken<c.IBonbonsInjectable>, DIEntry>;
    readonly count: number;
    get<T>(token: IJTToken<T>): T;
    register(selector: IJTToken, value: IMPValue, scope: Scope): void;
    resolveDeps(value: any): {}[];
    complete(): void;
}
export {};
