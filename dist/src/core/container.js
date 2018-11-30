"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const di_base_1 = require("./di-base");
const declares_1 = require("./declares");
function getDependencies(target) {
    return Reflect.getMetadata(declares_1.PARAMS_META_KEY, target) || [];
}
exports.getDependencies = getDependencies;
class DIContainer extends di_base_1.BaseDIContainer {
    register(token, imp, scope) {
        this.set(token, {
            token,
            imp,
            scope,
            depts: getDependencies(imp)
        });
    }
    createFactory(item) {
        const { imp, depts } = item;
        if (!item.fac) {
            item.fac = (scopeId) => new (imp)(...this.getDepedencies(depts, scopeId));
        }
        return item.fac;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=container.js.map