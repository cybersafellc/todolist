import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { ResponseError } from "../errors/responses-error.js";

const pageNotFound = async (req, res, next) => {
  try {
    throw new ResponseError(404, "page not found");
  } catch (error) {
    next(error);
  }
};

const handleError = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }
  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json(new Response(err.status, err.message, null, null, true))
      .end();
  } else {
    logger.error({ err });
    res
      .status(500)
      .json(new Response(500, err.message, null, null, true))
      .end();
  }
};

export default { pageNotFound, handleError };
