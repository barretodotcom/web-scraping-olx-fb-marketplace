import { Cluster } from 'puppeteer-cluster';
import pup from 'puppeteer';
import cheerio from 'cheerio';
import axios from 'axios';

export class ScrapOlxService {

    public async execute(product: string, minPrice: string, maxPrice: string, pages: string): Promise<any[]> {

        const cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 25,
            puppeteerOptions: {
                headless: true,
                args: ['--no-sandbox']
            }
        })

        let url = "https://ce.olx.com.br/autos-e-pecas/motos?o=PAGE_NUMBER&pe=MAX_PRICE&ps=MIN_PRICE&q=PRODUCT_TEMPLATE".replace("PRODUCT_TEMPLATE", product).replace("MIN_PRICE", minPrice).replace("MAX_PRICE", maxPrice).replace(/( )/gm, "%20").replace("PAGE_NUMBER", "1")

        let unlockNumber = "#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.TTuHU > div > div > div > div.sc-1sj3nln-0.eSLnCp > div > p > span > a"
        let eachProductLink = "div.sc-12rk7z2-0.bDLpyo > a";
        let price = "h2.sc-1wimjbb-2.iUSogS.sc-ifAKCX.cmFKIN";
        let titleProduct = "#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.gFNxVM > div > div > h1";
        let productSubtitles = "#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.TTuHU > div > div > div > div.sc-1sj3nln-0.eSLnCp > div > p > span"

        let phoneNumberHTML = "#content > div.sc-18p038x-3.dSrKbb > div > div.sc-bwzfXH.h3us20-0.cBfPri > div.duvuxf-0.h3us20-0.gyKyRK > div.h3us20-6.TTuHU > div > div > div > div.sc-1sj3nln-0.eSLnCp > div > p > span > span"

        let links: any = [];

        let site = await (await axios.get(url)).data;

        let cheerioFunction = cheerio.load(site);

        for (var j = 1; j <= parseInt(pages); j++) {
            url = url.replace("o=1", `o=${j}`)

            let pagesUrl = await (await axios.get(url)).data;

            cheerioFunction = cheerio.load(pagesUrl);

            cheerioFunction(eachProductLink).each((i, lnk) => {
                links.push(cheerioFunction(lnk).attr("href"));
            })

        }
        console.log(links)
        let products: any[] = [];
        let counter = 0;
        console.log("Número de links: " + links.length);

        await cluster.task(async ({ page, data: link }) => {

            let html = await (await axios.get(link)).data;
            let cheerioProduct = cheerio.load(html);
            let productTitle = cheerioProduct(titleProduct).text();
            let productPrice = cheerioProduct(price).text();

            let productContact: string | any = "Não estava no anúncio.";

            let numberIsLocked = html.includes("ver numero") || html.includes("ver número");

            if (numberIsLocked) {

                console.log("-----start------")
                console.log(cheerioProduct(unlockNumber).text())
                console.log(cheerioProduct(phoneNumberHTML).text())
                console.log(link)
                console.log("----end------")
                productContact = JSON.parse(cheerioProduct("#initial-data").attr("data-json")).ad.body.split(" ").filter(element => {
                    if (element.includes("98") || element.includes("88") || element.includes("99")) {
                        return element
                    }
                })

            }

            products.push([productTitle, productPrice, productContact, link]);

            counter++
        })

        for (var i = 0; i < links.length; i++) {
            await cluster.queue(links[i])
        }

        await cluster.idle();
        await cluster.close();

        return products;
    }

}