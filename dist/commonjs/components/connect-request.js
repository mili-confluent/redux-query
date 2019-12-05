"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _hoistNonReactStatics = _interopRequireDefault(require("hoist-non-react-statics"));

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reduxQuery = require("redux-query");

var _useConstCallback = _interopRequireDefault(require("../hooks/use-const-callback"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var normalizeToArray = function normalizeToArray(maybe) {
  return (Array.isArray(maybe) ? maybe : [maybe]).filter(Boolean);
};

var difference = function difference(a, b) {
  var bSet = new Set(b);
  return a.filter(function (x) {
    return !bSet.has(x);
  });
};

var diffQueryConfigs = function diffQueryConfigs(prevQueryConfigs, queryConfigs) {
  var prevQueryKeys = prevQueryConfigs.map(function (config) {
    return (0, _reduxQuery.getQueryKey)(config);
  });
  var queryKeys = queryConfigs.map(function (config) {
    return (0, _reduxQuery.getQueryKey)(config);
  });
  var queryConfigByQueryKey = queryKeys.reduce(function (accum, queryKey, i) {
    var queryConfig = queryConfigs[i];

    if (queryConfig) {
      accum.set(queryKey, queryConfig);
    }

    return accum;
  }, new Map()); // Keys that existed before that no longer exist, should be subject to cancellation

  var cancelKeys = difference(prevQueryKeys, queryKeys).filter(Boolean); // Keys that are new, should be subject to a new request

  var requestKeys = difference(queryKeys, prevQueryKeys).filter(Boolean);
  var requestQueryConfigs = requestKeys.map(function (queryKey) {
    return queryConfigByQueryKey.get(queryKey);
  }).filter(Boolean);
  return {
    cancelKeys: cancelKeys,
    requestQueryConfigs: requestQueryConfigs
  };
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


var useMemoizedQueryConfigs = function useMemoizedQueryConfigs(mapPropsToConfigs, props, callback) {
  var queryConfigs = normalizeToArray(mapPropsToConfigs(props)).map(function (queryConfig) {
    var queryKey = (0, _reduxQuery.getQueryKey)(queryConfig);

    if (queryKey) {
      return _objectSpread({}, queryConfig, {
        retry: true,
        unstable_preDispatchCallback: function unstable_preDispatchCallback() {
          callback(queryKey);
        }
      });
    }
  }).filter(Boolean);

  var _React$useState = React.useState(queryConfigs),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      memoizedQueryConfigs = _React$useState2[0],
      setMemoizedQueryConfigs = _React$useState2[1];

  var previousQueryKeys = React.useRef(queryConfigs.map(_reduxQuery.getQueryKey).filter(Boolean));
  React.useEffect(function () {
    var queryKeys = queryConfigs.map(_reduxQuery.getQueryKey).filter(Boolean);

    if (queryKeys.length !== previousQueryKeys.current.length || queryKeys.some(function (queryKey, i) {
      return previousQueryKeys.current[i] !== queryKey;
    })) {
      previousQueryKeys.current = queryKeys;
      setMemoizedQueryConfigs(queryConfigs);
    }
  }, [queryConfigs]);
  return memoizedQueryConfigs;
};

var useMultiRequest = function useMultiRequest(mapPropsToConfigs, props) {
  var reduxDispatch = (0, _reactRedux.useDispatch)();
  var previousQueryConfigs = React.useRef([]); // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.

  var pendingRequests = React.useRef(new Set()); // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.

  var dispatchRequestToRedux = (0, _useConstCallback["default"])(function (queryConfig) {
    var promise = reduxDispatch((0, _reduxQuery.requestAsync)(queryConfig));

    if (promise) {
      var _queryKey = (0, _reduxQuery.getQueryKey)(queryConfig);

      if (_queryKey) {
        pendingRequests.current.add(_queryKey);
      }
    }
  });
  var dispatchCancelToRedux = (0, _useConstCallback["default"])(function (queryKey) {
    if (pendingRequests.current.has(queryKey)) {
      reduxDispatch((0, _reduxQuery.cancelQuery)(queryKey));
      pendingRequests.current["delete"](queryKey);
    }
  }); // Query configs are memoized based on query key. As long as the query keys in the list don't
  // change, the query config list won't change.

  var queryConfigs = useMemoizedQueryConfigs(mapPropsToConfigs, props, function (queryKey) {
    pendingRequests.current["delete"](queryKey);
  });
  var forceRequest = React.useCallback(function () {
    queryConfigs.forEach(function (requestReduxAction) {
      dispatchRequestToRedux(_objectSpread({}, requestReduxAction, {
        force: true
      }));
    });
  }, [dispatchRequestToRedux, queryConfigs]);
  React.useEffect(function () {
    // Whenever the list of query configs change, we need to manually diff the query configs
    // against the previous list of query configs. Whatever was there and is no longer, will be
    // cancelled. Whatever is new, will turn into a request.
    var _diffQueryConfigs = diffQueryConfigs(previousQueryConfigs.current, queryConfigs),
        cancelKeys = _diffQueryConfigs.cancelKeys,
        requestQueryConfigs = _diffQueryConfigs.requestQueryConfigs;

    requestQueryConfigs.forEach(dispatchRequestToRedux);
    cancelKeys.forEach(function (queryKey) {
      return dispatchCancelToRedux(queryKey);
    });
    previousQueryConfigs.current = queryConfigs;
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfigs]); // When the component unmounts, cancel all pending requests

  React.useEffect(function () {
    return function () {
      _toConsumableArray(pendingRequests.current).forEach(dispatchCancelToRedux);
    };
  }, [dispatchCancelToRedux]);
  return forceRequest;
};

/**
 * This is the higher-order component code. Some of the code here was influenced by react-redux's
 * `connectAdvanced` implementation.
 *
 * See https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js
 * react-redux is licensed under the MIT License. Copyright (c) 2015-present Dan Abramov.
 */
var connectRequest = function connectRequest(mapPropsToConfigs, options) {
  return function (WrappedComponent) {
    var _ref = options || {},
        _ref$pure = _ref.pure,
        pure = _ref$pure === void 0 ? true : _ref$pure,
        _ref$forwardRef = _ref.forwardRef,
        forwardRef = _ref$forwardRef === void 0 ? false : _ref$forwardRef;

    var ConnectRequestFunction = function ConnectRequestFunction(props) {
      var forceRequest = useMultiRequest(mapPropsToConfigs, props);
      return React.createElement(WrappedComponent, _extends({}, props, {
        forceRequest: forceRequest
      }));
    };

    var ConnectRequest = pure ? React.memo(ConnectRequestFunction) : ConnectRequestFunction;
    var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    var displayName = "ConnectRequest(".concat(wrappedComponentName, ")");
    ConnectRequest.displayName = displayName;

    if (forwardRef) {
      var forwarded = React.forwardRef(function (props, ref) {
        return React.createElement(ConnectRequest, _extends({}, props, {
          forwardedRef: ref
        }));
      });
      forwarded.displayName = displayName;
      return (0, _hoistNonReactStatics["default"])(forwarded, WrappedComponent);
    }

    return (0, _hoistNonReactStatics["default"])(ConnectRequest, WrappedComponent);
  };
};

var _default = connectRequest;
exports["default"] = _default;