import { InjectScope } from "@bonbons/contracts";
import { DependencyQueue } from "./dependency";
import { invalidOperation, invalidParam, TypeCheck } from "@bonbons/utils";
import { getDependencies } from "./reflect";
class DIEntry {
    constructor(scope) {
        this.scope = scope;
    }
    getInstance() {
        return this.scope === InjectScope.Singleton ? (this._instance || (this._instance = this._fac())) : this._fac();
    }
}
export class DIContainer {
    constructor() {
        this.deps_queue = new DependencyQueue();
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
        if (prototype && !TypeCheck.isFunction(value) && !prototype.__valid)
            throw serviceError(value);
        if (!prototype && !TypeCheck.isFunction(value) && !__valid)
            throw serviceError(value);
        this.deps_queue.addNode({ el: selector, realel: value, deps: getDependencies(value), scope });
    }
    resolveDeps(value) {
        return getDependencies(value).map(dep => this.get(dep));
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
function serviceError(selector) {
    return invalidParam("Service to be add is invalid. You can only add the service been decorated by @Injectable(...).", {
        className: selector && selector.name,
        stringfy: selector || {}
    });
}
function registerError(selector) {
    return invalidOperation(`injectable register error : injectable element with name [${(selector && selector.name) || "unknown name"}] is exist already.`);
}
function resolveError(selector) {
    return invalidOperation(`resolve injectable dependencies error : can not resolve dept name [${(selector && selector.name) || "unknown name"}] .`);
}
//# sourceMappingURL=container.js.map