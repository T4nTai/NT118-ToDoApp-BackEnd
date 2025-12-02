import {
    createProjectService,
    getProjectsByOwnerService,
    assignProjectToGroupService,
    assignProjectToUserService,
    updateProjectService,
    deleteProjectService
} from "../services/projectservices.js";

export async function createProject(req, res, next) {
    try {
        const { name, description, status, priority, start_date, due_date } = req.body;
        const owner_id = req.user.id;
        const project = await createProjectService({
            name,
            description,
            status,
            priority,
            start_date,
            due_date,
            owner_id
        });
        res.status(201).json({
            message: "Tạo dự án thành công",
            project
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function getProjectsByOwner(req, res, next) {
    try {
        const owner_id = req.user.id;
        const projects = await getProjectsByOwnerService(owner_id);
        return res.status(200).json({ projects });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function updateProject(req, res, next) {
    try {
        const { project_id } = req.params;
        const owner_id = req.user.id;
        const updates = req.body;

        const project = await updateProjectService(project_id, owner_id, updates);

        res.json({
            message: "Cập nhật dự án thành công",
            project
        });
    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function assignProjectToGroup(req, res, next) {
    try {
        const { project_id, group_id } = req.body;
        const inviter_id = req.user.id;

        const project = await assignProjectToGroupService(project_id, group_id, inviter_id);

        return res.status(200).json({
            message: "Dự án đã được giao cho nhóm",
            project
        });

    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function assignProjectToUser(req, res, next) {
    try {
        const { project_id, user_id } = req.body;
        const inviter_id = req.user.id;

        const project = await assignProjectToUserService(project_id, user_id, inviter_id);

        return res.status(200).json({
            message: "Dự án đã được giao cho người dùng",
            project
        });

    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}


export async function deleteProject(req, res, next) {
    try {
        const { project_id } = req.params;
        const owner_id = req.user.id;

        const result = await deleteProjectService(project_id, owner_id);

        return res.status(200).json(result);

    } catch (err) {
        if (err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}
