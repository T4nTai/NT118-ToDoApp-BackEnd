import { WorkspaceMember } from "../models/workspace_member.model.js";

export const MemberService = {
  async addMember(workspace_id, user_id, role = "Member") {
    const exists = await WorkspaceMember.findOne({
      where: { workspace_id, user_id }
    });

    if (exists) throw { status: 400, message: "Người dùng đã có trong workspace" };

    await WorkspaceMember.create({
      workspace_id,
      user_id,
      workspace_role: role
    });

    return { message: "Thêm thành viên thành công" };
  },

  async removeMember(workspace_id, user_id) {
    await WorkspaceMember.destroy({ where: { workspace_id, user_id } });

    return { message: "Đã xóa thành viên" };
  }
};
