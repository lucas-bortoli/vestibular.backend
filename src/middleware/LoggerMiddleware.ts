import { Request, Response } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import logger from "../logger.js";

/**
 * Middleware que mostra todas as requisições no console.
 */
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  use(request: Request, response: Response, next: (err?: any) => any) {
    logger.info(request.method, request.url);
    next();
  }
}
