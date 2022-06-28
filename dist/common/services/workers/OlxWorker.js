"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function GetProductDatas(link) {
  const pid = process.pid;
  console.log(pid);
  const productTitle = "h1.sc-45jt43-0.eCghYu.sc-ifAKCX.cmFKIN";
  const productPrice = "h2.sc-1wimjbb-2.iUSogS.sc-ifAKCX.cmFKIN";
  const product = await (await _axios.default.get(link)).data;

  const cheerioFunction = _cheerio.default.load(product);

  console.log(product);
}

process.once("message", GetProductDatas);