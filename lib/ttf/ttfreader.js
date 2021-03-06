"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _directory = _interopRequireDefault(require("./table/directory"));

var _support = _interopRequireDefault(require("./table/support"));

var _reader = _interopRequireDefault(require("./reader"));

var _postName = _interopRequireDefault(require("./enum/postName"));

var _error = _interopRequireDefault(require("./error"));

var _compound2simpleglyf = _interopRequireDefault(require("./util/compound2simpleglyf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TTFReader = /*#__PURE__*/function () {
  /**
   * ttf读取器的构造函数
   *
   * @param {Object} options 写入参数
   * @param {boolean} options.hinting 保留hinting信息
   * @param {boolean} options.compound2simple 复合字形转简单字形
   * @constructor
   */
  function TTFReader() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, TTFReader);

    options.subset = options.subset || []; // 子集

    options.hinting = options.hinting || false; // 不保留hints信息

    options.compound2simple = options.compound2simple || false; // 复合字形转简单字形

    this.options = options;
  }
  /**
   * 初始化读取
   *
   * @param {ArrayBuffer} buffer buffer对象
   * @return {Object} ttf对象
   */


  _createClass(TTFReader, [{
    key: "readBuffer",
    value: function readBuffer(buffer) {
      var reader = new _reader["default"](buffer, 0, buffer.byteLength, false);
      var ttf = {}; // version

      ttf.version = reader.readFixed(0);

      if (ttf.version !== 0x1) {
        _error["default"].raise(10101);
      } // num tables


      ttf.numTables = reader.readUint16();

      if (ttf.numTables <= 0 || ttf.numTables > 100) {
        _error["default"].raise(10101);
      } // searchRenge


      ttf.searchRenge = reader.readUint16(); // entrySelector

      ttf.entrySelector = reader.readUint16(); // rengeShift

      ttf.rengeShift = reader.readUint16();
      ttf.tables = new _directory["default"](reader.offset).read(reader, ttf);

      if (!ttf.tables.glyf || !ttf.tables.head || !ttf.tables.cmap || !ttf.tables.hmtx) {
        _error["default"].raise(10204);
      }

      ttf.readOptions = this.options; // 读取支持的表数据

      Object.keys(_support["default"]).forEach(function (tableName) {
        if (ttf.tables[tableName]) {
          var offset = ttf.tables[tableName].offset;
          ttf[tableName] = new _support["default"][tableName](offset).read(reader, ttf);
        }
      });

      if (!ttf.glyf) {
        _error["default"].raise(10201);
      }

      reader.dispose();
      return ttf;
    }
    /**
     * 关联glyf相关的信息
     *
     * @param {Object} ttf ttf对象
     */

  }, {
    key: "resolveGlyf",
    value: function resolveGlyf(ttf) {
      var codes = ttf.cmap;
      var glyf = ttf.glyf;
      var subsetMap = ttf.readOptions.subset ? ttf.subsetMap : null; // 当前ttf的子集列表
      // unicode

      Object.keys(codes).forEach(function (c) {
        var i = codes[c];

        if (subsetMap && !subsetMap[i]) {
          return;
        } // 修正当 cmap 表出现冗余时的报错问题.


        if (!glyf[i]) {
          return;
        }

        if (!glyf[i].unicode) {
          glyf[i].unicode = [];
        }

        glyf[i].unicode.push(+c);
      }); // advanceWidth

      ttf.hmtx.forEach(function (item, i) {
        if (subsetMap && !subsetMap[i]) {
          return;
        }

        glyf[i].advanceWidth = item.advanceWidth;
        glyf[i].leftSideBearing = item.leftSideBearing;
      }); // format = 2 的post表会携带glyf name信息

      if (ttf.post && 2 === ttf.post.format) {
        var nameIndex = ttf.post.nameIndex;
        var names = ttf.post.names;
        nameIndex.forEach(function (nameIndex, i) {
          if (subsetMap && !subsetMap[i]) {
            return;
          }

          if (nameIndex <= 257) {
            glyf[i].name = _postName["default"][nameIndex];
          } else {
            glyf[i].name = names[nameIndex - 258] || '';
          }
        });
      } // 设置了subsetMap之后需要选取subset中的字形
      // 并且对复合字形转换成简单字形


      if (subsetMap) {
        var subGlyf = [];
        Object.keys(subsetMap).forEach(function (i) {
          i = +i;

          if (glyf[i].compound) {
            (0, _compound2simpleglyf["default"])(i, ttf, true);
          }

          subGlyf.push(glyf[i]);
        });
        ttf.glyf = subGlyf; // 转换之后不存在复合字形了

        ttf.maxp.maxComponentElements = 0;
        ttf.maxp.maxComponentDepth = 0;
      }
    }
    /**
     * 清除非必须的表
     *
     * @param {Object} ttf ttf对象
     */

  }, {
    key: "cleanTables",
    value: function cleanTables(ttf) {
      delete ttf.readOptions;
      delete ttf.tables;
      delete ttf.hmtx;
      delete ttf.loca;

      if (ttf.post) {
        delete ttf.post.nameIndex;
        delete ttf.post.names;
      }

      delete ttf.subsetMap; // 不携带hinting信息则删除hint相关表

      if (!this.options.hinting) {
        delete ttf.fpgm;
        delete ttf.cvt;
        delete ttf.prep;
        delete ttf.GPOS;
        delete ttf.kern;
        ttf.glyf.forEach(function (glyf) {
          delete glyf.instructions;
        });
      } // 复合字形转简单字形


      if (this.options.compound2simple && ttf.maxp.maxComponentElements) {
        ttf.glyf.forEach(function (glyf, index) {
          if (glyf.compound) {
            (0, _compound2simpleglyf["default"])(index, ttf, true);
          }
        });
        ttf.maxp.maxComponentElements = 0;
        ttf.maxp.maxComponentDepth = 0;
      }
    }
    /**
     * 获取解析后的ttf文档
     *
     * @param {ArrayBuffer} buffer buffer对象
     * @return {Object} ttf文档
     */

  }, {
    key: "read",
    value: function read(buffer) {
      this.ttf = this.readBuffer(buffer);
      this.resolveGlyf(this.ttf);
      this.cleanTables(this.ttf);
      return this.ttf;
    }
    /**
     * 注销
     */

  }, {
    key: "dispose",
    value: function dispose() {
      delete this.ttf;
      delete this.options;
    }
  }]);

  return TTFReader;
}();

exports["default"] = TTFReader;