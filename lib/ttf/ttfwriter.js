"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _writer = _interopRequireDefault(require("./writer"));

var _directory = _interopRequireDefault(require("./table/directory"));

var _support = _interopRequireDefault(require("./table/support"));

var _checkSum = _interopRequireDefault(require("./util/checkSum"));

var _error = _interopRequireDefault(require("./error"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// 支持写的表, 注意表顺序
var SUPPORT_TABLES = ['OS/2', 'cmap', 'glyf', 'head', 'hhea', 'hmtx', 'loca', 'maxp', 'name', 'post'];

var TTFWriter = /*#__PURE__*/function () {
  function TTFWriter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TTFWriter);

    this.options = {
      hinting: options.hinting || false,
      // 不保留hints信息
      support: options.support // 自定义的导出表结构，可以自己修改某些表项目

    };
  }
  /**
   * 处理ttf结构，以便于写
   *
   * @param {ttfObject} ttf ttf数据结构
   */


  _createClass(TTFWriter, [{
    key: "resolveTTF",
    value: function resolveTTF(ttf) {
      // 头部信息
      ttf.version = ttf.version || 0x1;
      ttf.numTables = ttf.writeOptions.tables.length;
      ttf.entrySelector = Math.floor(Math.log(ttf.numTables) / Math.LN2);
      ttf.searchRange = Math.pow(2, ttf.entrySelector) * 16;
      ttf.rangeShift = ttf.numTables * 16 - ttf.searchRange; // 重置校验码

      ttf.head.checkSumAdjustment = 0;
      ttf.head.magickNumber = 0x5F0F3CF5;

      if (typeof ttf.head.created === 'string') {
        ttf.head.created = /^\d+$/.test(ttf.head.created) ? +ttf.head.created : Date.parse(ttf.head.created);
      }

      if (typeof ttf.head.modified === 'string') {
        ttf.head.modified = /^\d+$/.test(ttf.head.modified) ? +ttf.head.modified : Date.parse(ttf.head.modified);
      } // 重置日期


      if (!ttf.head.created) {
        ttf.head.created = Date.now();
      }

      if (!ttf.head.modified) {
        ttf.head.modified = ttf.head.created;
      }

      var checkUnicodeRepeat = {}; // 检查是否有重复代码点
      // 将glyf的代码点按小到大排序

      ttf.glyf.forEach(function (glyf, index) {
        if (glyf.unicode) {
          glyf.unicode = glyf.unicode.sort();
          glyf.unicode.forEach(function (u) {
            if (checkUnicodeRepeat[u]) {
              _error["default"].raise({
                number: 10200,
                data: index
              }, index);
            } else {
              checkUnicodeRepeat[u] = true;
            }
          });
        }
      });
    }
    /**
     * 写ttf文件
     *
     * @param {ttfObject} ttf ttf数据结构
     * @return {ArrayBuffer} 字节流
     */

  }, {
    key: "dump",
    value: function dump(ttf) {
      // 用来做写入缓存的对象，用完后删掉
      ttf.support = Object.assign({}, this.options.support); // head + directory

      var ttfSize = 12 + ttf.numTables * 16;
      var ttfHeadOffset = 0; // 记录head的偏移
      // 构造tables

      ttf.support.tables = [];
      ttf.writeOptions.tables.forEach(function (tableName) {
        var offset = ttfSize;
        var TableClass = _support["default"][tableName];
        var tableSize = new TableClass().size(ttf); // 原始的表大小

        var size = tableSize; // 对齐后的表大小

        if (tableName === 'head') {
          ttfHeadOffset = offset;
        } // 4字节对齐


        if (size % 4) {
          size += 4 - size % 4;
        }

        ttf.support.tables.push({
          name: tableName,
          checkSum: 0,
          offset: offset,
          length: tableSize,
          size: size
        });
        ttfSize += size;
      });
      var writer = new _writer["default"](new ArrayBuffer(ttfSize)); // 写头部

      writer.writeFixed(ttf.version);
      writer.writeUint16(ttf.numTables);
      writer.writeUint16(ttf.searchRange);
      writer.writeUint16(ttf.entrySelector);
      writer.writeUint16(ttf.rangeShift); // 写表偏移

      !new _directory["default"]().write(writer, ttf); // 写支持的表数据

      ttf.support.tables.forEach(function (table) {
        var tableStart = writer.offset;
        var TableClass = _support["default"][table.name];
        !new TableClass().write(writer, ttf);

        if (table.length % 4) {
          // 对齐字节
          writer.writeEmpty(4 - table.length % 4);
        } // 计算校验和


        table.checkSum = (0, _checkSum["default"])(writer.getBuffer(), tableStart, table.size);
      }); // 重新写入每个表校验和

      ttf.support.tables.forEach(function (table, index) {
        var offset = 12 + index * 16 + 4;
        writer.writeUint32(table.checkSum, offset);
      }); // 写入总校验和

      var ttfCheckSum = (0xB1B0AFBA - (0, _checkSum["default"])(writer.getBuffer()) + 0x100000000) % 0x100000000;
      writer.writeUint32(ttfCheckSum, ttfHeadOffset + 8);
      delete ttf.writeOptions;
      delete ttf.support;
      var buffer = writer.getBuffer();
      writer.dispose();
      return buffer;
    }
    /**
     * 对ttf的表进行评估，标记需要处理的表
     *
     * @param  {Object} ttf ttf对象
     */

  }, {
    key: "prepareDump",
    value: function prepareDump(ttf) {
      if (!ttf.glyf || ttf.glyf.length === 0) {
        _error["default"].raise(10201);
      }

      if (!ttf['OS/2'] || !ttf.head || !ttf.name) {
        _error["default"].raise(10204);
      }

      var tables = SUPPORT_TABLES.slice(0);
      ttf.writeOptions = {}; // hinting tables direct copy

      if (this.options.hinting) {
        ['cvt', 'fpgm', 'prep', 'gasp', 'GPOS', 'kern'].forEach(function (table) {
          if (ttf[table]) {
            tables.push(table);
          }
        });
      }

      ttf.writeOptions.hinting = !!this.options.hinting;
      ttf.writeOptions.tables = tables.sort();
    }
    /**
     * 写一个ttf字体结构
     *
     * @param {Object} ttf ttf数据结构
     * @return {ArrayBuffer} 缓冲数组
     */

  }, {
    key: "write",
    value: function write(ttf) {
      this.prepareDump(ttf);
      this.resolveTTF(ttf);
      var buffer = this.dump(ttf);
      return buffer;
    }
    /**
     * 注销
     */

  }, {
    key: "dispose",
    value: function dispose() {
      delete this.options;
    }
  }]);

  return TTFWriter;
}();

exports["default"] = TTFWriter;