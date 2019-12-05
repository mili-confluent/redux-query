"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Unlike `useCallback`, `useConstCallback` guarantees memoization, which can be relied upon to
 * explicitly control when certain side effects occur when used as a dependency for `useEffect`
 * hooks.
 */
var useConstCallback = function useConstCallback(callback) {
  var ref = _react["default"].useRef(callback);

  return ref.current;
};

var _default = useConstCallback;
exports["default"] = _default;