import internalApi from "../config/internalAPI.js";

export async function getUserIdByEmail(email) {
  if (!email) {
    throw { status: 400, message: "Thiếu email" };
  }

  try {
    const res = await internalApi.get("/internal/auth/users", {
      params: { email },
    });

    return res.data.user_id;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: "Người dùng không tồn tại" };
    }
    console.error("Internal auth error:", err.message);
    throw { status: 500, message: "Lỗi gọi auth-service" };
  }
}

export async function checkUserExists(user_id) {
  try {
    const res = await internalApi.get(`/internal/auth/users/${user_id}`);
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      throw { status: 404, message: "Người dùng không tồn tại" };
    }
    console.error("Internal auth error:", err.message);
    throw { status: 500, message: "Lỗi gọi auth-service" };
  }
}
