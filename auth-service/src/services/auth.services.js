import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { RefreshToken } from "../models/token.model.js";
import dotenv from "dotenv";

dotenv.config();

export class AuthService {
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  static async signUp({ email, phone_number, username, address, birthday, password }) {
    if ((!email && !phone_number) || !password) {
      throw { status: 400, message: "Cần nhập Email hoặc số điện thoại và mật khẩu" };
    }
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) throw { status: 400, message: "Email đã tồn tại" };
    }
    if (phone_number) {
      const existingPhone = await User.findOne({ where: { phone_number } });
      if (existingPhone) throw { status: 400, message: "Số điện thoại đã tồn tại" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      phone_number,
      username,
      address,
      birthday,
      password: hashedPassword,
      role: "User"
    });

    return newUser;
  }

  static async signIn(email, phone_number, password, mode) {
  if (!password || (!email && !phone_number)) {
    throw { status: 400, message: "Cần nhập Email hoặc Số điện thoại và Mật khẩu" };
  }
  const user = await User.findOne({
    where: email ? { email } : { phone_number }
  });

  if (!user) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw { status: 400, message: "Mật khẩu không đúng" };
  }
  const accessToken = this.generateAccessToken(user);
  const refreshToken = this.generateRefreshToken(user);
  await RefreshToken.update(
    { is_revoked: true },
    { where: { user_id: user.user_id } }
  );
  await RefreshToken.create({
    token: refreshToken,
    user_id: user.user_id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  const safeUser = user.toJSON();
  delete safeUser.password;
  delete safeUser.reset_token;
  delete safeUser.reset_expires;
  if (mode === "web") {
    return {
      type: "web",
      user: safeUser,
      accessToken,
      refreshToken: null,
      cookieRefreshToken: refreshToken
    };
  }
  if (mode === "mobile") {
    return {
      type: "mobile",
      user: safeUser,
      accessToken,
      refreshToken
    };
  }
  return {
    type: "mobile",
    user: safeUser,
    accessToken,
    refreshToken
  };
}


  static async refresh(refreshToken, mode = "web") {
  if (!refreshToken) {
    throw { status: 400, message: "Yêu cầu Refresh Token" };
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    throw { status: 401, message: "Refresh token không hợp lệ hoặc đã hết hạn" };
  }
  const stored = await RefreshToken.findOne({
    where: {
      token: refreshToken,
      is_revoked: false
    }
  });

  if (!stored) {
    throw { status: 401, message: "Refresh token đã bị thu hồi" };
  }
  const user = await User.findByPk(decoded.id);
  if (!user) throw { status: 404, message: "Không tìm thấy người dùng" };
  const accessToken = this.generateAccessToken(user);
  if (mode === "web") {
    return {
      type: "web",
      accessToken,
      refreshToken: null
    };
  }
  return {
    type: "mobile",
    accessToken,
    refreshToken 
  };
}

static async getUserById(user_id) {
    const user = await User.findByPk(user_id, {
      attributes: { exclude: ["password", "reset_token", "reset_expires"] }
    });
    if (!user) {
      throw { status: 404, message: "Người dùng không tồn tại" };
    }
    return user;
  }

static async signOut(refreshToken) {
    if (!refreshToken) {
      throw { status: 400, message: "Yêu cầu Refresh Token" };
    }
    await RefreshToken.update(
      { is_revoked: true },
      { where: { token: refreshToken } }
    );
  }
}
