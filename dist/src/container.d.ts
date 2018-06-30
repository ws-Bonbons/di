import { BonbonsDIContainer, BonbonsDIEntry, InjectScope, InjectDIToken, ImplementDIValue, IBonbonsInjectable } from "@bonbons/contracts";
declare class DIEntry implements BonbonsDIEntry {
    private scope;
    private _instance;
    private _fac?;
    constructor(scope: InjectScope);
    getInstance(): any;
}
export declare class DIContainer implements BonbonsDIContainer {
    private deps_queue;
    protected _pool: Map<InjectDIToken<IBonbonsInjectable>, DIEntry>;
    readonly count: number;
    get<T>(token: InjectDIToken<T>): T;
    register(selector: InjectDIToken, value: ImplementDIValue, scope: InjectScope): void;
    resolveDeps(value: any): {}[];
    complete(): void;
}
export {};
