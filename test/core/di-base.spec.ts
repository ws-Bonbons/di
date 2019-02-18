import * as DIBASE from "../../src/core/di-base";
import {
  ImplementFactory,
  DIContainerEntry,
  InjectScope,
  ImplementDIValue,
  InjectDIToken,
} from "../../src/core/declares";
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

class Test {}

defineUnit(["core/di-base", "Core::DiBase"], () => {
  it("test core/di-base exports", () => {
    expect(Object.keys(DIBASE).length, "[core/di-base] exports count").to.equal(4);
  });

  const con = new DI();
  it("test core/di-base feature", () => {
    try {
      con.register(Test, Test, InjectScope.Scope);
    } catch (e) {
      expect(e.message, "[core/di-base] register").to.equal("Method not implemented.");
    }
  });

  it("test core/di-base feature", () => {
    try {
      con.createFactory({
        getInstance: () => 2,
        imp: () => 1,
        level: 1,
        fac: () => 5,
        token: Test,
        depts: [],
        scope: InjectScope.Scope,
      });
    } catch (e) {
      expect(e.message, "[core/di-base] createFactory").to.equal("Method not implemented.");
    }
  });
});
