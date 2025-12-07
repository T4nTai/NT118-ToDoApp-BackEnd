import { Project } from "../models/project.model.js";

export async function checkProjectExists(project_id) {
  const project = await Project.findByPk(project_id);
  if (!project) {
    throw { status: 404, message: "Project not found" };
  }
  return project;
}