import * as singleton from "../../src/core/singleton";
import { expect } from "chai";
import { defineUnit } from "../unit";

class Y {}

class X extends singleton.SingletonBasement<{ x: Y }> {}

// @ts-ignore
// tslint:disable-next-line: no-string-literal
X["prototype"]["@watch"] = {
  x: { token: Y },
};

defineUnit(["core/singleton", "Core::Singleton"], () => {
  it("test core/singleton exports", () => {
    expect(Object.keys(singleton).length, "[core/singleton] exports count").to.equal(2);
  });

  it("test core/singleton features", () => {
    const x = new X();
    x.OnUpdate({ x: new Y() });
    expect(Object.keys(x["@delegate"]).length, "[core/singleton] exports count").to.equal(1);
    // tslint:disable-next-line: no-string-literal
    expect(Object.keys(x["delegate"]).length, "[core/singleton] exports count").to.equal(1);
  });
});
