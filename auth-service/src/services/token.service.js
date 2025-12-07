import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
} from "../config/env.js";
import { RefreshToken } from "../models/index.js";
import { Op } from "sequelize";

export function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES || "1h" }
  );
}
export function generateRefreshToken(user) {
  const payload = { id: user.user_id };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES || "7d",
  });
}


export async function saveRefreshToken(user_id, token, expires_at) {
  return RefreshToken.create({
    user_id,
    token,
    expires_at,
    is_revoked: false,
  });
}


export async function revokeRefreshToken(token) {
  await RefreshToken.update(
    { is_revoked: true },
    { where: { token } }
  );
}


export async function findValidRefreshToken(token) {
  const now = new Date();
  return RefreshToken.findOne({
    where: {
      token,
      is_revoked: false,
      expires_at: {
        [Op.gt]: now,
      },
    },
  });
}
