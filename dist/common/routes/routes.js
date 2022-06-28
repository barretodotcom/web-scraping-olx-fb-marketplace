"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _scrapRouter = _interopRequireDefault(require("./scrapRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = _express.default.Router();

routes.use("/scrap", _scrapRouter.default);
var _default = routes;
exports.default = _default;