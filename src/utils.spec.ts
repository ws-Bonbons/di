import * as utils from "./utils";

import { expect } from "chai";
import "mocha";

describe("@bonbons/di/src/utils.ts", () => {
  it("test utils exports", () => {
    expect(Object.keys(utils).length, "[utils] exports count").to.equal(3);
  });

  it("test utils features", () => {
    expect(typeof utils.Colors, "[utils.Colors] 's type ").to.equal("object");

    expect(typeof utils.setColor, "[utils.setColor] 's type ").to.equal("function");
    expect(typeof utils.setColor("a", "b"), "[utils.setColor] 's return type ").to.equal("string");

    expect(typeof utils.isFunction, "[utils.isFunction] 's type ").to.equal("function");
    expect(typeof utils.isFunction({}), "[utils.isFunction] 's return type ").to.equal("boolean");
  });
});
