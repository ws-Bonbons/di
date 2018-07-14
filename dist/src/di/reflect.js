"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const contracts_1 = require("@bonbons/contracts");
const { PARAMS_META_KEY, CTOR_META_KEY, PIPE_META_KEY } = contracts_1.Contracts;
function getDependencies(target) {
    return Reflect.getMetadata(PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
class ReflectionConstructor {
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
exports.ReflectionConstructor = ReflectionConstructor;
exports.Reflection = new ReflectionConstructor();
//# sourceMappingURL=reflect.js.map