"use strict";
// export * from "./container";
// export * from "./config";
// export * from "./tokens";
// export * from "./reflect";
// export * from "./dependency";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./public-api"));
const PrivateAPI = __importStar(require("./private-api"));
exports.PrivateDI = PrivateAPI;
//# sourceMappingURL=index.js.map