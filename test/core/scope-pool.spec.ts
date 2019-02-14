import * as ScopePool from "../../src/core/scope-pool";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/scope-pool", "Core::ScopePool"], () => {
  it("test core/scope-pool exports", () => {
    expect(Object.keys(ScopePool).length, "[core/scope-pool] exports count").to.equal(1);
  });
});
