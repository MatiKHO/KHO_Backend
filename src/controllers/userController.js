import prisma from "../prisma/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendResetEmail } from "../utils/sendEmail.js";
import { generateResetToken, verifyResetToken } from "../utils/resetToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: newUser,
    });
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuario no encontrado, credenciales incorrectas" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Inicio de sesión exitoso", token, user: userWithoutPassword });
  } catch (error) {
    console.error("Error al iniciar sesión:", error, error?.stack);
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Perfil del usuario encontrado", user });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log("[RESET REQUEST] Email recibido:", email);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "Correo no encontrado" });

  const token = generateResetToken({ id: user.id, email: user.email });
  const resetLink = `https://www.kumihoesports.com/reset-password?token=${encodeURIComponent(token)}`;

  try {
    await sendResetEmail(email, resetLink);
    res.json({ message: "Correo enviado con instrucciones" });
  } catch (err) {
    console.error("Error al enviar el email:", err);
    res.status(500).json({ message: "Error al enviar el email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const payload = verifyResetToken(token);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error al resetear la contraseña:", err);
    res.status(400).json({ message: "Token inválido o expirado" });
  }
};