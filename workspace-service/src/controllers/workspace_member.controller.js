import { MemberService } from "../services/workspace_member.service.js";

export class MemberController {
  static async add(req, res, next) {
    try {
      const { workspace_id, user_id, role } = req.body;
      const result = await MemberService.addMember(workspace_id, user_id, role);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req, res, next) {
    try {
      const { workspace_id, user_id } = req.body;
      const result = await MemberService.removeMember(workspace_id, user_id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
