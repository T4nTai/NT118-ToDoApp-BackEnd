import {
  createProjectService,
  getProjectsByOwnerService,
  assignProjectToGroupService,
  assignProjectToUserService,
  updateProjectService,
  deleteProjectService,
  getProjectsOfMemberService,
  getProjectMembersService,
  addMemberToProjectService,
} from "../services/project.service.js";

export async function createProject(req, res, next) {
  try {
    const owner_id = req.user.id; 
    const {
      workspace_id,
      name,
      description,
      status,
      priority,
      start_date,
      due_date,
    } = req.body;

    const project = await createProjectService(
      {
        workspace_id,
        name,
        description,
        status,
        priority,
        start_date,
        due_date,
        owner_id,
      },
      req.file || null
    );

    return res
      .status(201)
      .json({ message: "Tạo dự án thành công", project });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getProjectsByOwner(req, res, next) {
  try {
    const owner_id = req.user.id;

    const projects = await getProjectsByOwnerService(owner_id);

    return res.status(200).json({ projects });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getMyProjects(req, res, next) {
  try {
    const user_id = req.user.id;

    const projects = await getProjectsOfMemberService(user_id);

    return res.status(200).json({ projects });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function assignProjectToGroup(req, res, next) {
  try {
    const inviter_id = req.user.id;
    const { project_id, group_id, role } = req.body;

    const project = await assignProjectToGroupService(
      project_id,
      group_id,
      inviter_id,
      role
    );

    return res.status(200).json({
      message: "Giao dự án cho nhóm thành công",
      project,
    });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function assignProjectToUser(req, res, next) {
  try {
    const inviter_id = req.user.id;
    const { project_id, user_id, role } = req.body;

    const project = await assignProjectToUserService(
      project_id,
      user_id,
      inviter_id,
      role
    );

    return res.status(200).json({
      message: "Giao dự án cho người dùng thành công",
      project,
    });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function addMemberToProject(req, res, next) {
  try {
    const inviter_id = req.user.id;
    const { project_id, email, role } = req.body;

    const result = await addMemberToProjectService({
      project_id,
      email,
      role,
      inviter_id,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const owner_id = req.user.id;
    const { project_id } = req.params;
    const updates = req.body;

    const project = await updateProjectService(project_id, owner_id, updates);

    return res.status(200).json({
      message: "Cập nhật dự án thành công",
      project,
    });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const owner_id = req.user.id;
    const { project_id } = req.params;

    const result = await deleteProjectService(project_id, owner_id);

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getProjectMembers(req, res, next) {
  try {
    const { project_id } = req.params;

    const members = await getProjectMembersService(project_id);

    return res.status(200).json({ project_id, members });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
