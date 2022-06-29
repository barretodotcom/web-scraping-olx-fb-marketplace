"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrapOlxService = void 0;

var _puppeteerCluster = require("puppeteer-cluster");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScrapOlxService {
  async execute(product, minPrice, maxPrice, pages) {
    const cluster = await _puppeteerCluster.Cluster.launch({
      concurrency: _puppeteerCluster.Cluster.CONCURRENCY_PAGE,
      maxConcurrency: 100,
      puppeteerOptions: {
        headless: true,
        args: ['--no-sandbox'],
        timeout: 0
      }
    });
    let url = "https://ce.olx.com.br/autos-e-pecas/motos?o=PAGE_NUMBER&pe=MAX_PRICE&ps=MIN_PRICE&q=PRODUCT_TEMPLATE".replace("PRODUCT_TEMPLATE", product).replace("MIN_PRICE", minPrice).replace("MAX_PRICE", maxPrice).replace(/( )/gm, "%20").replace("PAGE_NUMBER", "1");
    let eachProductLink = "div.sc-12rk7z2-0.bDLpyo > a";
    let price = "h2.sc-1wimjbb-2.iUSogS.sc-ifAKCX.cmFKIN";
    let titleProduct = "#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.gFNxVM > div > div > h1";
    let links = [];
    let site = await (await _axios.default.get(url)).data;

    let cheerioFunction = _cheerio.default.load(site);

    for (var j = 1; j <= parseInt(pages); j++) {
      url = url.replace("o=1", `o=${j}`);
      let pagesUrl = await (await _axios.default.get(url)).data;
      cheerioFunction = _cheerio.default.load(pagesUrl);
      cheerioFunction(eachProductLink).each((i, lnk) => {
        console.log(links);
        links.push(cheerioFunction(lnk).attr("href"));
      });
    }

    let products = [];
    let counter = 0;
    console.log("Número de links: " + links.length);
    cluster.task(async ({
      page,
      data: link
    }) => {
      let html = await (await _axios.default.get(link)).data;

      let cheerioProduct = _cheerio.default.load(html);

      let productTitle = cheerioProduct(titleProduct).text();
      let productPrice = cheerioProduct(price).text();
      let productContact = "Não estava no anúncio.";
      let numberIsLocked = html.includes("ver numero") || html.includes("ver número");

      if (numberIsLocked) {
        productContact = JSON.parse(cheerioProduct("#initial-data").attr("data-json")).ad.body.split(" ").filter(element => {
          if (element.includes("98") || element.includes("88") || element.includes("99")) {
            return element.replace("<br>", " ").replace("<br>", " ").replace("<br>", " ");
          }
        }).toString();
      }

      products.push([productTitle, productPrice, productContact, link]);
    });

    for (var i = 0; i < links.length; i++) {
      cluster.queue(links[i]);
    }

    await cluster.idle();
    await cluster.close();
    return products;
  }

}

exports.ScrapOlxService = ScrapOlxService;