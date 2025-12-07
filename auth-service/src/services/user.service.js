import { User } from "../models/index.js";

export async function findUserByEmail(email) {
  return User.findOne({ where: { email } });
}

export async function findUserById(user_id) {
  return User.findByPk(user_id);
}

export async function findUserByPhone(phone_number) {
  return User.findOne({ where: { phone_number } });
}

export async function createUser(data) {
  return User.create(data);
}
