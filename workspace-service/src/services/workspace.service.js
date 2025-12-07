import crypto from "crypto";
import { Workspace } from "../models/workspace.model.js";
import { WorkspaceMember } from "../models/workspace_member.model.js";


export const WorkspaceService = {
  async createWorkspace({ name, description, owner_id }) {
    if (!name) throw { status: 400, message: "Tên workspace bắt buộc" };

    const workspace_token = crypto.randomBytes(3).toString("hex");

    const ws = await Workspace.create({
      name,
      description,
      workspace_token
    });

    await WorkspaceMember.create({
      workspace_id: ws.workspace_id,
      user_id: owner_id,
      workspace_role: "Owner"
    });

    return ws;
  },

  async getWorkspaceDetail(id) {
    const ws = await Workspace.findByPk(id, {
      include: [{ model: WorkspaceMember, as: "members" }]
    });

    if (!ws) throw { status: 404, message: "Workspace không tồn tại" };

    return ws;
  },

  async getUserWorkspaces(user_id) {
    const list = await Workspace.findAll({
      include: [
        {
          model: WorkspaceMember,
          as: "members",
          where: { user_id }
        }
      ]
    });

    return list;
  },

  async updateWorkspace(id, owner_id, { name, description }) {
    const owner = await WorkspaceMember.findOne({
      where: { workspace_id: id, user_id: owner_id, workspace_role: "Owner" }
    });
    if (!owner) throw { status: 403, message: "Bạn không phải Owner" };

    const ws = await Workspace.findByPk(id);
    if (!ws) throw { status: 404, message: "Workspace không tồn tại" };
    ws.name = name || ws.name;
    ws.description = description || ws.description;
    await ws.save();
    return ws;
  },

  async deleteWorkspace(id, owner_id) {
    const owner = await WorkspaceMember.findOne({
      where: { workspace_id: id, user_id: owner_id, workspace_role: "Owner" }
    });

    if (!owner) throw { status: 403, message: "Bạn không phải Owner" };

    await Workspace.destroy({ where: { workspace_id: id } });

    return { message: "Xóa workspace thành công" };
  }
};
