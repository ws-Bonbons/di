"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = {
    reset: "\x1b[0m",
    red: "\x1b[31m\x1b[1m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    white: "\x1b[37m"
};
function setColor(name, value) {
    return `${exports.Colors[name]}${value}${exports.Colors.reset}`;
}
exports.setColor = setColor;
function isFunction(target) {
    return Object.prototype.toString.call(target) === "[object Function]" && !target.prototype && target !== Object;
}
exports.isFunction = isFunction;
//# sourceMappingURL=utils.js.map