const { run } = require("@bigmogician/publisher");

module.exports = (args = {}) =>
  run({
    debug: true,
    rc: false,
    add: 1,
    whiteSpace: "    ",
    rootPath: ".",
    outDist: "dist",
    outTransform: json => ({
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
        "@bigmogician/publisher": undefined,
        "@types/chai": undefined,
        "@types/mocha": undefined,
        "source-map-support": undefined,
      },
    }),
    ...args,
  });
