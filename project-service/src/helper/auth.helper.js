import { internalApi } from "../../config/internalApi.js";
import { AUTH_SERVICE_URL, INTERNAL_SECRET } from "../../config/env.js";


export async function checkUserExists(user_id) {
  try {
    const res = await internalApi.get(
      `${AUTH_SERVICE_URL}/internal/user/${user_id}/exists`,
      { headers: { "x-internal-token": INTERNAL_SECRET } }
    );
    return res.data.exists;
  } catch {
    throw { status: 503, message: "Auth service unavailable" };
  }
}


export async function getUserById(user_id) {
  try {
    const res = await internalApi.get(
      `${AUTH_SERVICE_URL}/internal/user/${user_id}`,
      { headers: { "x-internal-token": INTERNAL_SECRET } }
    );
    return res.data.user;
  } catch {
    throw { status: 503, message: "Auth service unavailable" };
  }
}

export async function getUserIdByEmail(email) {
  try {
    const res = await internalApi.get(
      `${AUTH_SERVICE_URL}/internal/user/email/${email}`,
      { headers: { "x-internal-token": INTERNAL_SECRET } }
    );
    return res.data.user_id;
  } catch {
    throw { status: 503, message: "Auth service unavailable" };
  }
}
