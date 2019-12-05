"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reduxQuery = require("redux-query");

var _useConstCallback = _interopRequireDefault(require("./use-const-callback"));

var _useMemoizedQueryConfig = _interopRequireDefault(require("./use-memoized-query-config"));

var _useQueryState = _interopRequireDefault(require("./use-query-state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useRequest = function useRequest(providedQueryConfig) {
  var reduxDispatch = (0, _reactRedux.useDispatch)();
  console.log('YESAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'); // This hook manually tracks the pending state, which is synchronized as precisely as possible
  // with the Redux state. This may seem a little hacky, but we're trying to avoid any asynchronous
  // synchronization. Hence why the pending state here is using a ref and it is updated via a
  // synchronous callback, which is called from the redux-query query middleware.

  var isPendingRef = React.useRef(false); // These "const callbacks" are memoized across re-renders. Unlike useCallback, useConstCallback
  // guarantees memoization, which is relied upon elsewhere in this hook to explicitly control when
  // certain side effects occur.

  var finishedCallback = (0, _useConstCallback["default"])(function () {
    isPendingRef.current = false;
  }); // Setting `retry` to `true` for these query configs makes it so that when this query config is
  // passed to a requestAsync action, if a previous request with the same query key failed, it will
  // retry the request (if `retry` is `false`, then it would essentially ignore the action).

  var transformQueryConfig = (0, _useConstCallback["default"])(function (queryConfig) {
    return _objectSpread({}, queryConfig, {
      unstable_preDispatchCallback: finishedCallback,
      retry: true
    });
  }); // Query configs are memoized based on query key. As long as the query key doesn't change, the
  // query config won't change.

  var queryConfig = (0, _useMemoizedQueryConfig["default"])(providedQueryConfig, transformQueryConfig); // This is an object that contains metadata about the query, like things from querySelectors
  // (e.g.`isPending`, `queryCount`, etc.)

  var queryState = (0, _useQueryState["default"])(queryConfig);
  var dispatchRequestToRedux = (0, _useConstCallback["default"])(function (queryConfig) {
    var promise = reduxDispatch((0, _reduxQuery.requestAsync)(queryConfig)); // If a promise is not returned, we know that the query middleware ignored this request and
    // one will not be made, so don't consider it as "pending".

    if (promise) {
      isPendingRef.current = true;
    }

    return promise;
  });
  var dispatchCancelToRedux = (0, _useConstCallback["default"])(function (queryKey) {
    reduxDispatch((0, _reduxQuery.cancelQuery)(queryKey));
    isPendingRef.current = false;
  });
  var forceRequest = React.useCallback(function () {
    if (queryConfig) {
      return dispatchRequestToRedux(_objectSpread({}, queryConfig, {
        force: true
      }));
    }
  }, [dispatchRequestToRedux, queryConfig]);
  React.useEffect(function () {
    // Dispatch `requestAsync` actions whenever the query config (note: memoized based on query
    // key) changes.
    if (queryConfig) {
      dispatchRequestToRedux(queryConfig);
    }

    return function () {
      // If there is an pending request whenever the component unmounts of the query config
      // changes, cancel the pending request.
      if (isPendingRef.current) {
        var queryKey = (0, _reduxQuery.getQueryKey)(queryConfig);

        if (queryKey) {
          dispatchCancelToRedux(queryKey);
        }
      }
    };
  }, [dispatchCancelToRedux, dispatchRequestToRedux, queryConfig]);
  return [queryState, forceRequest];
};

var _default = useRequest;
exports["default"] = _default;