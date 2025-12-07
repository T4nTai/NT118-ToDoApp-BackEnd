import { AuthService } from "../services/auth.services.js";

export class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.signUp(req.body);
      res.json({ message: "Đăng Ký Thành Công", user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, phone_number, password } = req.body;
      const mode = req.query.mode || "web"; 

      const result = await AuthService.signIn(
        email,
        phone_number,
        password,
        mode
      );

      if (result.type === "web") {
        res.cookie("refreshToken", result.cookieRefreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({
          message: "Đăng Nhập Thành Công",
          user: result.user,
          accessToken: result.accessToken
        });
      }

      return res.json({
        message: "Đăng Nhập Thành Công",
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      });

    } catch (err) {
      next(err);
    }
  }

  static async refresh(req, res, next) {
    try {
      const mode = req.query.mode || "web";  
      const tokenFromCookie = req.cookies.refreshToken;
      const tokenFromBody = req.body.refreshToken;
      const refreshToken = mode === "web" ? tokenFromCookie : tokenFromBody;
      const data = await AuthService.refreshService(refreshToken, mode);
      if (data.type === "web") {
        return res.json({
          accessToken: data.accessToken
        });
      }
      return res.json({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      });

    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const user_id = req.params.user_id;
      const user = await AuthService.getUserById(user_id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
  try {
    const mode = req.query.mode || "web";
    const tokenFromCookie = req.cookies.refreshToken;
    const tokenFromBody = req.body.refreshToken;

    const refreshToken = mode === "web" ? tokenFromCookie : tokenFromBody;
    const result = await AuthService.signOut(refreshToken);
    if (mode === "web") {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
      });
    }
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
}
