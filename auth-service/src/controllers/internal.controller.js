import { findUserById, findUserByEmail, findUserByPhone } from "../services/user.service.js";

export async function internalGetUserById(req, res, next) {
  try {
    const { user_id } = req.params;
    const user = await findUserById(user_id);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    return res.json({
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

export async function internalGetUserByEmail(req, res, next) {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    return res.json({
      user_id: user.user_id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}

export async function internalGetUserByPhone(req, res, next) {
  try {
    const { phone_number } = req.query;
    if (!phone_number) return res.status(400).json({ message: "Thiếu sdt" });

    const user = await findUserByPhone(phone_number);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    return res.json({
      user_id: user.user_id,
      phone_number: user.phone_number,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
}
