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
 * This hook memoizes the list of query configs that are returned form the `mapPropsToConfigs`
 * function. It also transforms the query configs to set `retry` to `true` and pass a
 * synchronous callback to track pending state.
 *
 * `mapPropsToConfigs` may return null, undefined, a single query config,
 * or a list of query configs. null and undefined values are ignored, and single query configs are
 * normalized to be lists.
 *
 * Memoization is handled by comparing query keys. If the list changes in size, or any query config
 * in the list's query key changes, an entirely new list of query configs is returned.
 */


var useMemoizedQueryConfigs = function useMemoizedQueryConfigs(providedQueryConfigs) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : identity;
  var queryConfigs = providedQueryConfigs ? providedQueryConfigs.map(function (queryConfig) {
    var queryKey = (0, _reduxQuery.getQueryKey)(queryConfig);

    if (queryKey) {
      return transform(queryConfig);
    }
  }).filter(Boolean) : [];

  var _React$useState = React.useState(queryConfigs),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      memoizedQueryConfigs = _React$useState2[0],
      setMemoizedQueryConfigs = _React$useState2[1];

  var previousQueryConfigs = React.useRef(queryConfigs);
  var previousQueryKeys = React.useRef(queryConfigs.map(_reduxQuery.getQueryKey).filter(Boolean));
  React.useEffect(function () {
    var queryKeys = queryConfigs.map(_reduxQuery.getQueryKey).filter(Boolean);

    if (queryKeys.length !== previousQueryKeys.current.length || queryKeys.some(function (queryKey, i) {
      return previousQueryKeys.current[i] !== queryKey;
    }) || (0, _headers.headersChanged)(queryConfigs, previousQueryConfigs.current)) {
      previousQueryKeys.current = queryKeys;
      previousQueryConfigs.current = queryConfigs;
      setMemoizedQueryConfigs(queryConfigs);
    }
  }, [queryConfigs, previousQueryConfigs]);
  return memoizedQueryConfigs;
};

var _default = useMemoizedQueryConfigs;
exports["default"] = _default;