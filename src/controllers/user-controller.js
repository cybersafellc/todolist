import userService from "../services/user-service.js";

const create = async (req, res, next) => {
  try {
    const response = await userService.create(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const response = await userService.login(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  try {
    const response = await userService.verifyToken();
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.role = await req.role;
    const response = await userService.refreshToken(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const resetPasswordRequest = async (req, res, next) => {
  try {
    const response = await userService.resetPasswordRequest(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const verifyTokenResetPassword = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.reset_password_token = await req.headers["authorization"]?.split(
      " "
    )[1];
    const response = await userService.verifyTokenResetPassword(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    req.body.id = await req.id;
    req.body.reset_password_token = await req.headers["authorization"]?.split(
      " "
    )[1];
    const response = await userService.updatePassword(req.body);
    res.status(response.status).json(response).end();
  } catch (error) {
    next(error);
  }
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
