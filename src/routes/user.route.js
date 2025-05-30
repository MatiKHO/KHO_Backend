import { Router } from "express";
import {
  registerUser,
  loginUser,
  userProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", authenticateToken, userProfile);

export default router;
