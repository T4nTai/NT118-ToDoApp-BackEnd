import {
  addWorkspaceMemberService,
  updateWorkspaceMemberRoleService,
  removeWorkspaceMemberService,
} from "../services/workspace_member.service.js";

export async function addMember(req, res, next) {
  try {
    const requester_id = req.user.id;
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const { user_id, workspace_role } = req.body;

    const member = await addWorkspaceMemberService({
      workspace_id,
      requester_id,
      user_id,
      workspace_role,
    });

    return res.status(201).json({
      message: "Thêm thành viên thành công",
      member,
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function updateMemberRole(req, res, next) {
  try {
    const requester_id = req.user.id;
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const user_id = parseInt(req.params.user_id, 10);
    const { workspace_role } = req.body;

    const member = await updateWorkspaceMemberRoleService({
      workspace_id,
      requester_id,
      user_id,
      workspace_role,
    });

    return res.status(200).json({
      message: "Cập nhật role thành công",
      member,
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const requester_id = req.user.id;
    const workspace_id = parseInt(req.params.workspace_id, 10);
    const user_id = parseInt(req.params.user_id, 10);

    await removeWorkspaceMemberService({
      workspace_id,
      requester_id,
      user_id,
    });

    return res.status(200).json({
      message: "Xoá thành viên thành công",
    });
  } catch (err) {
    if (err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
