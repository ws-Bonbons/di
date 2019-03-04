import { InjectToken, ScopeMetadata, ScopeID } from "./declares";

export class DIScopePool<ID extends ScopeID = string, SCOPE = any> {
  private instanceMap = new Map<InjectToken<any>, any>();

  constructor(private scopeMetadata: ScopeMetadata<ID, SCOPE>) {}

  public get metadata() {
    return this.scopeMetadata;
  }

  setInstance<T>(token: InjectToken<T>, instance: T): void {
    this.instanceMap.set(token, instance || null);
  }

  getInstance<T>(token: InjectToken<T>): T | null | undefined {
    const instance = this.instanceMap.get(token);
    return instance;
  }

  update(newMaps: Array<[InjectToken<any>, any]>): void;
  update(resolver: <T>(token: InjectToken<T>) => T | null): void;
  update(args: any): void {
    if (args instanceof Array) {
      const newMaps: Array<[InjectToken<any>, any]> = args;
      newMaps.forEach(([key, instance]) => {
        this.instanceMap.set(key, instance);
      });
    } else {
      const resolver: <T>(token: InjectToken<T>) => T | null = args;
      Array.from(this.instanceMap.keys()).forEach(key => {
        this.instanceMap.set(key, resolver(key));
      });
    }
  }

  dispose() {
    // @ts-ignore resource dispose
    this.scopeMetadata = undefined;
    this.instanceMap.clear();
    // @ts-ignore resource dispose
    this.instanceMap = undefined;
  }
}
