import "reflect-metadata";
import { BaseDIContainer, Helpers } from "./di-base";
import {
  InjectScope,
  DIContainerEntry,
  ScopeID,
  PARAMS_META_KEY,
  IRegisterConfig,
  IContainerConfigs,
  Implement,
  InjectDIToken,
} from "./declares";
import { Injector, createInjector } from "../services/injector";
import { ISingletonPrototype } from "./singleton";

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

  constructor(configs?: Partial<IContainerConfigs>) {
    super(configs);
    this.init();
  }

  protected init() {
    this.register({
      token: Injector,
      imp: createInjector(this),
      scope: InjectScope.Scope,
      depts: [],
    });
  }

  public register<K, V, DEPTS extends any[] = []>({
    token,
    imp,
    scope,
    depts,
  }: IRegisterConfig<K, V, ID, DEPTS>) {
    this.set(token, {
      token,
      imp,
      scope,
      depts: resolveDepts(depts || getDependencies(imp), scope, token),
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

function resolveDepts(depts: any[], scope: InjectScope, token: InjectDIToken<any>) {
  const watch = (<ISingletonPrototype>(<any>token).prototype)["@watch"] || {};
  return [
    ...depts,
    // for react singleton depts check
    ...(scope !== InjectScope.Singleton ? [] : Object.keys(watch).map(name => watch[name].token)),
  ];
}
