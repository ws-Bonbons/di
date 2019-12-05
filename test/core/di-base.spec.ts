import * as DIBASE from "../../src/core/di-base";
import {
  DIContainerEntry,
  InjectScope,
  PARAMS_META_KEY,
  IRegisterConfig,
  ImplementBasicFactory,
} from "../../src/core/declares";
import { DIContainer } from "../../src/core/container";
import { expect } from "chai";
import { defineUnit } from "../unit";
import { SingletonBasement } from "../../src/core/singleton";

class DI extends DIBASE.BaseDIContainer<string> {
  public register<K, V, DEPTS extends any[] = []>(
    configs: IRegisterConfig<K, V, string, DEPTS>
  ): void {
    throw new Error("Method not implemented.");
  }

  public createFactory<T>(imp: DIContainerEntry<T>): ImplementBasicFactory<T, string, any> {
    throw new Error("Method not implemented.");
  }
}

class Test {
  public key = 2;
}

class Test2 {}

class Test3 {}

class Test4 {
  constructor(public x: Test) {}
}

class Test5 {
  constructor(public x: Test, public y: Test4) {}
}

class Test6 {
  constructor(public x: Test, public y: Test4) {}
}

class Test7 {
  c = 12345;
}

class Test8 extends SingletonBasement<{ x: Test7 }> {
  get XX() {
    return this.delegate.x;
  }

  edf = 4352345345;
}

// @ts-ignore
Test8.prototype["@watch"] = {
  x: { token: Test7 },
};
// @ts-ignore
Test8.prototype["@override"] = ["XX"];

const dps4 = Reflect.getMetadata(PARAMS_META_KEY, Test4) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dps4, Test], Test4);

const dps5 = Reflect.getMetadata(PARAMS_META_KEY, Test5) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dps5, Test, Test4], Test5);

class SB {
  // tslint:disable-next-line: ban-types
  constructor(private x: Object) {}
}

const dpsSB = Reflect.getMetadata(PARAMS_META_KEY, SB) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dpsSB, Object], SB);

defineUnit(["core/di-base", "Core::DiBase"], () => {
  it("test core/di-base exports", () => {
    expect(Object.keys(DIBASE).length, "[core/di-base] exports count").to.equal(4);
  });

  const con = new DI();
  it("test core/di-base feature : abstract register", () => {
    try {
      con.register({ token: Test, imp: Test, scope: InjectScope.Scope });
    } catch (e) {
      expect(e.message, "[core/di-base] register").to.equal("Method not implemented.");
    }
  });

  it("test core/di-base feature : abstract createFactory", () => {
    try {
      con.createFactory({
        getInstance: () => new Test(),
        imp: () => 1,
        level: 1,
        fac: () => 5,
        // @ts-ignore
        token: Test,
        depts: [],
        watch: [],
        history: [],
        scope: InjectScope.Scope,
      });
    } catch (e) {
      expect(e.message, "[core/di-base] createFactory").to.equal("Method not implemented.");
    }
  });

  let con2 = new DIContainer();

  it("test core/di-base feature : createScope", () => {
    const xT3 = new Test3();
    const xT5 = new Test5(new Test(), new Test4(new Test()));

    con2.createScope("123456", { k: 666 });
    con2.register({ token: Test, imp: Test, scope: InjectScope.Scope });
    con2.register({ token: Test3, imp: () => xT3, scope: InjectScope.Scope });
    con2.register({ token: Test4, imp: Test4, scope: InjectScope.Scope });
    con2.register({ token: Test5, imp: xT5, scope: InjectScope.Scope });
    con2.register({ token: Test7, imp: Test7, scope: InjectScope.Scope });
    con2.register({ token: Test8, imp: Test8, scope: InjectScope.Singleton });

    const target0x = con2.get(Test, "123456");

    expect(target0x, "[core/di-base] singleton scoped [null no complete]").to.equal(null);

    con2.complete();

    const kvs = con2.getConfig();

    expect(Object.keys(kvs).length, "[core/di-base] singleton scoped [null no complete]").to.equal(
      7
    );

    const target01 = con2.get(Test, "123456");
    const target02 = con2.get(Test, "123456");
    const target03 = con2.get(Test2, "123456");
    const target04 = con2.get(Test3, "123456");
    const target03_4 = con2.get(Test4, "123456");
    const target03_4_1 = con2.get(Test4, "123456");
    const target05 = con2.get(Test5, "123456");
    const target08 = con2.get(Test8, "123456");

    expect(target01, "[core/di-base] singleton scoped [same]").to.equal(target02);

    expect(target03, "[core/di-base] singleton scoped [null]").to.equal(null);
    expect(target04, "[core/di-base] singleton scoped [same 04]").to.equal(xT3);
    expect(target05, "[core/di-base] singleton scoped [same 05]").to.equal(xT5);
    expect(target03_4, "[core/di-base] singleton scoped [same 03_4]").to.equal(target03_4_1);
    expect(target03_4.x, "[core/di-base] singleton scoped [same dependencies x]").to.equal(
      target03_4_1.x
    );
    expect(
      target05.x === target03_4.x,
      "[core/di-base] singleton scoped [diff dependencies x]"
    ).to.equal(false);

    expect(target08.XX.c, "[core/di-base] react singleton dept").to.equal(12345);
    target08.XX.c += 1;

    const target08_2 = con2.get(Test8);
    expect(target08_2.XX.c, "[core/di-base] react singleton dept").to.equal(12345);

    const target08_3 = con2.get(Test8, "123456");
    expect(target08_3.XX.c, "[core/di-base] react singleton dept").to.equal(12346);

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    expect(target08_2["ccccc"], "[core/di-base] react singleton dept").to.equal(undefined);

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    target08["ccccc"] = 242134234;

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    expect(target08_2["ccccc"], "[core/di-base] react singleton dept").to.equal(undefined);

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    expect(target08_3["ccccc"], "[core/di-base] react singleton dept").to.equal(undefined); // ! 警告⚠️： 原生模式无法动态的添加字段，只能相应初始化过的属性

    expect(target08_3.edf, "[core/di-base] react singleton dept").to.equal(4352345345);

    target08_3.edf = 555;
    expect(target08.edf, "[core/di-base] react singleton dept").to.equal(555);
  });

  con2 = new DIContainer();

  it("test core/di-base feature : proxy mode", () => {
    const xT3 = new Test3();
    const xT5 = new Test5(new Test(), new Test4(new Test()));

    con2.createScope("123456", { k: 666 });
    con2.register({ token: Test, imp: Test, scope: InjectScope.Scope });
    con2.register({ token: Test3, imp: () => xT3, scope: InjectScope.Scope });
    con2.register({ token: Test4, imp: Test4, scope: InjectScope.Scope });
    con2.register({ token: Test5, imp: xT5, scope: InjectScope.Scope });
    con2.register({ token: Test7, imp: Test7, scope: InjectScope.Singleton });
    con2.register({ token: Test8, imp: Test8, scope: InjectScope.Singleton });

    con2.register({
      token: Test6,
      depts: [Test, Test4],
      imp: (a: any, b: any) => new Test6(a, b),
      scope: InjectScope.Scope,
    });

    const target0x = con2.get(Test, "123456");

    expect(target0x, "[core/di-base] singleton scoped [null no complete]").to.equal(null);

    con2.resetConfigs({ type: "proxy" });
    con2.complete();

    const kvs = con2.getConfig();

    expect(Object.keys(kvs).length, "[core/di-base] singleton scoped [null no complete]").to.equal(
      8
    );

    const target01 = con2.get(Test, "123456");
    const target02 = con2.get(Test, "123456");
    const target03 = con2.get(Test2, "123456");
    const target04 = con2.get(Test3, "123456");
    const target03_4 = con2.get(Test4, "123456");
    const target03_4_1 = con2.get(Test4, "123456");
    const target05 = con2.get(Test5, "123456");
    const target06 = con2.get(Test6, "123456");
    const target07 = con2.get(Test7);
    const target07_2 = con2.get(Test7);
    const target08 = con2.get(Test8);

    const target06_x73 = con2.get(Test6);
    const target06_x7 = con2.get(Test6, "123457");

    expect(target01, "[core/di-base] singleton scoped [same]").to.equal(target02);

    expect(target03, "[core/di-base] singleton scoped [null]").to.equal(null);
    expect(target04 === xT3, "[core/di-base] singleton scoped [same 04]").to.equal(false); // proxy with instance.
    expect(target05 === xT5, "[core/di-base] singleton scoped [same 05]").to.equal(false);
    expect(target05.x === xT5.x, "[core/di-base] singleton scoped [same 05]").to.equal(true);
    expect(target03_4, "[core/di-base] singleton scoped [same 03_4]").to.equal(target03_4_1);
    expect(target03_4.x, "[core/di-base] singleton scoped [same dependencies x]").to.equal(
      target03_4_1.x
    );
    expect(target06.x, "[core/di-base] singleton scoped [same dependencies x]").to.equal(
      target03_4_1.x
    );
    expect(
      target05.x === target03_4.x,
      "[core/di-base] singleton scoped [diff dependencies x]"
    ).to.equal(false);
    expect(
      target06.x === target06_x7.x,
      "[core/di-base] singleton scoped [diff dependencies x]"
    ).to.equal(false);
    expect(
      target06.x === target06_x73.x,
      "[core/di-base] singleton scoped [diff dependencies x]"
    ).to.equal(false);
    expect(target07 === target07_2, "[core/di-base] singleton scoped [same instance]").to.equal(
      true
    );

    target03_4_1.x.key = 5;
    expect(target03_4.x.key, "[core/di-base] can't resolve depts").to.equal(5);

    expect(target08.XX.c, "[core/di-base] react singleton dept").to.equal(12345);
    target08.XX.c += 1;

    const target08_2 = con2.get(Test8);
    expect(target08_2.XX.c, "[core/di-base] react singleton dept").to.equal(12346);

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    expect(target08_2["ccccc"], "[core/di-base] react singleton dept").to.equal(undefined);

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    target08["ccccc"] = 242134234;

    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    expect(target08_2["ccccc"], "[core/di-base] react singleton dept").to.equal(242134234);
  });

  it("resolve errors", () => {
    try {
      const invalidCon = new DIContainer();

      invalidCon.register({ token: SB, imp: SB, scope: InjectScope.Scope });
      invalidCon.complete();
    } catch (error) {
      expect(typeof error.message, "[core/di-base] singleton scoped [after edit key]").to.equal(
        "string"
      );
    }
  });

  it("dispose", () => {
    new DI().dispose();
    new DI().dispose("123456");
    const di = new DI();
    di.complete();
    di.createScope("123456", {});
    di.dispose("123456");
  });

  it("others", () => {
    const error1 = DIBASE.invalidOperation("xxxxxx");
    expect(typeof error1.message, "[core/di-base] invalidate errors").to.equal("string");
  });
});
