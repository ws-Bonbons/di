import { IConstructor, Contracts as api } from "@bonbons/contracts";
import { DependencyQueue } from "./dependency";
import { invalidOperation, invalidParam, TypeCheck } from "@bonbons/utils";
import { getDependencies } from "./reflect";

export type Scope = api.InjectScope;

const { InjectScope: Scope } = api;
type Entry = api.BonbonsDIEntry;
type Container = api.BonbonsDIContainer;
type IJTToken<T = any> = api.InjectDIToken<T>;
type IJT = api.IBonbonsInjectable;
type IMPValue = api.ImplementDIValue;
type IMPToken<T = any> = api.ImplementToken<T>;

class DIEntry implements Entry {
  private _instance: any;
  private _fac?: any;
  constructor(private scope: Scope) { }
  getInstance() {
    return this.scope === Scope.Singleton ? (this._instance || (this._instance = this._fac())) : this._fac();
  }
}

export class DIContainer implements Container {

  private deps_queue = new DependencyQueue();
  protected _pool = new Map<IJTToken<IJT>, DIEntry>();

  public get count() { return this._pool.size; }

  public get<T>(token: IJTToken<T>): T {
    const entry = this._pool.get(token);
    return entry && entry.getInstance();
  }

  public register(selector: IJTToken, value: IMPValue, scope: Scope) {
    if (!value) throw serviceError(value);
    const { prototype, __valid } = <any>value;
    if (prototype && !TypeCheck.isFunction(value) && !prototype.__valid) throw serviceError(value);
    if (!prototype && !TypeCheck.isFunction(value) && !__valid) throw serviceError(value);
    this.deps_queue.addNode({ el: selector, realel: value, deps: getDependencies(value), scope });
  }

  public resolveDeps(value) {
    return getDependencies(value).map(dep => this.get(dep));
  }

  public complete() {
    const finals = this.deps_queue.sort();
    finals.forEach(({ el, deps, realel, fac, scope }) => {
      const exist = this._pool.get(el);
      if (exist) throw registerError(el);
      const entry = new DIEntry(scope);
      const isConstructor = !!(<IMPToken<any>>realel).prototype;
      (<any>entry)._fac = fac || (() => (isConstructor ? new (<IConstructor<any>>realel)(...deps.map(dep => this.get(dep))) : realel));
      this._pool.set(el, entry);
    });
  }

}

function serviceError(selector: any) {
  return invalidParam("Service to be add is invalid. You can only add the service been decorated by @Injectable(...).", {
    className: selector && selector.name,
    stringfy: selector || {}
  });
}

function registerError(selector: any) {
  return invalidOperation(`injectable register error : injectable element with name [${(selector && selector.name) || "unknown name"}] is exist already.`);
}

function resolveError(selector: any) {
  return invalidOperation(`resolve injectable dependencies error : can not resolve dept name [${(selector && selector.name) || "unknown name"}] .`);
}
