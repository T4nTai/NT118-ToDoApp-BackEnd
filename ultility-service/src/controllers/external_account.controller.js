// utility-service/src/controllers/external_account.controller.js
import {
  upsertExternalAccountService,
  getExternalAccountsOfUserService,
  deleteExternalAccountService,
} from "../services/external_account.service.js";

export class ExternalAccountController {
  static async linkOrUpdate(req, res) {
    try {
      const user_id = req.user.id;
      const { provider } = req.params;
      const { external_user_id, access_token, refresh_token, expires_at, scopes } =
        req.body;

      const account = await upsertExternalAccountService({
        user_id,
        provider,
        external_user_id,
        access_token,
        refresh_token,
        expires_at,
        scopes,
      });

      res.status(200).json({ message: "Liên kết/ cập nhật thành công", account });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async myAccounts(req, res) {
    try {
      const user_id = req.user.id;
      const accounts = await getExternalAccountsOfUserService(user_id);
      res.status(200).json({ accounts });
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }

  static async deleteMyProvider(req, res) {
    try {
      const user_id = req.user.id;
      const { provider } = req.params;

      const result = await deleteExternalAccountService(user_id, provider);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status || 500).json({ message: err.message });
    }
  }
}
