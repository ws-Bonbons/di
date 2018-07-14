"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("@bonbons/contracts");
const dependency_1 = require("./dependency");
const utils_1 = require("@bonbons/utils");
const reflect_1 = require("./reflect");
const { InjectScope: Scope } = contracts_1.Contracts;
class DIEntry {
    constructor(scope) {
        this.scope = scope;
    }
    getInstance() {
        return this.scope === Scope.Singleton ? (this._instance || (this._instance = this._fac())) : this._fac();
    }
}
class DIContainer {
    constructor() {
        this.deps_queue = new dependency_1.DependencyQueue();
        this._pool = new Map();
    }
    get count() { return this._pool.size; }
    get(token) {
        const entry = this._pool.get(token);
        return entry && entry.getInstance();
    }
    register(selector, value, scope) {
        if (!value)
            throw serviceError(value);
        const { prototype, __valid } = value;
        if (prototype && !utils_1.TypeCheck.isFunction(value) && !prototype.__valid)
            throw serviceError(value);
        if (!prototype && !utils_1.TypeCheck.isFunction(value) && !__valid)
            throw serviceError(value);
        this.deps_queue.addNode({ el: selector, realel: value, deps: reflect_1.getDependencies(value), scope });
    }
    resolveDeps(value) {
        return reflect_1.getDependencies(value).map(dep => this.get(dep));
    }
    complete() {
        const finals = this.deps_queue.sort();
        finals.forEach(({ el, deps, realel, fac, scope }) => {
            const exist = this._pool.get(el);
            if (exist)
                throw registerError(el);
            const entry = new DIEntry(scope);
            const isConstructor = !!realel.prototype;
            entry._fac = fac || (() => (isConstructor ? new realel(...deps.map(dep => this.get(dep))) : realel));
            this._pool.set(el, entry);
        });
    }
}
exports.DIContainer = DIContainer;
function serviceError(selector) {
    return utils_1.invalidParam("Service to be add is invalid. You can only add the service been decorated by @Injectable(...).", {
        className: selector && selector.name,
        stringfy: selector || {}
    });
}
function registerError(selector) {
    return utils_1.invalidOperation(`injectable register error : injectable element with name [${(selector && selector.name) || "unknown name"}] is exist already.`);
}
function resolveError(selector) {
    return utils_1.invalidOperation(`resolve injectable dependencies error : can not resolve dept name [${(selector && selector.name) || "unknown name"}] .`);
}
//# sourceMappingURL=container.js.map