import { Task } from '../models/task.model.js';
import { User } from '../models/auth.model.js';
import { Subtask } from '../models/subtask.model.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project_member.model.js';


export async function createTaskService({ title, description, project_id, milestone_id, assigned_to, created_by, priority, start_date, due_date }) {
    if (!title || !created_by) {
        throw { status: 400, message: "Thiếu title hoặc created_by" };
    }
    let step_id = null;
    if (!project_id) {
        const task = await Task.create({
            title,
            description: description || null,
            project_id: null,
            milestone_id: milestone_id || null,
            created_by,
            assigned_to: assigned_to || null,
            priority: priority || "Medium",
            start_date: start_date || null,
            due_date: due_date || null,
            step_id: null 
        });

        return task;
    }
    if (project_id) {
        const project = await Project.findByPk(project_id);
        if (!project) {
            throw { status: 404, message: "Project không tồn tại" };
        }
        if (project.workflow_id) {
            const firstStep = await WorkflowStep.findOne({
                where: { workflow_id: project.workflow_id },
                order: [["step_order", "ASC"]],
            });

            if (firstStep) step_id = firstStep.step_id;
        }
        if (assigned_to) {
            const member =
                await ProjectMember.findOne({
                    where: { project_id, user_id: assigned_to },
                }) ||
                (project.assigned_group_id &&
                    await GroupMember.findOne({
                        where: {
                            group_id: project.assigned_group_id,
                            user_id: assigned_to,
                        },
                    }));
            if (!member) {
                throw {
                    status: 403,
                    message: "User không thuộc project hoặc group được assign",
                };
            }
        }
    }
    const task = await Task.create({
        title,
        description,
        project_id: project_id || null,
        milestone_id: milestone_id || null,
        created_by,
        assigned_to: assigned_to || null,
        priority: priority || "Medium",
        start_date: start_date || null,
        due_date: due_date || null,
        step_id,
    });
    return task;
}

export async function viewTasksAssignToService(user_id, statusFilter) {
  const tasks = await Task.findAll({
    where: {
      assigned_to: user_id,
      ...(statusFilter && { status: statusFilter })
    },
    include: [
      { model: User, as: "creator", attributes: ["user_id", "username", "email"] },
      { model: User, as: "assignee", attributes: ["user_id", "username", "email"] },
      { model: Project, as: "project", attributes: ["project_id", "name"] },
      { model: Subtask, as: "subtasks" }
    ]
  });

  return tasks;
}

export async function viewTasksCreatedByUserService(user_id, statusFilter) {
  const tasks = await Task.findAll({
    where: {
      created_by: user_id,
      ...(statusFilter && { status: statusFilter })
    },
    include: [
      { model: User, as: "creator", attributes: ["user_id", "username", "email"] },
      { model: User, as: "assignee", attributes: ["user_id", "username", "email"] },
      { model: Project, as: "project", attributes: ["project_id", "name"] },
      { model: Subtask, as: "subtasks" }
    ],
    order: [["created_at", "DESC"]]
  });

  return tasks;
}


export async function assignTaskService(task_id, user_id) {
    const task = await Task.findByPk(task_id);
    if (!task) throw { status: 404, message: "Task không tồn tại" };
    if (task.project_id) {
        const project = await Project.findByPk(task.project_id);

        const member =
            await ProjectMember.findOne({
                where: { project_id: task.project_id, user_id },
            }) ||
            (project.assigned_group_id &&
                await GroupMember.findOne({
                    where: {
                        group_id: project.assigned_group_id,
                        user_id,
                    },
                }));

        if (!member) {
            throw {
                status: 403,
                message: "User không thuộc project hoặc group được assign",
            };
        }
    }
    task.assigned_to = user_id;
    await task.save();

    return {
        message: "Giao task thành công",
        task,
    };
}


export async function updateTaskService(task_id, updateData) {
    const task = await Task.findByPk(task_id);
    if (!task) throw { status: 404, message: "Task không tồn tại" };
    const allowedFields = [
        "title",
        "description",
        "status",
        "priority",
        "assigned_to",
        "step_id",
        "start_date",
        "due_date",
        "task_progress",
        "completed_at"
    ];
    const validUpdates = {};
    for (const key of Object.keys(updateData)) {
        if (allowedFields.includes(key)) {
            validUpdates[key] = updateData[key];
        }
    }
    if (Object.keys(validUpdates).length === 0) {
        throw { status: 400, message: "Không có field hợp lệ để cập nhật" };
    }
    Object.assign(task, validUpdates);
    await task.save();
    return task;
}


export async function updateTaskStatusIfSubtasksCompletedService(task_id) {
  const task = await Task.findByPk(task_id, {
    include: [
      {
        model: Subtask,
        as: "subtasks"
      }
    ]
  });

  if (!task) throw { status: 404, message: "Task không tồn tại" };ì
  if (!task.subtasks || task.subtasks.length === 0) {
    return task;
  }
  const allCompleted = task.subtasks.every(st => st.status === "Done");

  if (allCompleted && task.status !== "Done") {
    task.status = "Done";
    await task.save();
  }
  return task;
}

export async function deleteTaskService(task_id) {
    const task = await Task.findByPk(task_id);

    if (!task) {
        throw { status: 404, message: "Task không tồn tại" };
    }

    await task.destroy();

    return { message: "Xóa task thành công", task_id };
}




