import { ProjectMember } from "../models/project_member.model.js";
import { Project } from "../models/project.model.js";

export function requireProjectRole(requiredRole) {
  return async function (req, res, next) {
    try {
      const user_id = req.user.id;
      const { project_id } = req.body; 
       
      if (!project_id) {
        return next();
      }

      const project = await Project.findByPk(project_id);
      if (!project) {
        return res.status(404).json({ message: "Project không tồn tại" });
      }

      const member = await ProjectMember.findOne({
        where: { project_id, user_id }
      });

      if (!member) {
        return res.status(403).json({ message: "Bạn không thuộc project này" });
      }

      if (member.project_role !== requiredRole) {
        return res.status(403).json({
          message: `Bạn không có quyền ${requiredRole} để thực hiện hành động này`
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
