"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @file GPOS
 * @author fr33z00(https://github.com/fr33z00)
 *
 * @reference: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6cvt.html
 */
var _default = _table["default"].create('GPOS', [], {
  read: function read(reader, ttf) {
    var length = ttf.tables.GPOS.length;
    return reader.readBytes(this.offset, length);
  },
  write: function write(writer, ttf) {
    if (ttf.GPOS) {
      writer.writeBytes(ttf.GPOS, ttf.GPOS.length);
    }
  },
  size: function size(ttf) {
    return ttf.GPOS ? ttf.GPOS.length : 0;
  }
});

exports["default"] = _default;