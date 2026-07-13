import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  if (!storedHash) {
    return false;
  }

  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) {
    return storedHash === password;
  }

  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  const derivedBuffer = Buffer.from(derivedKey, "hex");
  const storedBuffer = Buffer.from(hash, "hex");

  if (derivedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derivedBuffer, storedBuffer);
};

export const createToken = (user: { _id?: unknown; role?: string }) => {
  return jwt.sign(
    { sub: String(user._id || ""), role: user.role || "user" },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
};
