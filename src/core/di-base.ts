import {
  InjectScope,
  Nullable,
  InjectToken,
  ImplementBasicFactory,
  ScopeID,
  DIContainerEntry,
  DepedencyResolveEntry,
  IDIContainer,
  IContainerConfigs,
  IProxyBundle,
  IRegisterConfig,
  PARAMS_META_KEY,
  EmitType,
} from "./declares";
import { DIScopePool } from "./scope-pool";
import { isFunction, setColor } from "../utils";
import { INTERNAL_InjectableSingleton, ISingletonPrototype } from "./singleton";

type DeptNode = DIContainerEntry<any>;

interface IInnerConfigs extends IContainerConfigs {
  emit: boolean;
}

export const Helpers = {
  isFactory(target: any): boolean {
    return isFunction(target);
  },
  isClass(target: any): boolean {
    if (isFunction(target)) return false;
    return !!(<any>target).prototype;
  },
  isValue(target: any): boolean {
    if (isFunction(target)) return false;
    if (!!(<any>target).prototype) return false;
    return true;
  },
};

export abstract class BaseDIContainer<ID extends ScopeID = string, SCOPE extends any = any>
  implements IDIContainer<ID, SCOPE> {
  private sections: Array<DeptNode[]> = [];
  private map = new Map<any, DeptNode>();
  private sorted: DeptNode[] = [];

  private configs: IInnerConfigs = {
    type: "native",
    emit: false,
    throws: true,
  };

  public get count(): number {
    return this.sorted.length;
  }

  /**
   * 变量池，用来实现范围模式
   * @description
   * @protected
   * @memberof DIContainer
   */
  protected scopePools: Map<ID, DIScopePool<ID>> = new Map();

  public abstract register<K, V, DEPTS extends any[] = []>(
    configs: IRegisterConfig<K, V, ID, DEPTS>
  ): void;
  public abstract createFactory<T>(imp: DIContainerEntry<T>): ImplementBasicFactory<T, ID>;

  constructor(configs?: Partial<IContainerConfigs>) {
    this.resetConfigs(configs || {});
    this.emitMessage("info", `DI init...`);
  }

  /**
   * 添加一个token-实现映射
   * @description
   * @author Big Mogician
   * @protected
   * @template T
   * @param {InjectToken<T>} token
   * @param {DepedencyResolveEntry<T>} entry
   * @memberof DIContainer
   */
  protected set<T>(token: InjectToken<T>, entry: DepedencyResolveEntry<T>) {
    const { imp, depts } = entry;
    const isFactory = Helpers.isFactory(imp || {});
    const isConstructor = !!(<any>imp).prototype;
    // 支持依赖工厂函数
    const isDeptsFactory = isFactory && depts && depts.length > 0;
    if (isDeptsFactory) {
      // 修正Token的依赖
      Reflect.defineMetadata(PARAMS_META_KEY, depts, token);
    }
    // 为依赖工厂生成基础工厂函数
    const factory = isDeptsFactory ? (sid: ID) => imp(...this.getDepedencies(depts, sid)) : imp;
    const origin = this.map.get(token);
    let history: DepedencyResolveEntry<T>[] = [entry];
    if (origin) {
      history = [...(origin.history || []), entry];
      this.emitMessage(
        "warn",
        `replace injection -> [${(<any>token).name}], all history count: [${history.length}]`
      );
    }
    this.map.set(token, {
      ...entry,
      fac: isFactory ? factory : !isConstructor ? () => imp : null,
      getInstance: null,
      level: -1,
      history,
    });
    this.emitMessage("info", `register injection -> [${(<any>token).name}]`);
  }

  public resetConfigs(configs: Partial<IContainerConfigs>) {
    this.configs = { ...this.configs, ...(configs || {}) };
    if (configs && configs.onEmit) {
      this.configs.emit = true;
    }
    return this;
  }

  private emitMessage(level: EmitType, msg: any, error?: Error) {
    if (this.configs.emit) {
      this.configs.onEmit!({
        level,
        data: typeof msg === "string" ? { msg } : { msg: "", ...msg },
        error,
      });
      return;
    }
    if (this.configs.throws && error) {
      throw error;
    }
  }

  public complete(): void {
    this.resolve();
    this.emitMessage("info", `DI resolved.`);
  }

  public createScope(scopeId: ID, metadata: SCOPE) {
    this.scopePools.set(scopeId, new DIScopePool(<any>{ ...(<any>metadata), scopeId }));
  }

  public dispose(scopeId?: ID) {
    if (scopeId) {
      const pool = this.scopePools.get(scopeId);
      if (pool) pool.dispose();
      this.scopePools.delete(scopeId);
      this.emitMessage("info", `DI scope [${scopeId}] all disposed.`);
    } else {
      this.emitMessage("warn", `DI scope to be disposed is not valid.`);
    }
  }

  /**
   * 解析单个token
   * @description
   * @author Big Mogician
   * @template T
   * @param {InjectToken<T>} token
   * @param {ID} [scopeId]
   * @returns {(T | null)}
   * @memberof DIContainer
   */
  public get<T>(token: InjectToken<T>, scopeId?: ID): T {
    const value = this.map.get(token) || null;
    if (value === null || value.getInstance === null) return null as any;
    return value.getInstance(scopeId) || null;
  }

  /**
   * 获取最终DI容器的整体信息
   * @description
   * @author Big Mogician
   * @returns
   * @memberof DIContainer
   */
  public getConfig() {
    return this.sorted.map(i => ({
      contract: i.token && (<any>i.token).name,
      implement: (i.imp && <any>i.imp.name) || "[factory or instance]",
      scope: i.scope,
      level: i.level,
      dependencies: i.depts.map(i => (<any>i).name),
    }));
  }

  /**
   * 将依赖令牌数组解析成最终的依赖项数组
   * @description
   * @author Big Mogician
   * @template T
   * @param {InjectToken<any>[]} depts
   * @param {ID} scopeId
   * @returns
   * @memberof DIContainer
   */
  public getDepedencies<T>(depts: InjectToken<any>[], scopeId?: ID) {
    return depts.length === 0 ? [] : depts.map(i => this.get(i, scopeId));
  }

  /**
   * 执行依赖处理程序，构建整个DI容器
   * @description
   * @author Big Mogician
   * @private
   * @memberof DIContainer
   */
  private resolve() {
    const queue = Array.from(this.map.values());
    this.sort(queue).forEach(
      item =>
        (item.getInstance = this.wrapWatchableSingleton(
          item,
          this.scopeMark(item, this.createFactory(item))
        ))
    );
  }

  /**
   * 为可监控依赖变化的注入单例初始化工厂函数
   * * 如有必要的话- -
   * @param item
   * @param func
   */
  private wrapWatchableSingleton(item: DIContainerEntry<any>, func: any) {
    if (item.scope !== InjectScope.Singleton) return func;
    const proto: ISingletonPrototype = item.token.prototype;
    const watch = item.watch || [];
    const shouldWatch = watch.length > 0;
    if (!shouldWatch) return func;
    const createSingletonRef = func;
    return (scopeId?: ScopeID) => {
      const override = [
        "@scope", // scopeid
        "@delegate", // internal delegate agent
        "delegate", // delegator for watched depts
        "OnUpdate", // depts update hook
        ...(proto["@override"] || []),
      ];
      const instance = this.createWatchableSinglton(item, scopeId, override, createSingletonRef());
      const updates: any = {};
      watch.forEach(([key, token]) => {
        updates[key] = this.get(token, <any>scopeId);
      });
      instance.OnUpdate(updates);
      return instance;
    };
  }

  private createWatchableSinglton(
    item: DIContainerEntry<any>,
    scopeId: string | Symbol | undefined,
    override: string[],
    source: INTERNAL_InjectableSingleton
  ): INTERNAL_InjectableSingleton {
    const useProxy = this.configs.type === "proxy";
    const instance = Object.create(item.token.prototype, {
      "@scope": {
        writable: false,
        configurable: false,
        value: scopeId,
      },
    });
    if (useProxy) {
      // 使用proxy模式实现响应式singleton
      const delegator: any = source;
      return new Proxy<INTERNAL_InjectableSingleton>(instance, {
        get(target: any, name) {
          if (override.indexOf(<string>name) >= 0) return target[name];
          return delegator[name];
        },
        set(target: any, name, value) {
          if (override.indexOf(<string>name) >= 0) return (target[name] = value);
          return (delegator[name] = value);
        },
      });
    } else {
      // 使用原生模式实现响应式singleton
      Object.getOwnPropertyNames(source).forEach(name => {
        const delegator: any = source;
        if (override.indexOf(<string>name) >= 0) return;
        Object.defineProperty(instance, name, {
          configurable: false,
          enumerable: true,
          get() {
            return delegator[name];
          },
          set(value) {
            delegator[name] = value;
          },
        });
      });
      return instance;
    }
  }

  /**
   * 依赖算法
   * ---
   * * 将依赖项按照依赖级别从低到高排列
   * * 每个实例的依赖项级别一定低于自身
   * * 最终无法被排列的内容，可能存在循环引用，或者不可达引用，可以继续分析
   * @description
   * @author Big Mogician
   * @private
   * @param {DeptNode[]} queue
   * @returns {DeptNode[]}
   * @memberof DIContainer
   */
  private sort(queue: DeptNode[]): DeptNode[] {
    // 底级依赖
    this.sections[0] = queue.filter(i => i.depts.length === 0);
    // 分别解析上层各级别依赖
    this.decideSection(queue.filter(i => i.depts.length > 0), queue, this.sections, 1);
    // 注入level信息
    this.sections.forEach((each, index) => {
      each.forEach(i => (i.level = index + 1));
    });
    // 拼合整个依赖队列
    return (this.sorted = this.sections.reduce((pre, cur) => [...pre, ...cur]));
  }

  /**
   * 完成依赖堆叠的排列
   * @description
   * @author Big Mogician
   * @private
   * @param {DeptNode[]} queue
   * @param {DeptNode[]} sourceQueue
   * @param {Array<DeptNode[]>} sections
   * @param {number} current
   * @returns
   * @memberof DIContainer
   */
  private decideSection(
    queue: DeptNode[],
    sourceQueue: DeptNode[],
    sections: Array<DeptNode[]>,
    current: number
  ) {
    if (queue.length === 0) return;
    // 获得当前级别的依赖数组
    const wants = queue.filter(item => this.resolveUnder(item, sections, current - 1, sourceQueue));
    if (wants.length === 0) return;
    sections[current] = wants;
    // 继续处理上一级别依赖
    this.decideSection(queue.filter(i => !wants.includes(i)), sourceQueue, sections, current + 1);
  }

  /**
   * 依次递归解析下一层级的依赖信息
   *
   * @author Big Mogician
   * @private
   * @param {DeptNode} node
   * @param {Array<DeptNode[]>} sections
   * @param {number} checkIndex
   * @param {DeptNode[]} sourceQueue
   * @memberof BaseDIContainer
   */
  private resolveUnder(
    node: DeptNode,
    sections: Array<DeptNode[]>,
    checkIndex: number,
    sourceQueue: DeptNode[]
  ) {
    const checkArr: DeptNode[] = [];
    if (checkIndex < 0) return false;
    let index = checkIndex;
    while (index >= 0) {
      // 将之前解析的依赖以此获取组合，作为本次处理的依赖源
      checkArr.push(...sections[index]);
      index--;
    }
    // 只有当所有依赖都来自于依赖源，才能作为这一级别依赖的成员
    // 所以这里需要检查节点的所有depts
    const isresolved = node.depts.every(i => checkArr.map(m => m.token).includes(i));
    // 任何不可达错误发生，可以中断应用程序
    if (!isresolved && !node.depts.every(i => sourceQueue.map(m => m.token).includes(i))) {
      const error = resolveError(node.imp, node.depts);
      this.emitMessage("error", error.message, error);
    }
    return isresolved;
  }

  /**
   * 按照scope处理工厂方法
   * @description
   * @author Big Mogician
   * @private
   * @template T
   * @param {DIContainerEntry<T>} item
   * @param {ImplementBasicFactory<T, ID>} fac
   * @returns {(Nullable<(scopeId?: ID) => T | null>)}
   * @memberof DIContainer
   */
  private scopeMark<T>(
    item: DIContainerEntry<T>,
    fac: ImplementBasicFactory<T, ID>
  ): Nullable<(scopeId?: ID) => T | null> {
    const { scope, token } = item;
    const useProxy = this.configs.type === "proxy";
    switch (scope) {
      case InjectScope.New:
        return fac;
      case InjectScope.Scope: // 实现范围模式
        return (scopeId?: ID) => {
          if (!scopeId) return useProxy ? createProxyInstance(fac) : fac();
          const pool = this.scopePools.get(<ID>scopeId);
          if (!pool) {
            const metadata = { scopeId };
            const newPool = new DIScopePool<ID>(metadata);
            const instance = useProxy
              ? createProxyInstance(() => fac(scopeId, metadata))
              : fac(scopeId, metadata);
            newPool.setInstance(token, instance);
            this.scopePools.set(scopeId, newPool);
            return <T>instance;
          } else {
            const poolInstance = pool.getInstance(token);
            if (poolInstance === undefined) {
              const instance = useProxy
                ? createProxyInstance(() => fac(scopeId, pool.metadata))
                : fac(scopeId, pool.metadata);
              pool.setInstance(token, instance);
              return instance;
            } else {
              return poolInstance;
            }
          }
        };
      default:
        // 单例模式，直接用闭包特性来实现
        return (() => {
          let instance: any;
          return () => {
            if (instance) return instance;
            return (instance = fac());
          };
        })();
    }
  }
}

/**
 * 用Proxy的方式创建对象instance
 * @description
 * @author Big Mogician
 * @template T
 * @param {() => T} fac
 * @returns {T}
 */
function createProxyInstance<T>(fac: () => T): T {
  const proxy: IProxyBundle = { init: false, source: undefined };
  return new Proxy(<any>proxy, {
    get(target: IProxyBundle<T>, p) {
      if (!target.init) {
        target.source = fac();
        target.init = true;
      }
      return (<any>target.source)[p];
    },
    set(target: IProxyBundle<T>, p, v) {
      if (!target.init) {
        target.source = fac();
        target.init = true;
      }
      (<any>target.source)[p] = v;
      return true;
    },
  });
}

function resolveError(el: any, depts: any[]) {
  return invalidOperation(
    `Resolve dependency error : the dependency queue is broken caused by [${setColor(
      "green",
      (el && el.name) || "unknown name"
    )}]. ` +
      `the depedency list is [${setColor(
        "blue",
        (depts || []).map(i => i.name || "??").join(", ")
      )}]`
  );
}

function duplicateError(el: any) {
  return invalidOperation(
    `register service error : the inject token is duplicate : [${(el && el.name) ||
      "unknown name"}]. `
  );
}

export function invalidOperation(error: string, more?: any) {
  return ERROR(`[ ${setColor("red", "INVALID OPERATION")} ] : ${error}`, more);
}

export function ERROR(error: string, more?: any) {
  return new Error(
    `${setColor("cyan", error)} \n[ ${setColor("magenta", "more details")} ] : ${JSON.stringify(
      more
    ) || "none"}`
  );
}
