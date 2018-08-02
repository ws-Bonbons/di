import { Contracts as c } from "@bonbons/contracts";
declare const InjectScope: typeof c.InjectScope;
declare type InjectScope = c.InjectScope;
export declare type InjectToken<T = any> = c.InjectToken<T>;
export declare type ImplementType<T = any> = c.ImplementType<T>;
export declare type ImplementFactory<T = any> = c.ImplementFactory<T>;
export declare type Implement<T = any> = c.Implement<T>;
export declare type Nullable<T> = c.Nullable<T>;
export declare type Exist<T> = c.Exist<T>;
export declare type ScopeID = c.ScopeID;
export declare type DIContainerEntry<T> = c.DIContainerEntry<T>;
export declare type DepedencyResolveEntry<T> = c.DepedencyResolveEntry<T>;
export declare type BonbonsDIContainer = c.BonbonsDIContainer;
export { InjectScope };
