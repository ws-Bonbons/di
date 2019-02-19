import * as DIBASE from "../../src/core/di-base";
import {
  ImplementFactory,
  DIContainerEntry,
  InjectScope,
  ImplementDIValue,
  InjectDIToken,
  PARAMS_META_KEY,
} from "../../src/core/declares";
import { DIContainer } from "../../src/core/container";
import { expect } from "chai";
import { defineUnit } from "../unit";

class DI extends DIBASE.BaseDIContainer {
  public register<K, V>(
    token: InjectDIToken<K>,
    imp: ImplementDIValue<V, string>,
    scope: InjectScope
  ): void {
    throw new Error("Method not implemented.");
  }

  public createFactory<T>(imp: DIContainerEntry<T>): ImplementFactory<T, string> {
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

const dps4 = Reflect.getMetadata(PARAMS_META_KEY, Test4) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dps4, Test], Test4);

const dps5 = Reflect.getMetadata(PARAMS_META_KEY, Test5) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dps5, Test, Test4], Test5);

class SB {
  // tslint:disable-next-line: ban-types
  constructor(private x: Object) {}
}

const dpsSB = Reflect.getMetadata(PARAMS_META_KEY, SB) || [];
Reflect.defineMetadata(PARAMS_META_KEY, [...dps5, Object], SB);

defineUnit(["core/di-base", "Core::DiBase"], () => {
  it("test core/di-base exports", () => {
    expect(Object.keys(DIBASE).length, "[core/di-base] exports count").to.equal(4);
  });

  const con = new DI();
  it("test core/di-base feature : abstract register", () => {
    try {
      con.register(Test, Test, InjectScope.Scope);
    } catch (e) {
      expect(e.message, "[core/di-base] register").to.equal("Method not implemented.");
    }
  });

  it("test core/di-base feature : abstract createFactory", () => {
    try {
      con.createFactory({
        getInstance: () => 2,
        imp: () => 1,
        level: 1,
        fac: () => 5,
        // @ts-ignore
        token: Test,
        depts: [],
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
    con2.register(Test, Test, InjectScope.Scope);
    con2.register(Test3, () => xT3, InjectScope.Scope);
    con2.register(Test4, Test4, InjectScope.Scope);
    con2.register(Test5, xT5, InjectScope.Scope);

    const target0x = con2.get(Test, "123456");

    expect(target0x, "[core/di-base] singleton scoped [null no complete]").to.equal(null);

    con2.complete();

    const kvs = con2.getConfig();

    expect(Object.keys(kvs).length, "[core/di-base] singleton scoped [null no complete]").to.equal(
      4
    );

    const target01 = con2.get(Test, "123456");
    const target02 = con2.get(Test, "123456");
    const target03 = con2.get(Test2, "123456");
    const target04 = con2.get(Test3, "123456");
    const target03_4 = con2.get(Test4, "123456");
    const target03_4_1 = con2.get(Test4, "123456");
    const target05 = con2.get(Test5, "123456");

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
  });

  con2 = new DIContainer();

  it("test core/di-base feature : proxy mode", () => {
    const xT3 = new Test3();
    const xT5 = new Test5(new Test(), new Test4(new Test()));

    con2.createScope("123456", { k: 666 });
    con2.register(Test, Test, InjectScope.Scope);
    con2.register(Test3, () => xT3, InjectScope.Scope);
    con2.register(Test4, Test4, InjectScope.Scope);
    con2.register(Test5, xT5, InjectScope.Scope);

    const target0x = con2.get(Test, "123456");

    expect(target0x, "[core/di-base] singleton scoped [null no complete]").to.equal(null);

    con2.resetConfigs({ type: "proxy" });
    con2.complete();

    const kvs = con2.getConfig();

    expect(Object.keys(kvs).length, "[core/di-base] singleton scoped [null no complete]").to.equal(
      4
    );

    const target01 = con2.get(Test, "123456");
    const target02 = con2.get(Test, "123456");
    const target03 = con2.get(Test2, "123456");
    const target04 = con2.get(Test3, "123456");
    const target03_4 = con2.get(Test4, "123456");
    const target03_4_1 = con2.get(Test4, "123456");
    const target05 = con2.get(Test5, "123456");

    expect(target01, "[core/di-base] singleton scoped [same]").to.equal(target02);

    expect(target03, "[core/di-base] singleton scoped [null]").to.equal(null);
    expect(target04 === xT3, "[core/di-base] singleton scoped [same 04]").to.equal(false); // proxy with instance.
    expect(target05 === xT5, "[core/di-base] singleton scoped [same 05]").to.equal(false);
    expect(target05.x === xT5.x, "[core/di-base] singleton scoped [same 05]").to.equal(true);
    expect(target03_4, "[core/di-base] singleton scoped [same 03_4]").to.equal(target03_4_1);
    expect(target03_4.x, "[core/di-base] singleton scoped [same dependencies x]").to.equal(
      target03_4_1.x
    );
    expect(
      target05.x === target03_4.x,
      "[core/di-base] singleton scoped [diff dependencies x]"
    ).to.equal(false);

    target03_4_1.x.key = 5;
    expect(target03_4.x.key, "[core/di-base] can't resolve depts").to.equal(5);
  });

  it("resolve errors", () => {
    try {
      const invalidCon = new DIContainer();

      invalidCon.register(SB, SB, InjectScope.Scope);
      invalidCon.complete();
    } catch (error) {
      expect(typeof error.message, "[core/di-base] singleton scoped [after edit key]").to.equal(
        "string"
      );
    }
  });

  it("others", () => {
    const error1 = DIBASE.invalidOperation("xxxxxx");
    expect(typeof error1.message, "[core/di-base] invalidate errors").to.equal("string");
  });
});
