"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

var _parse = _interopRequireDefault(require("./cmap/parse"));

var _write = _interopRequireDefault(require("./cmap/write"));

var _sizeof = _interopRequireDefault(require("./cmap/sizeof"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @file cmap 表
 * @author mengke01(kekee000@gmail.com)
 *
 * @see
 * https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cmap.html
 */
var _default = _table["default"].create('cmap', [], {
  read: _parse["default"],
  write: _write["default"],
  size: _sizeof["default"]
});

exports["default"] = _default;