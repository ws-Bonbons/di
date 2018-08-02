import { InjectToken } from "./declares";
export declare class DIScopePool {
    private instanceMap;
    setInstance<T>(token: InjectToken<T>, instance: T): void;
    getInstance<T>(token: InjectToken<T>): T | null | undefined;
    update(newMaps: Array<[InjectToken, any]>): void;
    update(resolver: <T>(token: InjectToken<T>) => T | null): void;
    dispose(): void;
}
