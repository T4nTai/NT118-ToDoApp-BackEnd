import { createWorkSpaceService, addWorkspaceMemberService, getMyWorkspacesService, deleteWorkspaceService, getListMemberService, removeWorkspaceMemberService, updateWorkspaceMemberRoleService, leaveWorkspaceService, joinWorkspaceByTokenService, getGroupsByWorkspaceService } from "../services/workspaceservices.js";

export async function createWorkspace(req, res, next) {
    try {
        const owner_id = req.user.id;
        const { name, description } = req.body;
        const workspace = await createWorkSpaceService({ name, description, owner_id });
         return res.status(201).json({
            message: "Tạo workspace thành công",
            workspace
        });

    } catch(err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}
export async function joinWorkspace(req, res, next) {
    try {
        const user_id = req.user.id;
        const { token } = req.body;
        const data = await joinWorkspaceByTokenService(user_id, token);
        res.json(data);
    } catch (err) {
        next(err);
    }
}

export async function getGroupsByWorkspace(req, res, next) {
    try {
        const workspace_id = req.params;
        const groups = await getGroupsByWorkspaceService(workspace_id);
        return res.json({ groups });
    } catch (err) {
        next(err);
    }
}

export async function getMyWorkspace(req, res, next) {
    try {
        const user_id = req.user.id;
        const workspace = await getMyWorkspacesService(user_id);
        if (!workspace) {
            return res.status(404).json({ message: "Bạn chưa tạo workspace nào" });
        }
        return res.status(200).json(workspace);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function addWorkspaceMember(req, res, next) {
    try {
        const { workspace_id } = req.params;
        const { email, role } = req.body;
        const requesterRole = req.workspaceRole;
        const member = await addWorkspaceMemberService(
            workspace_id,
            email,
            role,
            requesterRole
        );
        return res.status(201).json({
            message: "Thêm thành viên vào workspace thành công",
            member
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function getListMember(req, res, next) {
    try {
        const { workspace_id } = req.params;
        const list = await getListMemberService( workspace_id );
        return res.status(201).json(list);
    }
    catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function removeWorkspaceMember(req, res, next) {
    try {
        const { workspace_id, user_id } = req.params;

        const result = await removeWorkspaceMemberService(workspace_id, user_id);
        return res.status(200).json(result);
    }
    catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function updateWorkspaceMemberRole(req, res, next) {
    try {
        const requesterRole = req.workspaceRole;
        const { workspace_id, user_id } = req.params;
        const { role } = req.body;

        const result = await updateWorkspaceMemberRoleService(workspace_id, user_id, role, requesterRole);
        return res.status(200).json(result);
    }
     catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function leaveWorkspace(req, res, next) {
    try {
        const { workspace_id } = req.params;
        const user_id = req.user.id;

        const result = await leaveWorkspaceService(workspace_id, user_id);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}


export async function deleteWorkspace(req, res, next) {
    try {
        const { workspace_id } = req.params;
        const result = await deleteWorkspaceService(workspace_id);
        return res.status(200).json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}