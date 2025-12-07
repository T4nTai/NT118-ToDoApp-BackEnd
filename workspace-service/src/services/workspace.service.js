import { WorkspaceMember } from "../models/workspace_member.model.js";
import { Workspace } from "../models/workspace.model.js";

import { checkWorkspaceExists } from "../helper/checkWorkspace.js";
import { checkWorkspacePermission } from "../helper/checkPermission.js";
import { validateUserExists } from "../helper/validateUser.js";

import crypto from "crypto";

export class WorkspaceService {

  static async createWorkspace({ name, description, owner_id }) {
    if (!name) throw { status: 400, message: "Name is required" };

    const workspace_token = crypto.randomBytes(16).toString("hex");

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
  }

  static async getUserWorkspaces(user_id) {
    return await WorkspaceMember.findAll({
      where: { user_id },
      include: [{ model: Workspace, as: "workspace" }]
    });
  }

  static async getWorkspaceDetail(workspace_id) {
    return await checkWorkspaceExists(workspace_id);
  }

  static async getMembers(workspace_id) {
    await checkWorkspaceExists(workspace_id);
    return await WorkspaceMember.findAll({ where: { workspace_id } });
  }

  static async addMember({ workspace_id, target_user_id, role, requester_id }) {
    await checkWorkspaceExists(workspace_id);
    const requester = await checkWorkspacePermission(workspace_id, requester_id);
    await validateUserExists(target_user_id);
    if(!requester) {
      throw { status: 403, message: "You are not a member of this workspace" };
    }
    const exists = await WorkspaceMember.findOne({
      where: { workspace_id, user_id: target_user_id }
    });

    if (exists) throw { status: 400, message: "User already in workspace" };

    return await WorkspaceMember.create({
      workspace_id,
      user_id: target_user_id,
      workspace_role: role || "Member"
    });
  }

  static async removeMember({ workspace_id, target_user_id, requester_id }) {
    await checkWorkspaceExists(workspace_id);
    const requester = await checkWorkspacePermission(workspace_id, requester_id);

    if (requester.user_id === target_user_id && requester.workspace_role === "Owner")
      throw { status: 400, message: "Owner cannot remove themselves" };

    const member = await WorkspaceMember.findOne({
      where: { workspace_id, user_id: target_user_id }
    });

    if (!member)
      throw { status: 404, message: "User is not a member" };

    if (member.workspace_role === "Owner")
      throw { status: 403, message: "Cannot remove workspace owner" };

    await WorkspaceMember.destroy({
      where: { workspace_id, user_id: target_user_id }
    });

    return true;
  }

  static async checkAccess(workspace_id, user_id) {
    await checkWorkspaceExists(workspace_id);
    const member = await WorkspaceMember.findOne({
      where: { workspace_id, user_id }
    });
    return {
      workspace_id,
      is_member: !!member,
      role: member?.workspace_role || null
    };
  }
}
