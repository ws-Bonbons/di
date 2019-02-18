import * as config from "../../src/core/config";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/config", "Core::Config"], () => {
  it("test core/config exports", () => {
    expect(Object.keys(config).length, "[core/config] exports count").to.equal(1);
  });

  it("test core/config features", () => {
    const instance = new config.ConfigCollection();
    expect(instance.toArray().length, "[core/config.new()].toArray().length count ").to.equal(0);

    const value01 = instance.get({ key: Symbol.for("123456") });
    expect(value01, "[core/config.get()] value check ").to.equal(undefined);

    instance.set({ key: Symbol.for("123456") }, 123456);
    const value02 = instance.get({ key: Symbol.for("123456") });
    expect(value02, "[core/config.get()] value check ").to.equal(123456);

    instance.set({ key: Symbol.for("123456") }, 654321);
    const value03 = instance.get({ key: Symbol.for("123456") });
    expect(value03, "[core/config.get()] value check ").to.equal(654321);
  });
});
