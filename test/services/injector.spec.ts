import * as injector from "../../src/services/injector";
import { expect } from "chai";
import { defineUnit } from "../unit";
import { DIContainer } from "../../src/core/container";

defineUnit(["services/injector", "Core::Injector"], () => {
  it("test core/singleton exports", () => {
    expect(Object.keys(injector).length, "[core/injector] exports count").to.equal(2);
  });

  it("test core/injector features", () => {
    const di = new DIContainer<string, {}>();
    di.complete();
    const ijt = di.get(injector.Injector);
    const resolver = ijt.get(injector.Injector);
    // @ts-ignore
    // tslint:disable-next-line: no-string-literal
    resolver["INTERNAL_dispose"]();
  });
});
