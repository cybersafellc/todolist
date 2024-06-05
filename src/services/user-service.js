import { database } from "../app/database.js";
import { createID } from "../app/generateID.js";
import { logger } from "../app/logging.js";
import { Response } from "../app/response.js";
import { SendEmail } from "../app/sendEmail.js";
import { ResponseError } from "../errors/responses-error.js";
import userValidation from "../validations/user-validation.js";
import validate from "../validations/validate.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const create = async (request) => {
  const result = await validate(userValidation.create, request);
  const count = await database.user.count({
    where: {
      username: result.username,
    },
  });
  if (count) throw new ResponseError(400, "username already exist");
  result.id = createID.user();
  result.password = await bcrypt.hash(result.password, 10);
  const created = await database.user.create({
    data: result,
    select: {
      username: true,
    },
  });
  return new Response(200, "successfully created", created, null, false);
};

const login = async (request) => {
  const result = await validate(userValidation.login, request);
  const login = await database.user.findFirst({
    where: {
      username: result.username,
    },
  });
  if (
    (await bcrypt.compare(
      result.password,
      login?.password || "2h0gd8hqwdh0hwe949he"
    )) &&
    login
  ) {
    const access_token = Jwt.sign(
      {
        id: login.id,
        role: "user",
      },
      process.env.USER_ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );
    const refresh_token = Jwt.sign(
      {
        id: login.id,
        role: "user",
      },
      process.env.USER_REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const response = { access_token, refresh_token };
    return new Response(200, "successfully login", response, null, false);
  }
  return new Response(400, "username and password not match", null, null, true);
};

const verifyToken = async () => {
  return new Response(200, "token verified", null, null, false);
};

const refreshToken = async (request) => {
  const result = await validate(userValidation.refreshToken, request);
  const access_token = Jwt.sign(result, process.env.USER_ACCESS_TOKEN_SECRET, {
    expiresIn: "5m",
  });

  return new Response(
    200,
    "successfully refresh access_token",
    { access_token },
    null,
    false
  );
};

const resetPasswordRequest = async (request) => {
  const result = await validate(userValidation.resetPasswordRequest, request);
  const user = await database.user.findFirst({
    where: result,
  });
  if (user) {
    const reset_password_token = Jwt.sign(
      { id: user.id, role: "user" },
      process.env.USER_RESET_PASSWORD_SECRET,
      { expiresIn: "5m" }
    );
    try {
      new SendEmail().resetPassword(user.username, reset_password_token); // send email
    } catch (error) {
      logger.info("error send email");
    }
    const id = createID.other();
    await database.reset_password_token.create({
      data: {
        id: id,
        jwt_reset_pass_token: reset_password_token,
        user_id: user.id,
      },
    });
  }
  return new Response(
    200,
    "If the account is already registered, we have sent a password reset link to your email so you can change the new password,",
    null,
    null,
    false
  );
};

const verifyTokenResetPassword = async (request) => {
  const result = await validate(
    userValidation.verifyTokenResetPassword,
    request
  );
  const count = await database.reset_password_token.count({
    where: {
      user_id: result.id,
      jwt_reset_pass_token: result.reset_password_token,
    },
  });
  if (!count)
    throw new ResponseError(
      400,
      "please provided a valid reset_password_token!"
    );

  return new Response(200, "token verified", null, null, false);
};

const updatePassword = async (request) => {
  const result = await validate(userValidation.updatePassword, request);
  const alreadyUpdate = await database.reset_password_token.count({
    where: {
      user_id: result.id,
      jwt_reset_pass_token: result.reset_password_token,
    },
  });
  if (!alreadyUpdate)
    throw new ResponseError(
      400,
      "please provided a valid reset_password_token!"
    );
  result.password = await bcrypt.hash(result.password, 10);
  await database.user.update({
    data: {
      password: result.password,
    },
    where: {
      id: result.id,
    },
  });
  await database.reset_password_token.deleteMany({
    where: {
      user_id: result.id,
    },
  });
  return new Response(200, "password successfully updated", null, null, false);
};

export default {
  create,
  login,
  verifyToken,
  refreshToken,
  resetPasswordRequest,
  verifyTokenResetPassword,
  updatePassword,
};
