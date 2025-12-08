import { WorkspaceMember } from "../models/workspace_member.model.js";


function canManageWorkspaceMembers(role) {
  return role === "Owner" || role === "Admin";
}
export async function addWorkspaceMemberService({
  workspace_id,
  requester_id,
  user_id,
  workspace_role = "Member",
}) {
  if (!workspace_id || !requester_id || !user_id) {
    throw { status: 400, message: "Thiếu workspace_id, requester_id hoặc user_id" };
  }

  const requesterMember = await WorkspaceMember.findOne({
    where: { workspace_id, user_id: requester_id },
  });

  if (!requesterMember) {
    throw { status: 403, message: "Bạn không thuộc workspace này" };
  }

  if (!canManageWorkspaceMembers(requesterMember.workspace_role)) {
    throw { status: 403, message: "Không có quyền thêm thành viên" };
  }

  const existed = await WorkspaceMember.findOne({
    where: { workspace_id, user_id },
  });

  if (existed) {
    throw { status: 400, message: "Thành viên đã tồn tại trong workspace" };
  }

  const member = await WorkspaceMember.create({
    workspace_id,
    user_id,
    workspace_role,
  });

  return member;
}

export async function updateWorkspaceMemberRoleService({
  workspace_id,
  requester_id,
  user_id,
  workspace_role,
}) {
  if (!workspace_id || !requester_id || !user_id || !workspace_role) {
    throw { status: 400, message: "Thiếu tham số" };
  }

  const requesterMember = await WorkspaceMember.findOne({
    where: { workspace_id, user_id: requester_id },
  });

  if (!requesterMember) {
    throw { status: 403, message: "Bạn không thuộc workspace này" };
  }

  if (!canManageWorkspaceMembers(requesterMember.workspace_role)) {
    throw { status: 403, message: "Không có quyền chỉnh sửa role" };
  }

  const member = await WorkspaceMember.findOne({
    where: { workspace_id, user_id },
  });

  if (!member) {
    throw { status: 404, message: "Thành viên không tồn tại trong workspace" };
  }

  // Không cho phép hạ Owner nếu cần bạn có thể thêm rule ở đây

  member.workspace_role = workspace_role;
  await member.save();

  return member;
}

export async function removeWorkspaceMemberService({
  workspace_id,
  requester_id,
  user_id,
}) {
  if (!workspace_id || !requester_id || !user_id) {
    throw { status: 400, message: "Thiếu tham số" };
  }

  const requesterMember = await WorkspaceMember.findOne({
    where: { workspace_id, user_id: requester_id },
  });

  if (!requesterMember) {
    throw { status: 403, message: "Bạn không thuộc workspace này" };
  }

  if (!canManageWorkspaceMembers(requesterMember.workspace_role)) {
    throw { status: 403, message: "Không có quyền xoá thành viên" };
  }

  const member = await WorkspaceMember.findOne({
    where: { workspace_id, user_id },
  });

  if (!member) {
    throw { status: 404, message: "Thành viên không tồn tại trong workspace" };
  }

  await member.destroy();

  return true;
}
