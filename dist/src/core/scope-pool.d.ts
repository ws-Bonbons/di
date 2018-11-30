import { InjectToken } from "./declares";
export declare class DIScopePool<T = any> {
    private scopeMetadata;
    private instanceMap;
    constructor(scopeMetadata: {
        ctx?: T;
    });
    readonly metadata: {
        ctx?: T;
    };
    setInstance<T>(token: InjectToken<T>, instance: T): void;
    getInstance<T>(token: InjectToken<T>): T | null | undefined;
    update(newMaps: Array<[InjectToken, any]>): void;
    update(resolver: <T>(token: InjectToken<T>) => T | null): void;
    dispose(): void;
}
