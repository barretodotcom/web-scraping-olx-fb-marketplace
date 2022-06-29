import { Router } from "express";
import { SendPageController } from "../controllers/SendPageController";

const router = Router();
const scrapController = new SendPageController();

router.post("/facebook", scrapController.scrapFacebook);
router.post("/olx", scrapController.scrapOlx);
router.get("/jair", (req, res) => {
    return res.json("oi")
})
export default router;