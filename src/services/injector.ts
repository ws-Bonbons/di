import { ReadonlyDIContainer, InjectDIToken, ScopeID, InjectToken } from "../core/declares";
import { BaseDIContainer } from "../core/di-base";

export abstract class Injector implements ReadonlyDIContainer {
  abstract get<T>(token: InjectDIToken<T>): T;
}

// tslint:disable-next-line: class-name
export interface INTERNAL_Injector<ID extends ScopeID = string> extends ReadonlyDIContainer<ID> {
  get<T>(token: InjectDIToken<T>, scopeId?: ID): T;
  INTERNAL_dispose(): void;
  scopeId?: ID;
}

export function createInjector<T extends ScopeID = string>(
  di: BaseDIContainer<T>
): (scopeId?: T) => INTERNAL_Injector<T> {
  return (scopeId?: T) => ({
    get: (token: InjectToken<any>, scope?: T) => di.get(token, scope || scopeId),
    INTERNAL_dispose: () => di.dispose(scopeId),
    scopeId,
  });
}
