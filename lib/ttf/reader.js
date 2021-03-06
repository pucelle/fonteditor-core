"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lang = require("../common/lang");

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 检查数组支持情况
if (typeof ArrayBuffer === 'undefined' || typeof DataView === 'undefined') {
  throw new Error('not support ArrayBuffer and DataView');
} // 数据类型


var dataType = {
  Int8: 1,
  Int16: 2,
  Int32: 4,
  Uint8: 1,
  Uint16: 2,
  Uint32: 4,
  Float32: 4,
  Float64: 8
};

var Reader = /*#__PURE__*/function () {
  /**
   * 读取器
   *
   * @constructor
   * @param {Array.<byte>} buffer 缓冲数组
   * @param {number} offset 起始偏移
   * @param {number} length 数组长度
   * @param {boolean} littleEndian 是否小尾
   */
  function Reader(buffer, offset, length, littleEndian) {
    _classCallCheck(this, Reader);

    var bufferLength = buffer.byteLength || buffer.length;
    this.offset = offset || 0;
    this.length = length || bufferLength - this.offset;
    this.littleEndian = littleEndian || false;
    this.view = new DataView(buffer, this.offset, this.length);
  }
  /**
   * 读取指定的数据类型
   *
   * @param {string} type 数据类型
   * @param {number=} offset 位移
   * @param {boolean=} littleEndian 是否小尾
   * @return {number} 返回值
   */


  _createClass(Reader, [{
    key: "read",
    value: function read(type, offset, littleEndian) {
      // 使用当前位移
      if (undefined === offset) {
        offset = this.offset;
      } // 使用小尾


      if (undefined === littleEndian) {
        littleEndian = this.littleEndian;
      } // 扩展方法


      if (undefined === dataType[type]) {
        return this['read' + type](offset, littleEndian);
      }

      var size = dataType[type];
      this.offset = offset + size;
      return this.view['get' + type](offset, littleEndian);
    }
    /**
     * 获取指定的字节数组
     *
     * @param {number} offset 偏移
     * @param {number} length 字节长度
     * @return {Array} 字节数组
     */

  }, {
    key: "readBytes",
    value: function readBytes(offset) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (length == null) {
        length = offset;
        offset = this.offset;
      }

      if (length < 0 || offset + length > this.length) {
        _error["default"].raise(10001, this.length, offset + length);
      }

      var buffer = [];

      for (var i = 0; i < length; ++i) {
        buffer.push(this.view.getUint8(offset + i));
      }

      this.offset = offset + length;
      return buffer;
    }
    /**
     * 读取一个string
     *
     * @param {number} offset 偏移
     * @param {number} length 长度
     * @return {string} 字符串
     */

  }, {
    key: "readString",
    value: function readString(offset) {
      var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (length == null) {
        length = offset;
        offset = this.offset;
      }

      if (length < 0 || offset + length > this.length) {
        _error["default"].raise(10001, this.length, offset + length);
      }

      var value = '';

      for (var i = 0; i < length; ++i) {
        var c = this.readUint8(offset + i);
        value += String.fromCharCode(c);
      }

      this.offset = offset + length;
      return value;
    }
    /**
     * 读取一个字符
     *
     * @param {number} offset 偏移
     * @return {string} 字符串
     */

  }, {
    key: "readChar",
    value: function readChar(offset) {
      return this.readString(offset, 1);
    }
    /**
     * 读取一个uint24整形
     *
     * @param {number} offset 偏移
     * @return {number}
     */

  }, {
    key: "readUint24",
    value: function readUint24(offset) {
      var _this$readBytes = this.readBytes(offset || this.offset, 3),
          _this$readBytes2 = _slicedToArray(_this$readBytes, 3),
          i = _this$readBytes2[0],
          j = _this$readBytes2[1],
          k = _this$readBytes2[2];

      return (i << 16) + (j << 8) + k;
    }
    /**
     * 读取fixed类型
     *
     * @param {number} offset 偏移
     * @return {number} float
     */

  }, {
    key: "readFixed",
    value: function readFixed(offset) {
      if (undefined === offset) {
        offset = this.offset;
      }

      var val = this.readInt32(offset, false) / 65536.0;
      return Math.ceil(val * 100000) / 100000;
    }
    /**
     * 读取长日期
     *
     * @param {number} offset 偏移
     * @return {Date} Date对象
     */

  }, {
    key: "readLongDateTime",
    value: function readLongDateTime(offset) {
      if (undefined === offset) {
        offset = this.offset;
      } // new Date(1970, 1, 1).getTime() - new Date(1904, 1, 1).getTime();


      var delta = -2077545600000;
      var time = this.readUint32(offset + 4, false);
      var date = new Date();
      date.setTime(time * 1000 + delta);
      return date;
    }
    /**
     * 跳转到指定偏移
     *
     * @param {number} offset 偏移
     * @return {Object} this
     */

  }, {
    key: "seek",
    value: function seek(offset) {
      if (undefined === offset) {
        this.offset = 0;
      }

      if (offset < 0 || offset > this.length) {
        _error["default"].raise(10001, this.length, offset);
      }

      this.offset = offset;
      return this;
    }
    /**
     * 注销
     */

  }, {
    key: "dispose",
    value: function dispose() {
      delete this.view;
    }
  }]);

  return Reader;
}(); // 直接支持的数据类型


exports["default"] = Reader;
Object.keys(dataType).forEach(function (type) {
  Reader.prototype['read' + type] = (0, _lang.curry)(Reader.prototype.read, type);
});