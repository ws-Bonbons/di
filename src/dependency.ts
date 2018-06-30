import { InjectScope, BonbonsDeptNode } from "@bonbons/contracts";
import { invalidOperation, TypeCheck } from "@bonbons/utils";

export class DependencyQueue {

  private queue: BonbonsDeptNode[] = [];
  private sections: Array<BonbonsDeptNode[]> = [];

  public addNode({ el, realel, scope, deps }: BonbonsDeptNode) {
    const found = this.queue.find(i => i.el === el);
    if (found) throw duplicateError(el);
    deps = deps || [];
    const registerValue = realel || el;
    const { prototype } = <any>registerValue;
    const isConstructor = !!prototype;
    const isFactory = TypeCheck.isFunction(registerValue || {});
    scope = scope || InjectScope.Singleton;
    this.queue.push({
      el, realel: <any>registerValue, deps,
      scope: isConstructor ? scope : InjectScope.Singleton,
      fac: isFactory ? <any>registerValue : null
    });
  }

  public sort(): BonbonsDeptNode[] {
    this.sections[0] = this.queue.filter(i => i.deps.length === 0);
    this.decideSection(this.queue.filter(i => i.deps.length > 0), this.sections, 1);
    return this.sections.reduce((pre, cur, idx, arr) => ([...pre, ...cur]));
  }

  private decideSection(queue: BonbonsDeptNode[], sections: Array<BonbonsDeptNode[]>, current: number) {
    if (queue.length === 0) return;
    const wants = queue.filter(item => resolveUnder(item, sections, current - 1, this.queue));
    if (wants.length === 0) return;
    sections[current] = wants;
    this.decideSection(queue.filter(i => !wants.includes(i)), sections, current + 1);
  }

}

function resolveUnder(node: BonbonsDeptNode, sections: Array<BonbonsDeptNode[]>, checkIndex: number, sourceQueue: BonbonsDeptNode[]) {
  const checkArr: BonbonsDeptNode[] = [];
  if (checkIndex < 0) return false;
  let index = checkIndex;
  while (index >= 0) {
    checkArr.push(...sections[index]);
    index--;
  }
  const isresolved = node.deps.every(i => checkArr.map(m => m.el).includes(i));
  if (!isresolved && !node.deps.every(i => sourceQueue.map(m => m.el).includes(i))) throw resolveError(node.realel, node.deps);
  return isresolved;
}

function resolveError(el: any, depts: any[]) {
  return invalidOperation(
    `Resolve dependency error : the dependency queue is broken caused by [${(el && el.name) || "unknown name"}]. ` +
    `the depedency list is [${(depts || []).map(i => i.name || "??").join(", ")}]`
  );
}

function duplicateError(el: any) {
  return invalidOperation(
    `register service error : the inject token is duplicate : [${(el && el.name) || "unknown name"}]. `
  );
}
