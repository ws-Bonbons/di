"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const contracts_1 = require("@bonbons/contracts");
function getDependencies(target) {
    return Reflect.getMetadata(contracts_1.PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
class ReflectionConstructor {
    GetInjections(target) {
        return getDependencies(target);
    }
    GetControllerMetadata(target) {
        return Reflect.getMetadata(contracts_1.CTOR_META_KEY, target) || { router: { prefix: "/", routes: {} }, pipes: [], middlewares: [] };
    }
    SetControllerMetadata(target, meta) {
        Reflect.defineMetadata(contracts_1.CTOR_META_KEY, meta, target);
    }
    GetPipeMetadata(target) {
        return Reflect.getMetadata(contracts_1.PIPE_META_KEY, target) || { params: {}, keyMatch: [] };
    }
    SetPipeMetadata(target, meta) {
        Reflect.defineMetadata(contracts_1.PIPE_META_KEY, meta, target);
    }
}
exports.ReflectionConstructor = ReflectionConstructor;
exports.Reflection = new ReflectionConstructor();
//# sourceMappingURL=reflect.js.map