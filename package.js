const fs = require("fs");
const { exec } = require("child_process");
const package = require("./package.json");
const [_, __, rctokrn, rcadd] = process.argv;

const { version } = package;
const [main, oldrc] = (version || "").split("-");
let [___, rc = 0] = (oldrc || "").split(".");
rc = Number(rc) + Number(rcadd);
package.version = `${main}${!!rctokrn ? `-rc.${rc}` : ""}`;
fs.writeFileSync("./package.json", JSON.stringify(package, null, "  "));
fs.writeFileSync(
  "./dist/package.json",
  JSON.stringify(
    {
      ...package,
      main: "./index.js",
    },
    null,
    "  "
  )
);

exec("cd dist && npm publish", (error, stdout, stderr) => {
  if (error) {
    package.version = `${main}${!!rctokrn ? `-${oldrc}` : ""}`;
    fs.writeFileSync("./package.json", JSON.stringify(package, null, "  "));
    throw error;
  } else {
    console.log(stdout || "no std output.");
    console.log(stderr || "no std error.");
  }
});
