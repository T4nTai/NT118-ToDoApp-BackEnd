import { WorkspaceMember } from "../models/workspace_member.model.js";

export async function requireWorkspaceMember(req, res, next) {
  const workspace_id = req.params.workspace_id || req.body.workspace_id;

  if (!workspace_id) {
    return res.status(400).json({ message: "Thiếu workspace_id" });
  }

  const member = await WorkspaceMember.findOne({
    where: { user_id: req.user.id, workspace_id }
  });

  if (!member) {
    return res.status(403).json({ message: "Bạn không thuộc workspace này" });
  }

  req.workspaceRole = member.workspace_role;  // Gắn role
  next();
}

export function requireWorkspaceRole(roles = []) {
  return (req, res, next) => {
    if (!roles.includes(req.workspaceRole)) {
      return res.status(403).json({ message: "Không có quyền thực hiện hành động này" });
    }
    next();
  };
}
