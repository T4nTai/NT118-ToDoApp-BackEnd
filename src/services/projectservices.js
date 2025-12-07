import { User } from '../models/auth.model.js';
import { Project } from '../models/project.model.js';
import { ProjectMember } from '../models/project_member.model.js';
import { Group } from '../models/group.model.js';
import { GroupMember } from '../models/group_member.model.js';
import { WorkflowStep } from '../models/workflow_step.model.js';
import { Workflow } from '../models/workflow.model.js';
import { Workspace } from '../models/workspace.model.js'; // thêm để check workspace tồn tại
import cloudinary from "../config/cloudinary.js";
import { getUserIdByEmail } from './authservices.js';
import { NotificationHook } from "../hooks/notification.hook.js";


// ============================================================
// TẠO PROJECT
// ============================================================
export async function createProjectService(data, file ) {
    const { 
        workspace_id,
        name,
        description,
        status,
        priority,
        start_date,
        due_date,
        owner_id
    } = data;

    if (!workspace_id || !name || !owner_id) {
        throw { status: 400, message: "Thiếu workspace_id, name hoặc owner_id" };
    }
    const workspace = await Workspace.findByPk(workspace_id);
    if (!workspace) {
        throw { status: 404, message: "Workspace không tồn tại" };
    }
    if (start_date && due_date && new Date(start_date) > new Date(due_date)) {
        throw { status: 400, message: "Ngày bắt đầu không thể sau ngày kết thúc" };
    }
    const project = await Project.create({
        workspace_id,
        name,
        description,
        status,     
        priority,   
        start_date,
        due_date,
        owner_id
    });
    if (file) {
        try {
            const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: "todo/projects",
            resource_type: "raw"
            });

            await project.update({
                attachment_url: uploaded.secure_url,
                attachment_public_id: uploaded.public_id
            });
        } catch (err) {
            console.error("Upload file thất bại:", err);
            throw { status: 500, message: "Không thể upload file" };
        }
    }
    const workflow = await Workflow.create({
        project_id: project.project_id,
        name: `${name} Workflow`
    });
    const defaultSteps = [
        { name: "To Do",       step_order: 1 },
        { name: "In Progress", step_order: 2 },
        { name: "Review",      step_order: 3 },
        { name: "Done",        step_order: 4 }
    ];
    for (const step of defaultSteps) {
        await WorkflowStep.create({
            workflow_id: workflow.workflow_id,
            name: step.name,
            step_order: step.step_order
        });
    }
    await ProjectMember.create({
        project_id: project.project_id,
        user_id: owner_id,
        role: "Owner"
    });

    return project;
}

export async function getProjectMembersService(project_id) {
    const project = await Project.findByPk(project_id);
    if (!project) {
        throw { status: 404, message: "Dự án không tồn tại" };
    }

    const members = await ProjectMember.findAll({
        where: { project_id },
        include: [
            {
                model: User,
                as: "user",
                attributes: ["user_id", "username", "email"]
            }
        ],
        order: [["joined_at", "ASC"]]  // ✔ ổn định, không lỗi
    });

    return members.map(m => ({
        user_id: m.user.user_id,
        username: m.user.username,
        email: m.user.email,
        role: m.role,
        joined_at: m.joined_at
    }));
}


export async function getProjectsByOwnerService(owner_id) {
    const user = await User.findByPk(owner_id, {
        include: [{
            model: Project,
            as: 'ownedProjects',
            include: [{
                model: User,
                as: 'members',
                attributes: ['user_id', 'username', 'email'],
                through: { attributes: ['role'] }
            }]
        }]
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
        "name",
        "description",
        "status",
        "priority",
        "start_date",
        "due_date",
        "assigned_user_id",
        "assigned_group_id"
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

export async function assignProjectToGroupService(
    project_id,
    group_id,
    inviter_id,
    role = "Member" 
) {
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
                project_role: role
            });
        } else {
            if (exists.project_role !== role) {
                exists.project_role = role;
                await exists.save();
            }
        }
    }
    return project;
}


export async function assignProjectToUserService(project_id, user_id, inviter_id, role = "Member") {
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
            role
        });
    }
    return project;
}

export async function addMemberToProjectService({ project_id, email, role = "Member", inviter_id }) {

    if (!project_id || !email) {
        throw { status: 400, message: "Cần project_id và email" };
    }

    // Lấy user_id từ email
    const user_id = await getUserIdByEmail(email);

    // Check project tồn tại
    const project = await Project.findByPk(project_id);
    if (!project) {
        throw { status: 404, message: "Dự án không tồn tại" };
    }
    if (role === "Admin" && project.owner_id !== inviter_id) {
        throw { status: 403, message: "Chỉ Owner mới có thể thêm Admin vào dự án" };
    }

    if (role === "Owner") {
        throw { status: 403, message: "Không thể thêm Owner mới" };
    }

    const user = await User.findByPk(user_id);
    if (!user) {
        throw { status: 404, message: "Người dùng không tồn tại" };
    }

    const existed = await ProjectMember.findOne({
        where: { project_id, user_id }
    });

    if (existed) {
        throw { status: 400, message: "Người dùng đã là thành viên của dự án" };
    }

    const newMember = await ProjectMember.create({
        project_id,
        user_id,
        role
    });
    return {
        message: "Thêm thành viên vào dự án thành công",
        member: {
            user_id: user.user_id,
            email: user.email,
            username: user.username,
            role
        }
    };
}

export async function getProjectsOfMemberService(user_id) {
    const user = await User.findByPk(user_id);
    if (!user) throw { status: 404, message: "Người dùng không tồn tại" };
    const memberships = await ProjectMember.findAll({
        where: { user_id },
        include: [
            {
                model: Project,
                as: "project",
                include: [
                    {
                        model: User,
                        as: "members",
                        attributes: ["user_id", "username", "email"],
                        through: { attributes: ["role"] }
                    },
                    {
                        model: User,
                        as: "owner",
                        attributes: ["user_id", "username", "email"]
                    }
                ]
            }
        ]
    });
    return memberships.map(m => m.project);
}
export async function deleteProjectService(project_id, owner_id) {
    const project = await Project.findByPk(project_id);

    if (!project) {
        throw { status: 404, message: "Dự án không tồn tại" };
    }
    if (project.owner_id !== owner_id) {
        throw { status: 403, message: "Bạn không có quyền xoá dự án này" };
    }
    await project.destroy();
    return { message: "Xoá dự án thành công" };
}
