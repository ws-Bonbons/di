import * as declares from "../../src/core/declares";
import { expect } from "chai";
import { defineUnit } from "../unit";

defineUnit(["core/declares", "Core::Declares"], () => {
  it("test core/declares exports", () => {
    expect(Object.keys(declares).length, "[core/declares] exports count").to.equal(4);
  });
});
