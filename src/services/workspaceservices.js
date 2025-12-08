import { Workspace } from '../models/workspace.model.js';
import { User } from '../models/auth.model.js';
import crypto from 'crypto';
import { WorkspaceMember } from '../models/workspace_member.model.js';
import { getUserIdByEmail } from './authservices.js';
import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/group_member.model.js";
import { NotificationHook } from '../hooks/notification.hook.js';
import Sequelize  from 'sequelize';


export function generateWorkspaceToken() {
    return crypto.randomBytes(16).toString("hex"); 
}
export async function createWorkSpaceService({ name, description, owner_id }) {
    const workspace_token = generateWorkspaceToken();
    if (!name || !owner_id) {
        throw { status: 400, message: "Cần nhập đầy đủ Tên workspace và ID chủ sở hữu" };
    }

    const workspace = await Workspace.create({ name, workspace_token, description });
    await WorkspaceMember.create({
        workspace_id: workspace.workspace_id,
        user_id: owner_id,
        workspace_role: "Owner" 
    });

    await NotificationHook.workspaceCreated(workspace, owner_id);

    return workspace;
}

export async function joinWorkspaceByTokenService(user_id, token) {
    if (!token) {
        throw { status: 400, message: "Vui lòng nhập Workspace Token" };
    }
    const workspace = await Workspace.findOne({ where: { workspace_token: token } });
    if (!workspace) {
        throw { status: 404, message: "Token không hợp lệ hoặc workspace không tồn tại" };
    }
    const existed = await WorkspaceMember.findOne({
        where: { workspace_id: workspace.workspace_id, user_id }
    });
    if (existed) {
        throw { status: 400, message: "Bạn đã là thành viên của workspace này" };
    }
    const member = await WorkspaceMember.create({
        workspace_id: workspace.workspace_id,
        user_id,
        workspace_role: "Member"
    });
    await NotificationHook.workspaceJoined(user_id, workspace);
    return {
        message: "Tham gia workspace thành công",
        workspace,
        member
    };
}


export async function getGroupsByWorkspaceService(workspace_id) {
    const groups = await Group.findAll({
        where: { workspace_id },
        attributes: {
            include: [
                [Sequelize.fn("COUNT", Sequelize.col("groupMembers.user_id")), "member_count"]
            ]
        },
        include: [{
            model: GroupMember,
            as: "groupMembers",
            attributes: []
        }],
        group: ["Group.group_id"],
        order: [["group_id", "ASC"]]
    });

    return groups;
}

export async function getMyWorkspacesService(user_id) {
    return Workspace.findAll({
        include: [{
            model: WorkspaceMember,
            as: "members",
            where: { user_id },
            attributes: ["workspace_role", "joined_at"]
        }]
    });
}


export async function addWorkspaceMemberService(workspace_id, email, workspace_role = "Member", requesterRole) {
    const user_id = await getUserIdByEmail(email);
    const VALID_ROLES = ["Admin", "Member", "Viewer"];
    if (workspace_role === "Owner") {
        throw { status: 403, message: "Không thể gán vai trò Owner cho người khác" };
    }
    if (!VALID_ROLES.includes(workspace_role)) {
        throw { status: 400, message: "Vai trò không hợp lệ" };
    }
    if (workspace_role === "Admin" && requesterRole !== "Owner") {
        throw { status: 403, message: "Chỉ Owner mới được thêm Admin" };
    }
    const workspace = await Workspace.findByPk(workspace_id);
    if (!workspace) {
        throw { status: 404, message: "Workspace không tồn tại" };
    }
    const user = await User.findByPk(user_id);
    if (!user) {
        throw { status: 404, message: "Người dùng không tồn tại" };
    }
    const existed = await WorkspaceMember.findOne({ where: { workspace_id, user_id } });
    if (existed) {
        throw { status: 400, message: "Người dùng đã là thành viên của workspace này" };
    }
    const workspaceMember = await WorkspaceMember.create({
        workspace_id,
        user_id,
        workspace_role
    });
    await NotificationHook.workspaceJoined(user_id, workspace);
    return workspaceMember;
}

export async function getListMemberService(workspace_id) {
    return await WorkspaceMember.findAll({
        where: { workspace_id },
        include: [{
            model: User,
            as: "user",
            attributes: ["user_id", "email", "username"]
        }]
    });
}

export async function updateWorkspaceMemberRoleService(workspace_id, user_id, newRole, requesterRole) {
    const VALID_ROLES = ["Admin", "Member", "Viewer"];
    if (!VALID_ROLES.includes(newRole)) {
        throw { status: 400, message: "Role không hợp lệ" };
    }
    if (newRole === "Admin" && requesterRole !== "Owner") {
        throw { status: 403, message: "Chỉ Owner mới được gán Admin" };
    }
    const member = await WorkspaceMember.findOne({ where: { workspace_id, user_id } });
    if (!member) {
        throw { status: 404, message: "Thành viên không tồn tại trong workspace" };
    }
    if (member.workspace_role === "Owner") {
        throw { status: 403, message: "Không thể đổi role của Owner" };
    }
    member.workspace_role = newRole;
    await member.save();
    await NotificationHook.workspaceRoleUpdated({
        target_user_id: user_id,
        workspace_id,
        newRole
    });
    return { message: "Cập nhật role thành công", member };
}

export async function leaveWorkspaceService(workspace_id, user_id) {
    const member = await WorkspaceMember.findOne({ where: { workspace_id, user_id } });
    if (!member) throw { status: 404, message: "Bạn không thuộc workspace này" };
    if (member.workspace_role === "Owner") {
        throw { status: 403, message: "Owner không thể tự rời workspace" };
    }
    await WorkspaceMember.destroy({ where: { workspace_id, user_id } });
    await NotificationHook.workspaceMemberLeft({
        target_user_id: user_id,
        workspace_id
    });
    return { message: "Rời workspace thành công" };
}


export async function removeWorkspaceMemberService(workspace_id, user_id) {
    const member = await WorkspaceMember.findOne({ where: { workspace_id, user_id } });

    if (!member) throw { status: 404, message: "Thành viên không tồn tại trong workspace" };

    if (member.workspace_role === "Owner") {
        throw { status: 403, message: "Không được xóa Owner khỏi workspace" };
    }

    await WorkspaceMember.destroy({ where: { workspace_id, user_id } });
    await NotificationHook.workspaceMemberLeft({
        target_user_id: user_id,
        workspace_id
    });
    return { message: "Xóa thành viên thành công" };
}
export async function deleteWorkspaceService(workspace_id) {
    await Workspace.destroy({
        where: { workspace_id }
    });

    return { message: "Xóa workspace thành công" };
}



