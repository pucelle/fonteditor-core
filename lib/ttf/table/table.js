"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _struct = _interopRequireDefault(require("./struct"));

var _error = _interopRequireDefault(require("../error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * 读取表结构
 *
 * @param {Reader} reader reader对象
 * @return {Object} 当前对象
 */
function read(reader) {
  var offset = this.offset;

  if (undefined !== offset) {
    reader.seek(offset);
  }

  var me = this;
  this.struct.forEach(function (item) {
    var name = item[0];
    var type = item[1];

    switch (type) {
      case _struct["default"].Int8:
      case _struct["default"].Uint8:
      case _struct["default"].Int16:
      case _struct["default"].Uint16:
      case _struct["default"].Int32:
      case _struct["default"].Uint32:
        var typeName = _struct["default"].names[type];
        me[name] = reader.read(typeName);
        break;

      case _struct["default"].Fixed:
        me[name] = reader.readFixed();
        break;

      case _struct["default"].LongDateTime:
        me[name] = reader.readLongDateTime();
        break;

      case _struct["default"].Bytes:
        me[name] = reader.readBytes(reader.offset, item[2] || 0);
        break;

      case _struct["default"].Char:
        me[name] = reader.readChar();
        break;

      case _struct["default"].String:
        me[name] = reader.readString(reader.offset, item[2] || 0);
        break;

      default:
        _error["default"].raise(10003, name, type);

    }
  });
  return this.valueOf();
}
/**
 * 写表结构
 *
 * @param {Object} writer writer对象
 * @param {Object} ttf 已解析的ttf对象
 *
 * @return {Writer} 返回writer对象
 */


function write(writer, ttf) {
  var table = ttf[this.name];

  if (!table) {
    _error["default"].raise(10203, this.name);
  }

  this.struct.forEach(function (item) {
    var name = item[0];
    var type = item[1];

    switch (type) {
      case _struct["default"].Int8:
      case _struct["default"].Uint8:
      case _struct["default"].Int16:
      case _struct["default"].Uint16:
      case _struct["default"].Int32:
      case _struct["default"].Uint32:
        var typeName = _struct["default"].names[type];
        writer.write(typeName, table[name]);
        break;

      case _struct["default"].Fixed:
        writer.writeFixed(table[name]);
        break;

      case _struct["default"].LongDateTime:
        writer.writeLongDateTime(table[name]);
        break;

      case _struct["default"].Bytes:
        writer.writeBytes(table[name], item[2] || 0);
        break;

      case _struct["default"].Char:
        writer.writeChar(table[name]);
        break;

      case _struct["default"].String:
        writer.writeString(table[name], item[2] || 0);
        break;

      default:
        _error["default"].raise(10003, name, type);

    }
  });
  return writer;
}
/**
 * 获取ttf表的size大小
 *
 * @param {string} name 表名
 * @return {number} 表大小
 */


function size() {
  var sz = 0;
  this.struct.forEach(function (item) {
    var type = item[1];

    switch (type) {
      case _struct["default"].Int8:
      case _struct["default"].Uint8:
        sz += 1;
        break;

      case _struct["default"].Int16:
      case _struct["default"].Uint16:
        sz += 2;
        break;

      case _struct["default"].Int32:
      case _struct["default"].Uint32:
      case _struct["default"].Fixed:
        sz += 4;
        break;

      case _struct["default"].LongDateTime:
        sz += 8;
        break;

      case _struct["default"].Bytes:
        sz += item[2] || 0;
        break;

      case _struct["default"].Char:
        sz += 1;
        break;

      case _struct["default"].String:
        sz += item[2] || 0;
        break;

      default:
        _error["default"].raise(10003, name, type);

    }
  });
  return sz;
}
/**
 * 获取对象的值
 *
 * @return {*} 当前对象的值
 */


function valueOf() {
  var val = {};
  var me = this;
  this.struct.forEach(function (item) {
    val[item[0]] = me[item[0]];
  });
  return val;
}

var _default = {
  read: read,
  write: write,
  size: size,
  valueOf: valueOf,

  /**
   * 创建一个表结构
   *
   * @param {string} name 表名
   * @param {Object} struct 表结构
   * @param {Object} prototype 原型
   * @return {Function} 表构造函数
   */
  create: function create(name, struct, prototype) {
    var Table = function Table(offset) {
      _classCallCheck(this, Table);

      this.name = name;
      this.struct = struct;
      this.offset = offset;
    };

    Table.prototype.read = read;
    Table.prototype.write = write;
    Table.prototype.size = size;
    Table.prototype.valueOf = valueOf;
    Object.assign(Table.prototype, prototype);
    return Table;
  }
};
exports["default"] = _default;