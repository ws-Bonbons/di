import "reflect-metadata";
import { BaseDIContainer } from "./di-base";
import {
  Implement,
  InjectScope,
  InjectToken,
  DIContainerEntry,
  ScopeID,
  PARAMS_META_KEY,
} from "./declares";

export function getDependencies(target): any[] {
  return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}

export type Scope = InjectScope;

export class DIContainer extends BaseDIContainer {
  public register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope) {
    this.set(token, {
      token,
      imp,
      scope,
      depts: getDependencies(imp),
    });
  }

  public createFactory<T>(item: DIContainerEntry<T>) {
    const { imp, depts } = item;
    if (!item.fac) {
      item.fac = (scopeId?: ScopeID) => new imp(...this.getDepedencies(depts, scopeId));
    }
    return item.fac;
  }
}
