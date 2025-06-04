import jwt from "jsonwebtoken";

const RESET_SECRET = process.env.JWT_RESET_SECRET || "RESET_SECRET";

export const generateResetToken = (payload) =>
  jwt.sign(payload, RESET_SECRET, { expiresIn: "10m" });

export const verifyResetToken = (token) =>
  jwt.verify(token, RESET_SECRET);
