import { Router } from "express";
import {
  registerUser,
  loginUser,
  userProfile,
  requestPasswordReset,
  resetPassword,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authenticateToken, userProfile);

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
