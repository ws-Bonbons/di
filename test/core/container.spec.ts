import * as container from "../../src/core/container";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/container", "Core::Container"], () => {
  it("test core/container exports", () => {
    expect(Object.keys(container).length, "[core/container] exports count").to.equal(2);
  });
});
