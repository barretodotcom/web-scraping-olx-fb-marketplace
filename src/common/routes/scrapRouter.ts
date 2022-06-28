import { Router } from "express";
import { SendPageController } from "../controllers/SendPageController";

const router = Router();
const scrapController = new SendPageController();

router.post("/facebook", scrapController.scrapFacebook);
router.post("/olx", scrapController.scrapOlx);

export default router;