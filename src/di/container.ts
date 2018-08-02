import { BaseDIContainer } from "./di-base";
import { Implement, InjectScope, InjectToken, DIContainerEntry } from "./declares";
import { getDependencies } from "./reflect";
import { Contracts as c } from "@bonbons/contracts";

export type Scope = c.InjectScope;

export class DIContainer extends BaseDIContainer {

  public register<K, V>(token: InjectToken<K>, imp: Implement<V>, scope: InjectScope) {
    this.set(token, {
      token,
      imp,
      scope,
      depts: getDependencies(imp)
    });
  }

  public createFactory<T>(item: DIContainerEntry<T>) {
    const { token, imp, scope, depts } = item;
    if (!item.fac) {
      item.fac = () => new (imp)(...this.getDepedencies(depts));
    }
    return item.fac;
  }

}