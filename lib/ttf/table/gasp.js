"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @file gasp 表
 * 对于需要hinting的字号需要这个表，否则会导致错误
 * @author mengke01(kekee000@gmail.com)
 * reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gasp.html
 */
var _default = _table["default"].create('gasp', [], {
  read: function read(reader, ttf) {
    var length = ttf.tables.gasp.length;
    return reader.readBytes(this.offset, length);
  },
  write: function write(writer, ttf) {
    if (ttf.gasp) {
      writer.writeBytes(ttf.gasp, ttf.gasp.length);
    }
  },
  size: function size(ttf) {
    return ttf.gasp ? ttf.gasp.length : 0;
  }
});

exports["default"] = _default;