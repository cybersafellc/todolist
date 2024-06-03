import http from "http";
import { web } from "./src/app/web.js";
import { logger } from "./src/app/logging.js";
import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(web);
server.listen(process.env.APP_PORT, () => {
  logger.info({
    message: "server running",
    port: 5000,
    link: "localhost:5000",
  });
});
