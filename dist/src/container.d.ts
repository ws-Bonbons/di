import { BonbonsDIContainer, BonbonsDIEntry, InjectScope, InjectDIToken, ImplementDIValue } from "@bonbons/contracts";
declare class DIEntry implements BonbonsDIEntry {
    private scope;
    private _instance;
    private _fac?;
    constructor(scope: InjectScope);
    getInstance(): any;
}
export declare class DIContainer implements BonbonsDIContainer {
    private deps_queue;
    protected _pool: Map<InjectDIToken<import("../node_modules/@bonbons/contracts/dist/src/injectable").IBonbonsInjectable>, DIEntry>;
    readonly count: number;
    get<T>(token: InjectDIToken): T;
    register(selector: InjectDIToken, value: ImplementDIValue, scope: InjectScope): void;
    resolveDeps(value: any): {}[];
    complete(): void;
}
export {};
