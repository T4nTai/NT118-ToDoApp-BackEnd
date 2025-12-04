import { User } from '../models/auth.model.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project_member.model.js';
import { Group } from '../models/group.model.js';
import { GroupMember } from '../models/group_member.model.js';
import { sendNotificationEmail } from '../ultis/sendmail.js';
import { WorkflowStep } from '../models/workflow_step.model.js';
import { Workflow } from '../models/workflow.model.js';


export async function createProjectService({ name, description, status, priority, start_date, due_date, owner_id }) {

    if (!name || !owner_id) {
        throw { status: 400, message: "Thiếu name hoặc owner_id" };
    }

    if (start_date && due_date && new Date(start_date) > new Date(due_date)) {
        throw { status: 400, message: "Ngày bắt đầu không thể sau ngày kết thúc" };
    }
    const project = await Project.create({ name, description, status, priority, start_date, due_date, owner_id });
    const workflow = await Workflow.create({ project_id: project.project_id, name: "${name} Workflow" });
    const defaultSteps = [
        { name: "To Do", step_order: 1 },
        { name: "In Progress", step_order: 2 },
        { name: "Review", step_order: 3 },
        { name: "Done", step_order: 4 }
    ];
    for (const step of defaultSteps) {
        await WorkflowStep.create({
            workflow_id: workflow.workflow_id,
            name: step.name,
            step_order: step.step_order
        });
    }
    project.workflow_id = workflow.workflow_id;
    await project.save();

    await ProjectMember.create({
        project_id: project.project_id,
        user_id: owner_id,
        role: "Owner"
    });
    return project;
}



export async function getProjectsByOwnerService(owner_id) {
    const user = await User.findByPk(owner_id, {
        include: [{ model: Project, as: 'ownedProjects',
            include: [{ model: User, as: 'members', attributes: ['user_id', 'username', 'email'],
                through: { attributes: ['role'] }
             }] }]
    });
    return user ? user.ownedProjects : [];
}


export async function updateProjectService(project_id, owner_id, updates) {
    const project = await Project.findByPk(project_id);

    if (!project) {
        throw { status: 404, message: "Dự án không tồn tại" };
    }

    if (project.owner_id !== owner_id) {
        throw { status: 403, message: "Bạn không có quyền sửa dự án này" };
    }
    const allowedFields = [
        "name", "description", "status", "priority",
        "start_date", "due_date", "workflow_id",
        "assigned_user_id", "assigned_group_id"
    ];
    const dataToUpdate = {};
    for (const key of allowedFields) {
        if (updates[key] !== undefined) {
            dataToUpdate[key] = updates[key];
        }
    }
    if (dataToUpdate.start_date && dataToUpdate.due_date) {
        if (new Date(dataToUpdate.start_date) > new Date(dataToUpdate.due_date)) {
            throw { status: 400, message: "start_date không thể sau due_date" };
        }
    }
    await project.update(dataToUpdate);
    return project;
}

export async function assignProjectToGroupService(project_id, group_id, inviter_id) {
    const project = await Project.findByPk(project_id);
    if (!project) throw { status: 404, message: "Dự án không tồn tại" };

    const group = await Group.findByPk(group_id);
    if (!group) throw { status: 404, message: "Nhóm không tồn tại" };

    const inviter = await User.findByPk(inviter_id);
    project.assigned_group_id = group_id;
    project.assigned_user_id = null;
    await project.save();
    const groupMembers = await GroupMember.findAll({
        where: { group_id },
        include: [{ model: User, as: "member" }]
    });

    for (const gm of groupMembers) {
        const user = gm.member;
        const exists = await ProjectMember.findOne({
            where: { project_id, user_id: user.user_id }
        });
        if (!exists) {
            await ProjectMember.create({
                project_id,
                user_id: user.user_id,
                role: "Member"
            });
        }
        await sendNotificationEmail({
            to: user.email,
            inviterName: inviter.username,
            targetType: "Dự án",
            targetName: project.project_name,
            role: "Member"
        });
    }

    return project;
}


export async function assignProjectToUserService(project_id, user_id, inviter_id) {
    const project = await Project.findByPk(project_id);
    if (!project) throw { status: 404, message: "Dự án không tồn tại" };

    const user = await User.findByPk(user_id);
    if (!user) throw { status: 404, message: "Người dùng không tồn tại" };

    const inviter = await User.findByPk(inviter_id);

    project.assigned_user_id = user_id;
    project.assigned_group_id = null; 
    await project.save();
    const exists = await ProjectMember.findOne({
        where: { project_id, user_id }
    });
    if (!exists) {
        await ProjectMember.create({
            project_id,
            user_id,
            role: "Member"
        });
    }
    await sendNotificationEmail({
        to: user.email,
        inviterName: inviter.username,
        targetType: "Dự án",
        targetName: project.project_name,
        role: "Manager"
    });

    return project;
}

export async function deleteProjectService(project_id, owner_id) {
    const project = await Project.findByPk(project_id);

    if (!project) {
        throw { status: 404, message: "Dự án không tồn tại" };
    }
    await project.destroy();
    return { message: "Xoá dự án thành công" };
}



