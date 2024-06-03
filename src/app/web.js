import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "../middlewares/error-middleware.js";
import publicRouter from "../routers/public.js";
import privateRouter from "../routers/private.js";

export const web = express();
web.use(cors());
web.use(cookieParser());
web.use(bodyParser.json());
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware.pageNotFound);
web.use(errorMiddleware.handleError);
