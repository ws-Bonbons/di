"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const di_base_1 = require("./di-base");
const reflect_1 = require("./reflect");
class DIContainer extends di_base_1.BaseDIContainer {
    register(token, imp, scope) {
        this.set(token, {
            token,
            imp,
            scope,
            depts: reflect_1.getDependencies(imp)
        });
    }
    createFactory(item) {
        const { token, imp, scope, depts } = item;
        if (!item.fac) {
            item.fac = () => new (imp)(...this.getDepedencies(depts));
        }
        return item.fac;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=container.js.map