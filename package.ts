import fs = require("fs");
const { exec } = require("child_process");
const pkg = require("./package.json");
const [_, __, rctokrn, rcadd] = process.argv;

const BLOCK = "    ";

const { version } = pkg;
const [main, oldrc] = (version || "").split("-");
let [, rc = 0] = (oldrc || "").split(".");
rc = Number(rc) + Number(rcadd);
pkg.version = `${main}${!!rctokrn ? `-rc.${rc}` : ""}`;
save(pkg, "./package.json");
save(pkg, "./dist/package.json", json => ({
  ...json,
  main: "./index.js",
  types: "./index.d.ts",
  scripts: undefined,
  nyc: undefined,
  devDependencies: {
    ...json.devDependencies,
    chai: undefined,
    mocha: undefined,
    nyc: undefined,
    "@types/chai": undefined,
    "@types/mocha": undefined,
    "source-map-support": undefined,
  },
}));

exec("cd dist && npm publish", (error: any, stdout: string, stderr: string) => {
  if (error) {
    save(pkg, "./package.json", json => ({
      ...json,
      version: `${main}${!!rctokrn ? `-${oldrc}` : ""}`,
    }));
    throw error;
  } else {
    console.log(stdout || "no std output.");
    console.log(stderr || "no std error.");
  }
});

function save(json: any, path: string, transform?: (json: any) => any) {
  let result = { ...json };
  if (transform) {
    result = transform(result);
  }
  fs.writeFileSync(path, JSON.stringify(result, null, BLOCK));
}
