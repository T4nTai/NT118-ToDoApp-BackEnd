import {
    createProjectService,
    getProjectsByOwnerService,
    assignProjectToGroupService,
    assignProjectToUserService,
    updateProjectService,
    deleteProjectService,
    getProjectsOfMemberService
} from "../services/projectservices.js";

export async function createProject(req, res, next) {
    try {
        const { workspace_id, name, description, status, priority, start_date, due_date } = req.body;
        const owner_id = req.user.id;
        if (!workspace_id) {
            return res.status(400).json({ message: "Thiếu workspace_id" });
        }
        const project = await createProjectService({
            workspace_id,
            name,
            description,
            status,
            priority,
            start_date,
            due_date,
            owner_id
        }, req.file );

        return res.status(201).json({
            message: "Tạo dự án thành công",
            project
        });

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message || "Lỗi server" });
    }
}
export async function getMyProjects(req, res) {
    try {
        const user_id = req.user.id;
        const projects = await getProjectsOfMemberService(user_id);
        res.json(projects);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export async function getProjectsByOwner(req, res, next) {
    try {
        const owner_id = req.user.id;

        const projects = await getProjectsByOwnerService(owner_id);

        return res.status(200).json({
            message: "Lấy danh sách dự án thành công",
            projects
        });

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function updateProject(req, res, next) {
    try {
        const { project_id } = req.params;
        const owner_id = req.user.id;
        const updates = req.body;

        const project = await updateProjectService(project_id, owner_id, updates);

        return res.status(200).json({
            message: "Cập nhật dự án thành công",
            project
        });

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function assignProjectToGroup(req, res, next) {
    try {
        const { project_id, group_id } = req.body;
        const inviter_id = req.user.id;

        if (!project_id || !group_id) {
            return res.status(400).json({ message: "Thiếu project_id hoặc group_id" });
        }

        const project = await assignProjectToGroupService(project_id, group_id, inviter_id);

        return res.status(200).json({
            message: "Giao dự án cho nhóm thành công",
            project
        });

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function assignProjectToUser(req, res, next) {
    try {
        const { project_id, user_id } = req.body;
        const inviter_id = req.user.id;

        if (!project_id || !user_id) {
            return res.status(400).json({ message: "Thiếu project_id hoặc user_id" });
        }

        const project = await assignProjectToUserService(project_id, user_id, inviter_id);

        return res.status(200).json({
            message: "Giao dự án cho người dùng thành công",
            project
        });

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}

export async function deleteProject(req, res, next) {
    try {
        const { project_id } = req.params;
        const owner_id = req.user.id;

        const result = await deleteProjectService(project_id, owner_id);

        return res.status(200).json(result);

    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
}
