import bcrypt from "bcryptjs";
import { findUserByEmail, findUserByPhone ,createUser } from "./user.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  findValidRefreshToken,
  revokeRefreshToken,
} from "./token.service.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export async function registerService({
  email,
  phone_number,
  username,
  address,
  birthday,
  password,
}) {
  if ((!email && !phone_number) || !password) {
    throw { status: 400, message: "Cần nhập Email hoặc số điện thoại và mật khẩu" };
  }
  if (email) {
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) throw { status: 400, message: "Email đã tồn tại" };
  }
  if (phone_number) {
    const existingPhone = await findUserByPhone;
    if (existingPhone) throw { status: 400, message: "Số điện thoại đã tồn tại" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await createUser({
    email,
    password: hashedPassword,
    username: username || null,
    phone_number: phone_number || null,
    address: address || null,
    birthday: birthday || null,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);
  const expiresAt = new Date(decodedRefresh.exp * 1000);

  await saveRefreshToken(user.user_id, refreshToken, expiresAt);

  return { user, accessToken, refreshToken };
}

export async function loginService({ email, phone_number, password }) {
  if (!password || (!email && !phone_number)) {
    throw { status: 400, message: "Cần nhập Email hoặc Số điện thoại và Mật khẩu" };
  }
  let user = null;

  if (email) {
    user = await findUserByEmail(email);
  } else if (phone_number) {
    user = await findUserByPhone(phone_number);
  }
  if (!user) {
    throw { status: 401, message: "Email/Phone hoặc mật khẩu không đúng" };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 401, message: "Email hoặc mật khẩu không đúng" };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const decodedRefresh = jwt.verify(refreshToken, JWT_SECRET);
  const expiresAt = new Date(decodedRefresh.exp * 1000);

  await saveRefreshToken(user.user_id, refreshToken, expiresAt);
  const safeUser = user.toJSON();
  delete safeUser.password;
  delete safeUser.reset_token;
  delete safeUser.reset_expires;
  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshTokenService(token) {
  if (!token) {
    throw { status: 400, message: "Thiếu refresh token" };
  }
  const storedToken = await findValidRefreshToken(token);
  if (!storedToken) {
    throw { status: 401, message: "Refresh token không hợp lệ hoặc đã hết hạn" };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (err) {
    throw { status: 401, message: "Refresh token không hợp lệ" };
  }
  const user_id = decoded.id;
  const user = { user_id }; 
  const accessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken(user);
  const decodedNew = jwt.verify(newRefreshToken, JWT_REFRESH_SECRET);
  const expiresAt = new Date(decodedNew.exp * 1000);
  await revokeRefreshToken(token);
  await saveRefreshToken(user_id, newRefreshToken, expiresAt);

  return { accessToken, refreshToken: newRefreshToken };
}
