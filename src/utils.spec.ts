import * as utils from "./utils";

import { expect } from "chai";
import "mocha";

describe("@bonbons/di/src/utils.ts", () => {
  it("test utils exports", () => {
    expect(Object.keys(utils).length, "[utils] exports count").to.equal(3);
  });

  it("test utils.Colors", () => {
    expect(typeof utils.Colors, "[utils.Colors] 's type ").to.equal("object");
  });

  it("test utils.setColor", () => {
    expect(typeof utils.setColor, "[utils.setColor] 's type ").to.equal("function");
    expect(typeof utils.setColor("a", "b"), "[utils.setColor] 's return type ").to.equal("string");
  });

  it("test utils.isFunction", () => {
    expect(typeof utils.isFunction, "[utils.isFunction] 's type ").to.equal("function");
    expect(typeof utils.isFunction({}), "[utils.isFunction] 's return type ").to.equal("boolean");
    expect(utils.isFunction(() => 123), "[utils.isFunction] check {function} ").to.equal(true);
    expect(utils.isFunction(Object), "[utils.isFunction] check {Object} ").to.equal(false);
    expect(
      utils.isFunction({ prototype: Object.prototype }),
      "[utils.isFunction] check {{ prototype: Object.prototype }} "
    ).to.equal(false);
  });
});
