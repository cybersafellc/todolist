import Jwt from "jsonwebtoken";
import { ResponseError } from "../errors/responses-error.js";

const userAccessToken = async (req, res, next) => {
  try {
    const access_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = Jwt.verify(
      access_token,
      process.env.USER_ACCESS_TOKEN_SECRET,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided a valid access_token!");
    req.id = decode.id;
    req.role = decode.role;
    next();
  } catch (error) {
    next(error);
  }
};

const userRefreshToken = async (req, res, next) => {
  try {
    const refresh_token = await req.headers["authorization"]?.split(" ")[1];
    const decode = Jwt.verify(
      refresh_token,
      process.env.USER_REFRESH_TOKEN_SECRET,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(400, "please provided a valid refresh_token!");
    req.id = decode.id;
    req.role = decode.role;
    next();
  } catch (error) {
    next(error);
  }
};

const userResetPasswordToken = async (req, res, next) => {
  try {
    const reset_password_token = await req.headers["authorization"]?.split(
      " "
    )[1];
    const decode = Jwt.verify(
      reset_password_token,
      process.env.USER_RESET_PASSWORD_SECRET,
      (err, decode) => {
        return decode;
      }
    );
    if (!decode)
      throw new ResponseError(
        400,
        "please provided a valid reset_password_token!"
      );
    req.id = decode.id;
    req.role = decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

export default { userAccessToken, userRefreshToken, userResetPasswordToken };
