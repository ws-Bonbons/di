import { InjectToken } from "./declares";

export interface InjectableSingleton {
  OnUpdate(): void;
}

interface ISingletonWatch {
  [prop: string]: {
    token: InjectToken<any>;
  };
}

export class SingletonBasement<T> implements InjectableSingleton {
  protected readonly "@watch": ISingletonWatch = {};
  protected get delegate() {
    return {} as T;
  }

  OnUpdate(): void {
    throw new Error("Method not implemented.");
  }
}
