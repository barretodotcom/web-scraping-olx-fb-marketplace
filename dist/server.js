"use strict";

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./common/routes/routes"));

var _cors = _interopRequireDefault(require("cors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
let port = process.env.PORT || 3333;
app.use((0, _cors.default)());
app.use(_express.default.json());
app.use(_routes.default);
app.listen(port, () => {
  console.log("Aplicação rodando na porta " + port);
});