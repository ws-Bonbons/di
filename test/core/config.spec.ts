import * as config from "../../src/core/config";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/config", "Core::Config"], () => {
  it("test core/config exports", () => {
    expect(Object.keys(config).length, "[core/config] exports count").to.equal(1);
  });
});
