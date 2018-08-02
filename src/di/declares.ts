import { Constructor, Contracts as c } from "@bonbons/contracts";

const { InjectScope } = c;
type InjectScope = c.InjectScope;
export type InjectToken<T = any> = c.InjectToken<T>;
export type ImplementType<T = any> = c.ImplementType<T>;
export type ImplementFactory<T = any> = c.ImplementFactory<T>;
export type Implement<T = any> = c.Implement<T>;
export type Nullable<T> = c.Nullable<T>;
export type Exist<T> = c.Exist<T>;
export type ScopeID = c.ScopeID;
export type DIContainerEntry<T> = c.DIContainerEntry<T>;
export type DepedencyResolveEntry<T> = c.DepedencyResolveEntry<T>;
export type BonbonsDIContainer = c.BonbonsDIContainer;

export {
  InjectScope
};
