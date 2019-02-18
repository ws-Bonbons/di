import * as ScopePool from "../../src/core/scope-pool";
import { expect } from "chai";
import { defineUnit } from "../unit";

class Test {}

class Test2 {}

defineUnit(["core/scope-pool", "Core::ScopePool"], () => {
  it("test core/scope-pool exports", () => {
    expect(Object.keys(ScopePool).length, "[core/scope-pool] exports count").to.equal(1);
  });

  it("test core/scope-pool features", () => {
    const instance = new ScopePool.DIScopePool<string, {}>({ scopeId: "123456" });
    expect(Object.keys(instance.metadata).length, "[core/scope-pool.new()].instance ").to.equal(1);
    expect(instance.metadata.scopeId, "[core/scope-pool.new()].instance ").to.equal("123456");
    expect(typeof instance.dispose, "[core/scope-pool.new()].dispose ").to.equal("function");
    expect(typeof instance.setInstance, "[core/scope-pool.new()].setInstance ").to.equal(
      "function"
    );
    expect(typeof instance.getInstance, "[core/scope-pool.new()].getInstance ").to.equal(
      "function"
    );
    expect(typeof instance.update, "[core/scope-pool.new()].update ").to.equal("function");

    const v = new Test();
    instance.setInstance(Test, v);
    expect(instance.getInstance(Test), "[core/scope-pool.new()].update ").to.equal(v);
    expect(instance.getInstance(Test2), "[core/scope-pool.new()].update ").to.equal(undefined);

    const v2 = new Test();
    instance.setInstance(Test, v2);
    expect(instance.getInstance(Test), "[core/scope-pool.new()].update ").to.equal(v2);

    const v3 = new Test2();
    instance.setInstance(Test2, v3);
    expect(instance.getInstance(Test2), "[core/scope-pool.new()].update ").to.equal(v3);

    const v4 = new Test();
    const v5 = new Test2();
    instance.update([[Test, v4], [Test2, v5]]);
    expect(instance.getInstance(Test), "[core/scope-pool.new()].update ").to.equal(v4);
    expect(instance.getInstance(Test2), "[core/scope-pool.new()].update ").to.equal(v5);

    const v6 = new Test2();
    instance.update(token => {
      if (token === Test2) {
        return v6 as any;
      }
    });
    expect(instance.getInstance(Test2), "[core/scope-pool.new()].update ").to.equal(v6);

    instance.setInstance(Test2, undefined);
    expect(instance.getInstance(Test2), "[core/scope-pool.new()].update ").to.equal(null);

    instance.dispose();
    expect(instance.metadata, "[core/scope-pool.new()].update ").to.equal(undefined);
  });
});
