import { User } from "../models/auth.model.js";
import { RefreshToken } from "../models/token.model.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URI} from "../config/env.js";


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


export function githubSignInService(platform = "web") {
  const state = platform;
  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${GITHUB_CLIENT_ID}` +
    `&redirect_uri=${GITHUB_REDIRECT_URI}` +
    `&scope=user:email` +
    `&state=${state}`;
  return url;
}

export async function githubCallbackService(code, state, mode, currentUserId = null) {
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_REDIRECT_URI
    },
    { headers: { Accept: "application/json" } }
  );

  console.log("Token response from GitHub:", tokenRes.data);
  const githubAccessToken = tokenRes.data.access_token;
  
  if (!githubAccessToken) {
    throw { status: 400, message: "GitHub không trả về access token" };
  }
  const profileRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${githubAccessToken}` }
  });

  const emailRes = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${githubAccessToken}` }
  });

  const githubUser = profileRes.data;

  const primaryEmail = emailRes.data.find((e) => e.primary)?.email || emailRes.data[0].email;

  
  if (mode === "link") {
    if (!currentUserId) {
      throw { status: 400, message: "Không có user hiện tại để liên kết GitHub" };
    }
  const currentUser = await User.findByPk(currentUserId);
  if (!currentUser) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }
  const conflictUser = await User.findOne({
    where: {
      github_id: githubUser.id
    }});
  if (conflictUser) throw { status: 400, message: "GitHub này đã được liên kết với tài khoản khác" };
  currentUser.github_id = githubUser.id;
  currentUser.avatar_url = githubUser.avatar_url;
  currentUser.github_access_token = githubAccessToken;
  await currentUser.save();
  return {
      mode: "link",
      message: "Liên kết GitHub thành công",
      user
    };
  }


  let user = await User.findOne({ where: { email: primaryEmail } });
  if (!user) {
    user = await User.create({
      email: primaryEmail,
      username: githubUser.login,
      github_id: githubUser.id,
      avatar_url: githubUser.avatar_url,
      password: null,
      role: "User"
    });
  } else {
    await user.update({
      github_id: githubUser.id,
      github_access_token: githubAccessToken,
      avatar_url: githubUser.avatar_url
  });
}
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
  return {
    mode: "login",
    user,
    accessToken,
    refreshToken,
    state
  };
}