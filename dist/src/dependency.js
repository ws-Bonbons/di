"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contracts_1 = require("@bonbons/contracts");
const utils_1 = require("@bonbons/utils");
const { InjectScope } = contracts_1.Contracts;
class DependencyQueue {
    constructor() {
        this.queue = [];
        this.sections = [];
    }
    addNode({ el, realel, scope, deps }) {
        const found = this.queue.find(i => i.el === el);
        if (found)
            throw duplicateError(el);
        deps = deps || [];
        const registerValue = realel || el;
        const { prototype } = registerValue;
        const isConstructor = !!prototype;
        const isFactory = utils_1.TypeCheck.isFunction(registerValue || {});
        scope = scope || InjectScope.Singleton;
        this.queue.push({
            el, realel: registerValue, deps,
            scope: isConstructor ? scope : InjectScope.Singleton,
            fac: isFactory ? registerValue : null
        });
    }
    sort() {
        this.sections[0] = this.queue.filter(i => i.deps.length === 0);
        this.decideSection(this.queue.filter(i => i.deps.length > 0), this.sections, 1);
        return this.sections.reduce((pre, cur, idx, arr) => ([...pre, ...cur]));
    }
    decideSection(queue, sections, current) {
        if (queue.length === 0)
            return;
        const wants = queue.filter(item => resolveUnder(item, sections, current - 1, this.queue));
        if (wants.length === 0)
            return;
        sections[current] = wants;
        this.decideSection(queue.filter(i => !wants.includes(i)), sections, current + 1);
    }
}
exports.DependencyQueue = DependencyQueue;
function resolveUnder(node, sections, checkIndex, sourceQueue) {
    const checkArr = [];
    if (checkIndex < 0)
        return false;
    let index = checkIndex;
    while (index >= 0) {
        checkArr.push(...sections[index]);
        index--;
    }
    const isresolved = node.deps.every(i => checkArr.map(m => m.el).includes(i));
    if (!isresolved && !node.deps.every(i => sourceQueue.map(m => m.el).includes(i)))
        throw resolveError(node.realel, node.deps);
    return isresolved;
}
function resolveError(el, depts) {
    return utils_1.invalidOperation(`Resolve dependency error : the dependency queue is broken caused by [${(el && el.name) || "unknown name"}]. ` +
        `the depedency list is [${(depts || []).map(i => i.name || "??").join(", ")}]`);
}
function duplicateError(el) {
    return utils_1.invalidOperation(`register service error : the inject token is duplicate : [${(el && el.name) || "unknown name"}]. `);
}
//# sourceMappingURL=dependency.js.map