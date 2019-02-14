import * as utils from "./utils";

import { expect } from "chai";
import "mocha";

describe("@bonbons/di/src/utils.ts", () => {
  it("test utils exports", () => {
    expect(Object.keys(utils).length, "[utils] exports count").to.equal(3);
  });

  it("test utils features", () => {
    expect(typeof utils.Colors, "[utils.Colors] 's type ").to.equal("object");
    expect(typeof utils.setColor, "[utils.Colors] 's type ").to.equal("function");
    expect(typeof utils.isFunction, "[utils.Colors] 's type ").to.equal("function");
  });
});
