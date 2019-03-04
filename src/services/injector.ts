import { ReadonlyDIContainer, InjectDIToken, ScopeID, InjectToken } from "../core/declares";
import { BaseDIContainer } from "../core/di-base";

export abstract class Injector implements ReadonlyDIContainer {
  abstract get<T>(token: InjectDIToken<T>): T;
}

// tslint:disable-next-line: class-name
interface INTERNAL_Injector<T extends ScopeID = string> extends ReadonlyDIContainer {
  INTERNAL_dispose(): void;
  scopeId?: T;
}

export function createInjector<T extends ScopeID = string>(
  di: BaseDIContainer<T>
): (scopeId?: T) => INTERNAL_Injector<T> {
  return (scopeId?: T) => ({
    get: (token: InjectToken<any>) => di.get(token, scopeId),
    INTERNAL_dispose: () => di.dispose(scopeId),
    scopeId,
  });
}
