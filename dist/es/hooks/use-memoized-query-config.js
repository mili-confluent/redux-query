"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _reduxQuery = require("redux-query");

var _headers = require("../headers");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var identity = function identity(x) {
  return x;
};
/**
 * Other hooks are guaranteed to only receive a new Redux action if and only if the query key of
 * the provided queryConfig changes.
 */


var useMemoizedQueryConfig = function useMemoizedQueryConfig(providedQueryConfig) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;

  var _React$useState = React.useState(providedQueryConfig ? transform(providedQueryConfig) : null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      queryConfig = _React$useState2[0],
      setQueryConfig = _React$useState2[1];

  var previousQueryKey = React.useRef((0, _reduxQuery.getQueryKey)(providedQueryConfig));
  var previousQueryConfig = React.useRef(providedQueryConfig);
  React.useEffect(function () {
    var queryKey = (0, _reduxQuery.getQueryKey)(providedQueryConfig);

    if (queryKey !== previousQueryKey.current || (0, _headers.headersChanged)([queryConfig], [previousQueryConfig.current])) {
      previousQueryKey.current = queryKey;
      previousQueryConfig.current = queryConfig;
      setQueryConfig(providedQueryConfig ? transform(providedQueryConfig) : null);
    }
  }, [providedQueryConfig, transform]);
  return queryConfig;
};

var _default = useMemoizedQueryConfig;
exports["default"] = _default;