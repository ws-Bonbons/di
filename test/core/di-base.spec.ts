import * as DIBASE from "../../src/core/di-base";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/di-base", "Core::DiBase"], () => {
  it("test core/di-base exports", () => {
    expect(Object.keys(DIBASE).length, "[core/di-base] exports count").to.equal(3);
  });
});
