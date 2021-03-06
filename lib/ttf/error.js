"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _string = _interopRequireDefault(require("../common/string"));

var _i18n = _interopRequireDefault(require("./i18n"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  /**
   * 抛出一个异常
   *
   * @param  {Object} e 异常号或者异常对象
   * @param  {...Array} fargs args 参数
   *
   * 例如：
   * e = 1001
   * e = {
   *     number: 1001,
   *     data: 错误数据
   * }
   */
  raise: function raise(e) {
    var number;
    var data;

    if (_typeof(e) === 'object') {
      number = e.number || 0;
      data = e.data;
    } else {
      number = e;
    }

    var message = _i18n["default"].lang[number];

    for (var _len = arguments.length, fargs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      fargs[_key - 1] = arguments[_key];
    }

    if (fargs.length > 0) {
      var args = _typeof(fargs[0]) === 'object' ? fargs[0] : fargs;
      message = _string["default"].format(message, args);
    }

    var event = new Error(message);
    event.number = number;

    if (data) {
      event.data = data;
    }

    throw event;
  }
};
exports["default"] = _default;