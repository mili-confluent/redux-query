"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactRedux = require("react-redux");

var _reduxQuery = require("redux-query");

var _context = _interopRequireDefault(require("../context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var useQueriesState = function useQueriesState(queryConfig) {
  var contextValue = React.useContext(_context["default"]);

  if (!contextValue) {
    throw new Error("Could not find redux-query-react's context. Be sure to render a redux-query <Provider> near the root of your React tree.");
  }

  var queriesSelector = contextValue.queriesSelector;
  var queriesState = (0, _reactRedux.useSelector)(queriesSelector);
  var isPending = queryConfig.some(function (queryConfig) {
    return _reduxQuery.querySelectors.isPending(queriesState, queryConfig);
  });
  var isFinished = queryConfig.every(function (queryConfig) {
    return _reduxQuery.querySelectors.isFinished(queriesState, queryConfig);
  });
  var queryState = React.useMemo(function () {
    return {
      isPending: isPending,
      isFinished: isFinished
    };
  }, [isFinished, isPending]);
  return queryState;
};

var _default = useQueriesState;
exports["default"] = _default;