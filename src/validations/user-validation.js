import Joi from "joi";

const create = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const refreshToken = Joi.object({
  id: Joi.string().required(),
  role: Joi.string().required(),
});

const resetPasswordRequest = Joi.object({
  username: Joi.string().required(),
});

const verifyTokenResetPassword = Joi.object({
  id: Joi.string().required(),
  reset_password_token: Joi.string().required(),
});

const updatePassword = Joi.object({
  id: Joi.string().required(),
  reset_password_token: Joi.string().required(),
  password: Joi.string().required(),
});

export default {
  create,
  login,
  refreshToken,
  resetPasswordRequest,
  verifyTokenResetPassword,
  updatePassword,
};
