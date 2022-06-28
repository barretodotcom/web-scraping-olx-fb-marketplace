import axios from "axios";
import cheerio from "cheerio";

interface IProductDatas {
    link: string;
    titleProduct: string;
    price: string;
}



async function GetProductDatas(link: string) {
    const pid = process.pid
    console.log(pid)
    const productTitle = "h1.sc-45jt43-0.eCghYu.sc-ifAKCX.cmFKIN";
    const productPrice = "h2.sc-1wimjbb-2.iUSogS.sc-ifAKCX.cmFKIN";


    const product = await (await axios.get(link)).data;

    const cheerioFunction = cheerio.load(product);

    console.log(product)
}

process.once("message", GetProductDatas)