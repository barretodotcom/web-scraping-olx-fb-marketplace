import express, { Request, Response } from 'express';
import { SendPageController } from '../controllers/SendPageController';
import scrapRouter from './scrapRouter';

const routes = express.Router();

routes.use(scrapRouter)

export default routes;
