export interface Constructor<T> {
  new (...args: any[]): T;
  prototype: T;
}

export interface AbstractType<T> {
  prototype: T;
}

/** 用来区分范围的id，范围注入依赖于这个id来实现 */
export type ScopeID = string | Symbol;

/** 描述一个类型的变量一定不为undefined */
export type Exist<T> = Exclude<T, undefined>;

/** 描述一个必不为undefined的变量是可能为null的 */
export type Nullable<T> = Exist<T> | null;

/** Built-in metadata type: context type of the record attribute method */
export const TYPE_META_KEY = "design:type";
/** Built-in metadata type: params types of the record attribute method */
export const PARAMS_META_KEY = "design:paramtypes";
/** Built-in metadata type: return type of the record attribute method */
export const RETURN_META_KEY = "design:returntype";

/**
 * 描述了依赖项在整个容器中的生命周期情况
 * @description
 * @export
 * @enum {number}
 */
export enum InjectScope {
  Singleton = 0,
  Scope = 1,
  New = 2,
}

export interface IBaseInjectable {
  __valid?: boolean;
}

export type InjectableToken<T> = AbstractType<T>;

/**
 * 描述一个实现类型的构造函数
 * @description
 * @author Big Mogician
 * @export
 * @interface ImplementType
 * @template T
 */
export interface ImplementType<T extends any> {
  prototype?: T;
}

export type ImplementToken<T> = ImplementType<T>;

export type IInjectable = Constructor<IBaseInjectable>;

/** 依赖注入项基础构造工厂 */
export type ImplementBasicFactory<T, SCOPE extends ScopeID, CONTEXT = any> = (
  scopeId?: SCOPE,
  scopeData?: ScopeMetadata<SCOPE, CONTEXT>
) => T;

interface IArrayLike {
  [Symbol.iterator]: any;
  [Symbol.unscopables]: any;
}

type ConstructorsTuple<T extends any[]> = IArrayLike &
  { [key in keyof T]: T[key] extends Constructor<infer TV> ? TV : any };

export type IResolvableFactory<T, DEPTS extends any[] = []> = (...depts: DEPTS) => T;

/** 依赖注入项构造工厂 */
export type IDeptFactory<
  T,
  SCOPE extends ScopeID,
  DEPTS extends Constructor<any>[] = [],
  CONTEXT = any
> = IResolvableFactory<T, ConstructorsTuple<DEPTS>> | ImplementBasicFactory<T, SCOPE, CONTEXT>;

export type InjectDIToken<T> = Constructor<T> | AbstractType<T>;
export type InjectToken<T> = InjectDIToken<T>;

export type ImplementBasicDIValue<T, SCOPE extends ScopeID> =
  | ImplementType<T>
  | T
  | ImplementBasicFactory<T, SCOPE>;
export type ImplementDIValue<T, SCOPE extends ScopeID, DEPTS extends any[] = []> =
  | ImplementType<T>
  | T
  | IResolvableFactory<T, DEPTS>;

export type Implement<T, SCOPE extends ScopeID, DEPTS extends any[] = []> =
  | ImplementBasicDIValue<T, SCOPE>
  | ImplementDIValue<T, SCOPE, DEPTS>;

export interface IToken<T> {
  key: symbol;
}

export interface IEntry<T> {
  token: IToken<T>;
  value: T;
}

export type ITokenGenerator = <T>(key: string) => IToken<T>;

export interface ConfigsCollection {
  get<T>(token: IToken<T>): T;
}

export interface IConfigCollection extends ConfigsCollection {
  set<T>(token: IToken<T>, entry: T): void;
  toArray(): IEntry<any>[];
}

export interface DIEntry<T = any> {
  getInstance(): T;
}

export interface ReadonlyDIContainer<ID extends ScopeID = string> {
  get<T>(token: InjectToken<T>, scopeId?: ID): T;
}

export type ScopeMetadata<ID, SCOPE> = SCOPE & {
  readonly scopeId: ID;
};

export interface IRegisterConfig<K, V, ID extends ScopeID, DEPTS extends any[] = []> {
  token: InjectToken<K>;
  imp: Implement<V, ID, DEPTS>;
  scope: InjectScope;
  depts?: DEPTS;
}

export interface IDIContainer<ID extends ScopeID = string, SCOPE extends any = any>
  extends ReadonlyDIContainer<ID> {
  count: number;
  register<K, V, DEPTS extends any[] = []>(config: IRegisterConfig<K, V, ID, DEPTS>): void;
  getDepedencies(depts: InjectToken<any>[], scopeId?: ID): any[];
  getConfig(): any;
  complete(): void;
  createScope(scopeId: ID, metadata: SCOPE): void;
  dispose(scopeId?: ID): void;
}

/**
 * 在依赖注入容器内部正常运作所需要提供的entry信息
 * @description
 * @author Big Mogician
 * @export
 * @interface DepedencyResolveEntry
 * @template T
 */
export interface DepedencyResolveEntry<T = any> {
  /** 注入令牌 */
  token: InjectToken<T>;
  /** 实现 */
  imp: any;
  /** 依赖的其他令牌数组 */
  depts: InjectToken<any>[];
  /** React-Singleton依赖令牌数组 */
  watch: [string, InjectToken<any>][];
  /** 注入项的生命周期和解析范围 */
  scope: InjectScope;
}

/**
 * 依赖注入容器内部entry的完整信息
 * @description
 * @author Big Mogician
 * @export
 * @interface DIContainerEntry
 * @extends {DepedencyResolveEntry<T>}
 * @template T
 */
export interface DIContainerEntry<T> extends DepedencyResolveEntry<T> {
  /** 工程方法，手工提供或者由框架生成 */
  fac: Nullable<ImplementBasicFactory<any, any>>;
  /** 包裹处理scope之后的工程方法，是解析依赖项的最终执行方法 */
  getInstance: Nullable<(scopeId?: ScopeID) => T | null>;
  /** 当前依赖项的依赖层级，高级依赖低级 */
  level: number;
  /** 注入的历史，包含所有覆盖行为的操作栈 */
  history: DepedencyResolveEntry[];
}

export interface IToken<T> {
  key: symbol;
}

export interface IEntry<T> {
  token: IToken<T>;
  value: T;
}

export type EmitType = "info" | "error" | "warn";

interface EmitPayload {
  level: EmitType;
  data: { msg: string; [prop: string]: any };
  error?: Error;
}

export interface IContainerConfigs {
  type: "native" | "proxy";
  onEmit?: (e: EmitPayload) => void;
  throws?: boolean;
}

export interface IProxyBundle<T = any> {
  init: boolean;
  source: T;
}
