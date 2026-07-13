import createHttpError from "http-errors";
import { UserModel } from "./user.model";
import { createToken, hashPassword, verifyPassword } from "../../utils/auth";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  // Intentionally accepted-but-ignored: admins are promoted manually, never
  // self-assigned through the signup form.
  role?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  avatar?: string;
}

const toPublicUser = (user: { _id: unknown; name: string; email: string; role?: string; avatar?: string }) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
});

export const userService = {
  async register(input: RegisterInput) {
    const { name, password } = input;
    const normalizedEmail = String(input.email || "").trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      throw createHttpError(400, "Name, email, and password are required");
    }

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw createHttpError(409, "User already exists");
    }

    const user = await UserModel.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashPassword(password),
      role: "user",
    });

    const token = createToken(user);
    return { token, user: toPublicUser(user) };
  },

  async login(input: LoginInput) {
    const normalizedEmail = String(input.email || "").trim().toLowerCase();
    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user || !verifyPassword(input.password, user.password)) {
      throw createHttpError(401, "Invalid credentials");
    }

    const token = createToken(user);
    return { token, user: toPublicUser(user) };
  },

  async updateUser(id: string, input: UpdateUserInput) {
    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.email !== undefined) updates.email = input.email;
    if (input.avatar !== undefined) updates.avatar = input.avatar;
    // role is intentionally never updatable through this path

    if (updates.email) {
      const existing = await UserModel.findOne({ email: updates.email, _id: { $ne: id } });
      if (existing) {
        throw createHttpError(409, "Email already in use");
      }
    }

    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    return { user: toPublicUser(user) };
  },

  async getAllUsers() {
    return UserModel.find().select("-password").lean();
  },
};
