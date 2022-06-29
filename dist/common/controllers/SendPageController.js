"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendPageController = void 0;

var _ScrapFacebookService = require("../services/ScrapFacebookService");

var _ScrapOlxService = require("../services/ScrapOlxService");

class SendPageController {
  async scrapFacebook(request, response) {
    const scrapFacebook = new _ScrapFacebookService.ScrapFacebookService();
    const {
      product,
      minPrice,
      maxPrice,
      daysSinceListed,
      pages
    } = request.body;
    const scrappedPage = await scrapFacebook.execute(product, minPrice, maxPrice, daysSinceListed);
    return response.json(scrappedPage);
  }

  async scrapOlx(request, response) {
    const scrapOlx = new _ScrapOlxService.ScrapOlxService();
    const {
      product,
      minPrice,
      maxPrice,
      pages
    } = request.body;
    const scrappedPage = await scrapOlx.execute(product, minPrice, maxPrice, pages);
    return response.json(scrappedPage);
  }

}

exports.SendPageController = SendPageController;