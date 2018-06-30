import "reflect-metadata";
import { PARAMS_META_KEY, CTOR_META_KEY, PIPE_META_KEY } from "@bonbons/contracts";
export function getDependencies(target) {
    return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}
export class ReflectionConstructor {
    GetInjections(target) {
        return getDependencies(target);
    }
    GetControllerMetadata(target) {
        return Reflect.getMetadata(CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, pipes: [], middlewares: [] };
    }
    SetControllerMetadata(target, meta) {
        Reflect.defineMetadata(CTOR_META_KEY, meta, target);
    }
    GetPipeMetadata(target) {
        return Reflect.getMetadata(PIPE_META_KEY, target) || { params: {}, keyMatch: [] };
    }
    SetPipeMetadata(target, meta) {
        Reflect.defineMetadata(PIPE_META_KEY, meta, target);
    }
}
export const Reflection = new ReflectionConstructor();
//# sourceMappingURL=reflect.js.map