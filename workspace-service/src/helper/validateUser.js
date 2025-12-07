import axios from "axios";
import { AUTH_SERVICE_URL } from "../config/env.js";

export async function validateUserExists(user_id) {
  try {
    const url = AUTH_SERVICE_URL + `/users/${user_id}`;
    await axios.get(url);
  } catch (err) {
    throw { status: 404, message: "User does not exist" };
  }
}