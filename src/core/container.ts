import "reflect-metadata";
import { BaseDIContainer, Helpers } from "./di-base";
import {
  Implement,
  InjectScope,
  InjectToken,
  DIContainerEntry,
  ScopeID,
  PARAMS_META_KEY,
} from "./declares";

export function getDependencies(target: any): any[] {
  return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}

export type Scope = InjectScope;

export class DIContainer<ID extends ScopeID = string, SCOPE = any> extends BaseDIContainer<
  ID,
  SCOPE
> {
  public static isFactory(target: any): boolean {
    return Helpers.isFactory(target);
  }

  public static isClass(target: any): boolean {
    return Helpers.isClass(target);
  }

  public static isValue(target: any): boolean {
    return Helpers.isValue(target);
  }

  public register<K, V>(token: InjectToken<K>, imp: Implement<V, ID>, scope: InjectScope) {
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
      item.fac = (scopeId?: ID) => new imp(...this.getDepedencies(depts, scopeId));
    }
    return item.fac;
  }
}
