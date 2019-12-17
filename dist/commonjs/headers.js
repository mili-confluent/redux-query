"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headersChanged = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var headersChanged = function headersChanged(queryConfigs, previousQueryConfigs) {
  for (var i = 0; i < queryConfigs.length; i++) {
    if (previousQueryConfigs[i] && queryConfigs[i] && previousQueryConfigs[i].options && queryConfigs[i].options) {
      var prevHeaders = previousQueryConfigs[i].options.headers;
      var headers = queryConfigs[i].options.headers;

      if (prevHeaders != null && headers != null) {
        var _ret = function () {
          var prevHeaderValues = Object.values(prevHeaders);
          var diffHeaders = Object.values(headers).some(function (value, i) {
            return prevHeaderValues[i] != value;
          });

          if (diffHeaders) {
            return {
              v: true
            };
          }
        }();

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
  }
};

exports.headersChanged = headersChanged;