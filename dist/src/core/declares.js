"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Built-in metadata type: context type of the record attribute method */
exports.TYPE_META_KEY = "design:type";
/** Built-in metadata type: params types of the record attribute method */
exports.PARAMS_META_KEY = "design:paramtypes";
/** Built-in metadata type: return type of the record attribute method */
exports.RETURN_META_KEY = "design:returntype";
/**
 * 描述了依赖项在整个容器中的生命周期情况
 * @description
 * @export
 * @enum {number}
 */
var InjectScope;
(function (InjectScope) {
    InjectScope[InjectScope["Singleton"] = 0] = "Singleton";
    InjectScope[InjectScope["Scope"] = 1] = "Scope";
    InjectScope[InjectScope["New"] = 2] = "New";
})(InjectScope = exports.InjectScope || (exports.InjectScope = {}));
//# sourceMappingURL=declares.js.map