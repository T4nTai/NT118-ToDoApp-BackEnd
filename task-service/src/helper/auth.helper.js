import { authInternalApi } from "../config/internalAPI.js";

export async function getUserById(user_id) {
  try {
    const res = await authInternalApi.get(`/internal/auth/users/${user_id}`);
    return res.data;
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, message: "User không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi auth-service" };
  }
}

export async function getUserIdByEmail(email) {
  if (!email) throw { status: 400, message: "Thiếu email" };
  try {
    const res = await authInternalApi.get("/internal/auth/users", {
      params: { email },
    });
    return res.data.user_id;
  } catch (err) {
    if (err.response?.status === 404) {
      throw { status: 404, message: "User không tồn tại" };
    }
    throw { status: 500, message: "Lỗi gọi auth-service 1"  };
  }
}
