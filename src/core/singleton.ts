import { InjectToken, ScopeID } from "./declares";
import { Injector, INTERNAL_Injector } from "../services/injector";

export interface InjectableSingleton {
  OnUpdate(updates: ISingletonUpdates): void;
}

// tslint:disable-next-line: class-name
export interface INTERNAL_InjectableSingleton<T extends object = ISingletonUpdates> {
  prototype: ISingletonPrototype;
  "@delegate": T;
  "@scope": ScopeID;
  OnUpdate(updates: ISingletonUpdates): void;
}

export interface ISingletonPrototype {
  "@watch": ISingletonWatch;
  "@override": string[];
}

interface ISingletonWatch {
  [prop: string]: {
    token: InjectToken<any>;
  };
}

interface ISingletonUpdates {
  [prop: string]: any;
}

export class SingletonBasement<T extends object = ISingletonUpdates>
  implements InjectableSingleton {
  protected readonly "@delegate": T = {} as any;
  protected readonly "@scope"!: ScopeID;

  protected get delegate() {
    return this["@delegate"] as T;
  }

  OnUpdate(updates: ISingletonUpdates): void {
    // @ts-ignore fuck type hahahahahaha
    this["@delegate"] = updates;
  }
}
