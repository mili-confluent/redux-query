"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reduxQuery = require("redux-query");

var _useQueryState = _interopRequireDefault(require("./use-query-state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useMutation = function useMutation(makeQueryConfig) {
  var reduxDispatch = (0, _reactRedux.useDispatch)(); // This query config and query state are driven based off of the callback – so they represent
  // the the query config that was used for the most-recent mutation callback.

  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      queryConfig = _React$useState2[0],
      setQueryConfig = _React$useState2[1];

  var queryState = (0, _useQueryState["default"])(queryConfig);
  var mutate = React.useCallback(function () {
    var queryConfig = makeQueryConfig.apply(void 0, arguments);
    setQueryConfig(queryConfig);
    return reduxDispatch((0, _reduxQuery.mutateAsync)(queryConfig));
  }, [makeQueryConfig, reduxDispatch]);
  return [queryState, mutate];
};

var _default = useMutation;
exports["default"] = _default;