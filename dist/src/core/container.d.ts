import "reflect-metadata";
import { BaseDIContainer } from "./di-base";
import { Implement, InjectScope, InjectToken, DIContainerEntry } from "./declares";
export declare function getDependencies(target: any): any[];
export declare type Scope = InjectScope;
export declare class DIContainer extends BaseDIContainer {
    register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope): void;
    createFactory<T>(item: DIContainerEntry<T>): import("./declares").ImplementFactory<any>;
}
