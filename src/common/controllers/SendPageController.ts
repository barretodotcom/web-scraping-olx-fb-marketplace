import { Request, response, Response } from "express";
import pup from 'puppeteer'
import { ScrapFacebookService } from "../services/ScrapFacebookService";
import { ScrapOlxService } from "../services/ScrapOlxService";

export class SendPageController {

    public async scrapFacebook(request: Request, response: Response): Promise<Response> {

        const scrapFacebook = new ScrapFacebookService();

        const { product, minPrice, maxPrice, daysSinceListed, pages } = request.body
        try {
            const scrappedPage = await scrapFacebook.execute(product, minPrice, maxPrice, daysSinceListed);

            return response.json(scrappedPage);
        } catch {
            throw new Error();
        }
    }

    public async scrapOlx(request: Request, response: Response): Promise<Response> {

        const scrapOlx = new ScrapOlxService();

        const { product, minPrice, maxPrice, daysSinceListed, pages } = request.body;
        try {
            const scrappedPage = await scrapOlx.execute(product, minPrice, maxPrice, daysSinceListed, pages);

            return response.json(scrappedPage);
        } catch {
            throw new Error();
        }
    }
}