import express from "express";
import authMiddleware from "../middlewares/auth-middleware.js";
import userController from "../controllers/user-controller.js";
import listController from "../controllers/list-controller.js";

const router = express.Router();
router.get(
  "/users/verify-token",
  authMiddleware.userAccessToken,
  userController.verifyToken
);
router.post(
  "/users/refresh-token",
  authMiddleware.userRefreshToken,
  userController.refreshToken
);
router.get(
  "/users/reset-password/verify-token",
  authMiddleware.userResetPasswordToken,
  userController.verifyTokenResetPassword
);
router.put(
  "/users/reset-password/update-password",
  authMiddleware.userResetPasswordToken,
  userController.updatePassword
);
router.post("/lists", authMiddleware.userAccessToken, listController.create);
router.put("/lists", authMiddleware.userAccessToken, listController.update);
router.delete("/lists", authMiddleware.userAccessToken, listController.deletes);
router.get("/lists", authMiddleware.userAccessToken, listController.get);

export default router;
