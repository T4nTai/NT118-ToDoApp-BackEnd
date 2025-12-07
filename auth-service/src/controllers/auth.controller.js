import {
  registerService,
  loginService,
  refreshTokenService,
} from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const result = await registerService(req.body);
    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        user_id: result.user.user_id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginService(req.body);
    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        user_id: result.user.user_id,
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;
    const result = await refreshTokenService(refresh_token);
    return res.status(200).json({
      message: "Refresh token thành công",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
