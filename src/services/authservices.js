import { User } from "../models/auth.model.js";
import { RefreshToken } from "../models/token.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateResetPasswordEmail } from "../ultis/reset_password_email_template.js";
import { transporter } from "../config/mail.js";
import { Op } from "sequelize";
import cloudinary from "../config/cloudinary.js";
import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace_member.model.js";

function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.user_id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.user_id },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}



export async function refreshTokenService(token) {
  if (!token) {
    throw { status: 400, message: "Cần cung cấp refresh token" };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw { status: 401, message: "Refresh token không hợp lệ" };
  }

  const refreshTokenDoc = await RefreshToken.findOne({
    where: {
      token,
      is_revoked: false,
      expires_at: { [Op.gt]: new Date() }
    }
  });

  if (!refreshTokenDoc) {
    throw { status: 401, message: "Refresh token đã bị thu hồi hoặc hết hạn" };
  }

  const user = await User.findByPk(refreshTokenDoc.user_id);
  if (!user) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }

  const newAccessToken = generateAccessToken(user);

  await refreshTokenDoc.update({ is_revoked: true });

  const newRefreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    token: newRefreshToken,
    user_id: user.user_id,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}

export async function signUpService({ email, phone_number, username, address, birthday, password }) {
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

export async function signInService({ email, phone_number, password }) {
  if (!password || (!email && !phone_number)) {
    throw { status: 400, message: "Cần nhập Email hoặc Số điện thoại và Mật khẩu" };
  }

  const user = await User.findOne({
    where: email ? { email } : { phone_number }
  });

  if (!user) throw { status: 401, message: "Email hoặc số điện thoại không hợp lệ" };

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw { status: 401, message: "Mật khẩu không hợp lệ" };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

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

  return {
    user: safeUser,
    accessToken,
    refreshToken
  };
}
export async function getUserIdByEmail(email) {
    if (!email) {
        throw { status: 400, message: "Email không được để trống" };
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw { status: 404, message: "Không tìm thấy user với email này" };
    }

    return user.user_id;
}

export async function getUserByIdService(user_id) {
  const user = await User.findByPk(user_id, {
    attributes: { exclude: ["password", "reset_token", "reset_expires"] }
  });

  if (!user) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }

  return user;
}

export async function updateUserProfileService(user_id, updates) {
  const ALLOWED_FIELDS = [
    "email",
    "phone_number",
    "username",
    "address",
    "birthday",
    "gender",
    "github_access_token"
  ];

  const user = await User.findByPk(user_id);
  if (!user) throw { status: 404, message: "Người dùng không tồn tại" };
  if (updates.email) {
    const emailExist = await User.findOne({
      where: { email: updates.email, user_id: { [Op.ne]: user_id } },
    });
    if (emailExist) throw { status: 400, message: "Email đã tồn tại" };
    user.email = updates.email;
  }
  if (updates.phone_number) {
    const phoneExist = await User.findOne({
      where: { phone_number: updates.phone_number, user_id: { [Op.ne]: user_id } },
    });
    if (phoneExist) throw { status: 400, message: "Số điện thoại đã tồn tại" };
    user.phone_number = updates.phone_number;
  }
  for (const key of ALLOWED_FIELDS) {
    if (updates[key] !== undefined && key !== "email" && key !== "phone_number") {
      user[key] = updates[key];
    }
  }
  if (updates.avatar_base64) {
    try {
      let base64 = updates.avatar_base64;
      if (!base64.startsWith("data:image")) {
        base64 = `data:image/png;base64,${base64}`;
      }
      if (user.avatar_public_id) {
        try {
          await cloudinary.uploader.destroy(user.avatar_public_id);
        } catch (err) {
          console.log("Không thể xóa avatar cũ:", err);
        }
      }
      const upload = await cloudinary.uploader.upload(base64, {
        folder: "todoapp/avatar",
        transformation: [{ width: 512, height: 512, crop: "limit" }]
      });

      user.avatar_url = upload.secure_url;
      user.avatar_public_id = upload.public_id;

    } catch (err) {
      console.log("Lỗi upload avatar:", err);
      throw { status: 500, message: "Không thể upload avatar" };
    }
  }
  if (updates.delete_avatar === true) {
    if (user.avatar_public_id) {
      try {
        await cloudinary.uploader.destroy(user.avatar_public_id);
      } catch (err) {
        console.log("Không thể xóa avatar:", err);
      }
    }
    user.avatar_url = null;
    user.avatar_public_id = null;
  }
  await user.save();
  const safeUser = user.toJSON();
  delete safeUser.password;
  delete safeUser.reset_token;
  delete safeUser.reset_expires;
  return safeUser;
}


export async function createAdminAccountService(data) {
  const { email, username, phone_number, address, birthday, password } = data;

  if (!email || !password) {
    throw { status: 400, message: "Email và mật khẩu là bắt buộc" };
  }

  const existedEmail = await User.findOne({ where: { email } });
  if (existedEmail) throw { status: 400, message: "Email đã tồn tại" };

  if (phone_number) {
    const existedPhone = await User.findOne({ where: { phone_number } });
    if (existedPhone) throw { status: 400, message: "Số điện thoại đã tồn tại" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Tạo Admin user
  const admin = await User.create({
    email,
    username,
    phone_number,
    address,
    birthday,
    password: hashedPassword,
    role: "Admin"
  });

  console.log("Admin created:", admin.user_id);

  const workspace_token = crypto.randomBytes(3).toString("hex"); // 6 ký tự

  // Tạo workspace
  const workspace = await Workspace.create({
    name: `${username}'s Workspace`,
    description: `Workspace mặc định của Admin ${username}`,
    workspace_token
  });

  console.log("Workspace ID =", workspace.workspace_id);

  // Tạo WorkspaceMember
  await WorkspaceMember.create({
    workspace_id: workspace.workspace_id,
    user_id: admin.user_id,
    workspace_role: "Owner"
  });

  // Trả về dữ liệu sạch
  const safeUser = admin.toJSON();
  delete safeUser.password;

  return {
    message: "Tạo tài khoản Admin thành công",
    admin: safeUser,
    workspace
  };
}


export async function getUserIdByEmailService(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }
  return user.user_id;
}

export async function signOutService(refreshToken) {
  if (!refreshToken) {
    throw { status: 400, message: "Cần cung cấp refresh token" };
  }

  await RefreshToken.update(
    { is_revoked: true },
    { where: { token: refreshToken } }
  );

  return { message: "Đăng xuất thành công" };
}

export async function forgotPasswordService(email) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw { status: 400, message: "Không tìm thấy tài khoản với email này" };

  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();

  user.reset_token = resetCode;
  user.reset_expires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const html = generateResetPasswordEmail(user.email, resetCode, 15);

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: user.email,
    subject: "Mã đặt lại mật khẩu",
    html
  });

  return { message: "Reset code sent" };
}

export async function checkResetTokenService(token) {
  const user = await User.findOne({ where: { reset_token: token } });
  if (!user) throw { status: 400, message: "Mã đặt lại mật khẩu không hợp lệ" };

  if (user.reset_expires < new Date()) {
    throw { status: 400, message: "Mã đặt lại mật khẩu hết hạn" };
  }

  return user;
}

export async function resetPasswordService(token, newPassword) {
  const user = await User.findOne({ where: { reset_token: token } });
  if (!user)
    throw { status: 400, message: "Mã đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" };

  if (user.reset_expires < new Date()) {
    throw { status: 400, message: "Mã đặt lại mật khẩu đã hết hạn" };
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.reset_token = null;
  user.reset_expires = null;
  await user.save();

  return { message: "Mật khẩu đã được đặt lại thành công" };
}

