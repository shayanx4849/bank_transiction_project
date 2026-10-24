import express from "express";
import authMiddle from "../middlewares/auth.middleware.js";
import accountController from "../controllers/account.controller.js";
const router = express.Router();

/* POST /api/accounts */
router.post(
  "/",
  authMiddle.authMiddleware,
  accountController.createAccountController,
);
export default router;
