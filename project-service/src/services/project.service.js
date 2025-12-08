import {
  Project,
  ProjectMember,
  ProjectGroup,
  Workflow,
  WorkflowStep,
} from "../models/index.js";

import { ensureWorkspaceExists } from "../helper/workspace.helper.js";
import {
  ensureGroupExists,
  getGroupMembers,
} from "../helper/group.helper.js";
import {
  getUserById,
  getUserIdByEmail,
} from "../helper/auth.helper.js";

import { utilityInternalApi } from "../config/internalAPI.js";

async function getProjectOrThrow(project_id) {
  const project = await Project.findByPk(project_id);
  if (!project) throw { status: 404, message: "Dự án không tồn tại" };
  return project;
}

export async function createProjectService(data, file) {
  const {
    workspace_id,
    name,
    description,
    status,
    priority,
    start_date,
    due_date,
    owner_id,
    attachments,        
  } = data;

  if (!workspace_id || !name || !owner_id) {
    throw {
      status: 400,
      message: "Thiếu workspace_id, name hoặc owner_id",
    };
  }

  await ensureWorkspaceExists(workspace_id);

  await getUserById(owner_id);

  if (start_date && due_date && new Date(start_date) > new Date(due_date)) {
    throw {
      status: 400,
      message: "Ngày bắt đầu không thể sau ngày kết thúc",
    };
  }

  const project = await Project.create({
    workspace_id,
    name,
    description: description || null,
    status: status || "To Do",
    priority: priority || "Medium",
    start_date: start_date || null,
    due_date: due_date || null,
    owner_id,
    assigned_group_id: null,
    assigned_user_id: null,
  });

  const workflow = await Workflow.create({
    project_id: project.project_id,
    name: `${name} Workflow`,
    description: null,
  });

  const defaultSteps = [
    { name: "To Do", step_order: 1 },
    { name: "In Progress", step_order: 2 },
    { name: "Review", step_order: 3 },
    { name: "Done", step_order: 4 },
  ];

  for (const step of defaultSteps) {
    await WorkflowStep.create({
      workflow_id: workflow.workflow_id,
      name: step.name,
      step_order: step.step_order,
    });
  }

  await ProjectMember.create({
    project_id: project.project_id,
    user_id: owner_id,
    role: "Owner",
  });

  if (Array.isArray(attachments) && attachments.length > 0) {
    for (const att of attachments) {
      try {
        await utilityInternalApi.post("/internal/file", {
          owner_user_id: owner_id,
          provider: att.provider || "cloudinary",
          public_id: att.public_id || null,
          url: att.url,                          
          resource_type: att.resource_type || "file",
          context_type: "attachment",            
          context_id: project.project_id,        
        });
      } catch (err) {
        console.error(
          "[project-service] Lỗi tạo attachment:",
          err.response?.data || err.message || err
        );
      }
    }
  }

  return project;
}

export async function getProjectMembersService(project_id) {
  await getProjectOrThrow(project_id);

  const members = await ProjectMember.findAll({
    where: { project_id },
    order: [["joined_at", "ASC"]],
  });

  const result = [];
  for (const m of members) {
    let userInfo = null;
    try {
      userInfo = await getUserById(m.user_id);
    } catch (err) {}

    result.push({
      user_id: m.user_id,
      username: userInfo?.username || null,
      email: userInfo?.email || null,
      role: m.role,
      joined_at: m.joined_at,
    });
  }

  return result;
}

export async function getProjectsByOwnerService(owner_id) {
  await getUserById(owner_id);

  const projects = await Project.findAll({
    where: { owner_id },
  });

  return projects;
}

export async function updateProjectService(project_id, owner_id, updates) {
  const project = await getProjectOrThrow(project_id);

  if (project.owner_id !== owner_id) {
    throw {
      status: 403,
      message: "Bạn không có quyền sửa dự án này",
    };
  }

  const allowedFields = [
    "name",
    "description",
    "status",
    "priority",
    "start_date",
    "due_date",
    "assigned_user_id",
    "assigned_group_id",
  ];

  const dataToUpdate = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      dataToUpdate[key] = updates[key];
    }
  }

  if (dataToUpdate.start_date && dataToUpdate.due_date) {
    if (new Date(dataToUpdate.start_date) > new Date(dataToUpdate.due_date)) {
      throw {
        status: 400,
        message: "start_date không thể sau due_date",
      };
    }
  }

  await project.update(dataToUpdate);
  return project;
}

export async function assignProjectToGroupService(
  project_id,
  group_id,
  inviter_id,
  role = "Contributor"
) {
  const project = await getProjectOrThrow(project_id);

  await ensureGroupExists(group_id);

  await getUserById(inviter_id);

  project.assigned_group_id = group_id;
  project.assigned_user_id = null;
  await project.save();

  const pg = await ProjectGroup.findOne({
    where: { project_id, group_id },
  });
  if (!pg) {
    await ProjectGroup.create({ project_id, group_id });
  }
  const groupMembers = await getGroupMembers(group_id);

  for (const gm of groupMembers) {
    const user_id = gm.user_id;

    const exists = await ProjectMember.findOne({
      where: { project_id, user_id },
    });

    if (!exists) {
      await ProjectMember.create({
        project_id,
        user_id,
        role: role || "Contributor",
      });
    } else {
      if (exists.role !== (role || "Contributor")) {
        exists.role = role || "Contributor";
        await exists.save();
      }
    }
  }

  return project;
}

export async function assignProjectToUserService(
  project_id,
  user_id,
  inviter_id,
  role = "Contributor"
) {
  const project = await getProjectOrThrow(project_id);

  await getUserById(user_id);
  await getUserById(inviter_id);

  project.assigned_user_id = user_id;
  project.assigned_group_id = null;
  await project.save();

  const exists = await ProjectMember.findOne({
    where: { project_id, user_id },
  });

  if (!exists) {
    await ProjectMember.create({
      project_id,
      user_id,
      role,
    });
  }

  return project;
}

export async function addMemberToProjectService({
  project_id,
  email,
  role = "Contributor",
  inviter_id,
}) {
  if (!project_id || !email) {
    throw { status: 400, message: "Cần project_id và email" };
  }
  const project = await getProjectOrThrow(project_id);
  if (role === "Manager" && project.owner_id !== inviter_id) {
    throw {
      status: 403,
      message: "Chỉ Owner mới có thể thêm Manager vào dự án",
    };
  }

  if (role === "Owner") {
    throw { status: 403, message: "Không thể thêm Owner mới" };
  }
  const user_id = await getUserIdByEmail(email);
  const userInfo = await getUserById(user_id);

  const existed = await ProjectMember.findOne({
    where: { project_id, user_id },
  });

  if (existed) {
    throw {
      status: 400,
      message: "Người dùng đã là thành viên của dự án",
    };
  }

  await ProjectMember.create({
    project_id,
    user_id,
    role,
  });

  return {
    message: "Thêm thành viên vào dự án thành công",
    member: {
      user_id,
      email: userInfo.email,
      username: userInfo.username,
      role,
    },
  };
}

export async function getProjectsOfMemberService(user_id) {
  await getUserById(user_id);

  const memberships = await ProjectMember.findAll({
    where: { user_id },
    include: [
      {
        model: Project,
        as: "project",
      },
    ],
  });

  return memberships.map((m) => ({
    project_id: m.project_id,
    role: m.role,
    project: m.project,
  }));
}

export async function deleteProjectService(project_id, owner_id) {
  const project = await getProjectOrThrow(project_id);

  if (project.owner_id !== owner_id) {
    throw {
      status: 403,
      message: "Bạn không có quyền xoá dự án này",
    };
  }

  await ProjectMember.destroy({ where: { project_id } });
  await ProjectGroup.destroy({ where: { project_id } });
  await Workflow.destroy({ where: { project_id } });

  await project.destroy();

  return { message: "Xoá dự án thành công" };
}

export async function checkProjectExistsService(project_id) {
  const project = await getProjectOrThrow(project_id);
  return project;
}

export async function getProjectDetailService(project_id) {
  const project = await getProjectOrThrow(project_id);
  return project;
}

export async function getUserProjectsInternalService(user_id) {
  return getProjectsOfMemberService(user_id);
}
