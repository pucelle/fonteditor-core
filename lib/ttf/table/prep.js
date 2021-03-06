"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _table = _interopRequireDefault(require("./table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @file prep表
 * @author mengke01(kekee000@gmail.com)
 *
 * @reference: http://www.microsoft.com/typography/otspec140/prep.htm
 */
var _default = _table["default"].create('prep', [], {
  read: function read(reader, ttf) {
    var length = ttf.tables.prep.length;
    return reader.readBytes(this.offset, length);
  },
  write: function write(writer, ttf) {
    if (ttf.prep) {
      writer.writeBytes(ttf.prep, ttf.prep.length);
    }
  },
  size: function size(ttf) {
    return ttf.prep ? ttf.prep.length : 0;
  }
});

exports["default"] = _default;