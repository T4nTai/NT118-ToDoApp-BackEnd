import { Milestone } from "../models/milestone.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/auth.model.js";
import { NotificationHook } from "../hooks/notification.hook.js";


export async function createMilestoneService({ project_id, name, description, start_date, due_date }) {
    if (!project_id || !name) {
        throw { status: 400, message: "Thiếu project_id hoặc name" };
    }

    const project = await Project.findByPk(project_id);
    if (!project) {
        throw { status: 404, message: "Project không tồn tại" };
    }

    const milestone = await Milestone.create({
        project_id,
        name,
        description,
        start_date,
        due_date
    });
    const admins = await User.findAll({ where: { role: "Admin" } });
    for (const admin of admins) {
        await NotificationHook.projectUpdated(project, [admin]); 
    }

    return milestone;
}

export async function getMilestonesByProjectService(project_id) {
    const milestones = await Milestone.findAll({
        where: { project_id },
        order: [["due_date", "ASC"]]
    });

    return milestones;
}

export async function getMilestoneDetailService(milestone_id) {
    const milestone = await Milestone.findByPk(milestone_id);

    if (!milestone) {
        throw { status: 404, message: "Không tìm thấy milestone" };
    }

    return milestone;
}

export async function updateMilestoneService(milestone_id, updates) {
    const milestone = await Milestone.findByPk(milestone_id);

    if (!milestone) {
        throw { status: 404, message: "Milestone không tồn tại" };
    }

    if (milestone.is_completed) {
        if (updates.name || updates.project_id) {
            throw { status: 400, message: "Không thể sửa milestone đã hoàn thành (chỉ cho phép cập nhật mô tả hoặc due_date)" };
        }
    }

    await milestone.update(updates);
    const admins = await User.findAll({ where: { role: "Admin" } });
    for (const admin of admins) {
        await NotificationHook.projectUpdated(
            { project_id: milestone.project_id, name: milestone.name },
            [admin]
        );
    }

    return milestone;
}

export async function completeMilestoneService(milestone_id) {
    const milestone = await Milestone.findByPk(milestone_id);

    if (!milestone) {
        throw { status: 404, message: "Không tìm thấy milestone" };
    }

    if (milestone.is_completed) {
        throw { status: 400, message: "Milestone đã hoàn thành trước đó" };
    }
    milestone.is_completed = true;
    milestone.completed_at = new Date();
    await milestone.save();
    const admins = await User.findAll({ where: { role: "Admin" } });

    for (const admin of admins) {
        await NotificationHook.milestoneCompleted(milestone, { username: "User" }, [admin]);
    }

    return {
        message: "Đánh dấu milestone hoàn thành thành công",
        milestone
    };
}

export async function deleteMilestoneService(milestone_id) {
    const milestone = await Milestone.findByPk(milestone_id);

    if (!milestone) {
        throw { status: 404, message: "Milestone không tồn tại" };
    }

    await Milestone.destroy({ where: { milestone_id } });
    const admins = await User.findAll({ where: { role: "Admin" } });

    for (const admin of admins) {
        await NotificationHook.projectUpdated(
            { project_id: milestone.project_id, name: milestone.name },
            [admin]
        );
    }

    return { message: "Xóa milestone thành công" };
}
