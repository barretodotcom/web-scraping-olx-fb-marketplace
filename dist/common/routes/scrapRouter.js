"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _SendPageController = require("../controllers/SendPageController");

const router = (0, _express.Router)();
const scrapController = new _SendPageController.SendPageController();
router.post("/facebook", scrapController.scrapFacebook);
router.post("/olx", scrapController.scrapOlx);
var _default = router;
exports.default = _default;