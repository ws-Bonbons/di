import { BaseDIContainer } from "./di-base";
import { Implement, InjectScope, InjectToken, DIContainerEntry } from "./declares";
import { Contracts as c } from "@bonbons/contracts";
export declare type Scope = c.InjectScope;
export declare class DIContainer extends BaseDIContainer {
    register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope): void;
    createFactory<T>(item: DIContainerEntry<T>): c.ImplementFactory<any>;
}
