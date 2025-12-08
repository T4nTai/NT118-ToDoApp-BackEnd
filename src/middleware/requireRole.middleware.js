import { ProjectMember } from "../models/project_member.model.js";

export function requireProjectRole(requiredRole) {
  return async function (req, res, next) {
    try {
      const user_id = req.user.id;

      // lấy project_id từ body, params, hoặc query
      const project_id = 
        req.body.project_id ||
        req.params.project_id ||
        req.query.project_id;

      if (!project_id) {
        return res.status(400).json({ message: "Thiếu project_id" });
      }

      const member = await ProjectMember.findOne({
        where: { project_id, user_id }
      });

      if (!member) {
        return res.status(403).json({ message: "Bạn không thuộc project này" });
      }

      // Cho phép Owner override tất cả
      const userRole = member.role;

      if (userRole !== requiredRole && userRole !== "Owner") {
        return res.status(403).json({
          message: `Bạn cần quyền ${requiredRole} để thực hiện hành động này`
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}
