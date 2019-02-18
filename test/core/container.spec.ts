import * as container from "../../src/core/container";
import { InjectScope } from "../../src/core/declares";
import { expect } from "chai";
import { defineUnit } from "../unit";

class Test {}

class Test2 {}

defineUnit(["core/container", "Core::Container"], () => {
  it("test core/container exports", () => {
    expect(Object.keys(container).length, "[core/container] exports count").to.equal(2);

    it("test core/container.getDependencies features", () => {
      expect(typeof container.getDependencies, "[core/container.getDependencies] type").to.equal(
        "function"
      );
      expect(
        typeof container.getDependencies({}),
        "[core/container.getDependencies()] type"
      ).to.equal("object");
      expect(
        Object.prototype.toString.call(container.getDependencies({})),
        "[core/container.getDependencies()] type"
      ).to.equal("[object Array]");
      expect(
        Object.keys(container.getDependencies({})).length,
        "[core/container.getDependencies()] type"
      ).to.equal(0);
    });
  });

  it("test core/container.DIContainer features", () => {
    const con = new container.DIContainer();

    con.register(Test, new Test(), InjectScope.New);
    con.register(Test2, Test2, InjectScope.New);
    con.register(Test2, new Test2(), InjectScope.New);
    con.register(Test2, {}, InjectScope.New);
    expect(con.count, "[core/container.DIContainer.new()] current count").to.equal(0);

    con.complete();
    expect(con.count, "[core/container.DIContainer.complete()] current count").to.equal(2);

    expect(
      container.DIContainer.isClass(Test),
      "[core/container.DIContainer.isClass()] isClass(Test)"
    ).to.equal(true);
    expect(
      container.DIContainer.isClass({}),
      "[core/container.DIContainer.isClass()] isClass({}"
    ).to.equal(false);
    expect(
      container.DIContainer.isClass(() => 3),
      "[core/container.DIContainer.isFactory()] isClass(() => 3)"
    ).to.equal(false);
    expect(
      container.DIContainer.isFactory(() => 1),
      "[core/container.DIContainer.isFactory()] isFactory(() => 1)"
    ).to.equal(true);
    expect(
      container.DIContainer.isFactory(Test),
      "[core/container.DIContainer.isFactory()] isFactory(Test)"
    ).to.equal(false);
    expect(
      container.DIContainer.isValue(2),
      "[core/container.DIContainer.isValue()] isValue(2)"
    ).to.equal(true);
    expect(
      container.DIContainer.isValue(() => 2),
      "[core/container.DIContainer.isValue()] isValue(() => 2)"
    ).to.equal(false);
    expect(
      container.DIContainer.isValue(Test),
      "[core/container.DIContainer.isValue()] isValue(Test)"
    ).to.equal(false);
  });
});
