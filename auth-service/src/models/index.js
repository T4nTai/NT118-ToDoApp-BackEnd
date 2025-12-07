import { User } from "./user.model.js";
import { RefreshToken } from "./token.model.js";

export default function initModels() {
  User.hasMany(RefreshToken, { foreignKey: "user_id", as: "refreshTokens" });
  RefreshToken.belongsTo(User, { foreignKey: "user_id", as: "user" });
}

export { User, RefreshToken };