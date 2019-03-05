import * as DI from "../src/index";
import { expect } from "chai";
import { defineUnit } from "./unit";

defineUnit(["index", "DI index"], () => {
  it("test index exports", () => {
    expect(Object.keys(DI).length, "[utils] exports count").to.equal(11);
  });
});
