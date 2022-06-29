"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrapFacebookService = void 0;

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _puppeteerCluster = require("puppeteer-cluster");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ScrapFacebookService {
  async execute(product, minPrice, maxPrice, daysSinceListed) {
    const cluster = await _puppeteerCluster.Cluster.launch({
      concurrency: _puppeteerCluster.Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 30
    });
    let url = "https://www.facebook.com/marketplace/fortaleza/search?minPrice=MIN_PRICE&maxPrice=MAX_PRICE&daysSinceListed=DAYS_LISTED&query=PRODUCT_TEMPLATE&exact=false".replace("PRODUCT_TEMPLATE", product).replace("MIN_PRICE", minPrice.toString()).replace("MAX_PRICE", maxPrice.toString()).replace("DAYS_LISTED", daysSinceListed);
    let price = "span.d2edcug0 .hpfvmrgz .qv66sw1b .c1et5uql .oi732d6d .ik7dh3pa .ht8s03o8 .a8c37x1j .fe6kdd0r .mau55g9w .c8b282yb .keod5gw0 .nxhoafnm .aigsh9s9 .d9wwppkn .iv3no6db .a5q79mjw .g1cxx5fr .lrazzd5p .oo9gr5id".replace(/ /gm, "");
    let title = "span d2edcug0 hpfvmrgz qv66sw1b c1et5uql oi732d6d ik7dh3pa ht8s03o8 a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 ns63r2gh hrzyx87i o0t2es00 f530mmz5 hnhda86s oo9gr5id".replace(/ /gm, ".");
    let time = "span d2edcug0 hpfvmrgz qv66sw1b c1et5uql oi732d6d ik7dh3pa ht8s03o8 a8c37x1j fe6kdd0r mau55g9w c8b282yb keod5gw0 nxhoafnm aigsh9s9 d9wwppkn mdeji52x e9vueds3 j5wam9gi b1v8xokw m9osqain".replace(/ /gm, ".");
    let eachProductLink = "div.kbiprv82 > a";
    const browser = await _puppeteer.default.launch({
      headless: false
    });
    const pagePup = await browser.newPage();
    await pagePup.goto(url, {
      timeout: 0
    });
    await pagePup.waitForSelector("div.kbiprv82");
    await pagePup.waitForSelector(eachProductLink);
    let links = await pagePup.$$eval("div.kbiprv82 > a", element => element.map(link => {
      return link.href;
    }));
    const objectArray = [];
    let lengthArray = [];
    let counter = 0;
    let products = [];
    let tableRow = "<tbody>";
    let table = `
                            <table>
                                <th>
                                    <tr>
                                        <td>Produto.</td>
                                        <td>Preço.</td>
                                        <td>Quando foi anunciado.</td>
                                        <td>Link.</td>
                                    </tr>
                                </th>
                                <tbody>
                                </tbody>
                            </table>
                        `;
    cluster.task(async ({
      page,
      data: link
    }) => {
      await page.goto(link);
      await page.waitForSelector(time);
      await page.waitForSelector(price);
      await page.waitForSelector(title);
      let titleText = await page.$$eval(title, elements => elements[1].innerText);
      let priceText = await page.$$eval(price, elements => elements[2].innerText);
      let timeText = await page.$$eval(time, elements => elements[0].innerText);
      products.push([titleText, priceText, timeText, link]);
    });

    for (var i = 0; i < links.length; i++) {
      await cluster.queue(links[i]);
    }

    await cluster.idle();
    await cluster.close();
    await browser.close();
    return products;
  }

}

exports.ScrapFacebookService = ScrapFacebookService;