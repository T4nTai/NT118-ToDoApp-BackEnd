import { ExternalAccount } from "../models/external_account.model.js";
import { getUserById } from "../helper/auth.helper.js";

export async function upsertExternalAccountService({
  user_id,
  provider,
  external_user_id,
  access_token,
  refresh_token,
  expires_at,
  scopes,
}) {
  if (!user_id || !provider || !access_token) {
    throw { status: 400, message: "Thiếu user_id, provider hoặc access_token" };
  }

  await getUserById(user_id); // gọi auth-service check user tồn tại

  const [account, created] = await ExternalAccount.findOrCreate({
    where: { user_id, provider },
    defaults: {
      external_user_id,
      access_token,
      refresh_token: refresh_token || null,
      expires_at: expires_at || null,
      scopes: scopes || null,
    },
  });

  if (!created) {
    account.external_user_id = external_user_id || account.external_user_id;
    account.access_token = access_token;
    account.refresh_token = refresh_token || account.refresh_token;
    account.expires_at = expires_at || account.expires_at;
    account.scopes = scopes || account.scopes;
    await account.save();
  }

  return account;
}

export async function getExternalAccountsOfUserService(user_id) {
  await getUserById(user_id);

  const accounts = await ExternalAccount.findAll({
    where: { user_id },
    order: [["provider", "ASC"]],
  });

  return accounts;
}

export async function deleteExternalAccountService(user_id, provider) {
  if (!provider) {
    throw { status: 400, message: "Thiếu provider" };
  }

  await getUserById(user_id);

  const deleted = await ExternalAccount.destroy({
    where: { user_id, provider },
  });

  if (!deleted) {
    throw { status: 404, message: "Không tìm thấy tài khoản external để xoá" };
  }

  return { message: "Xoá external account thành công" };
}
