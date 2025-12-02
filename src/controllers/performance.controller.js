import { evaluateMemberInGroupService, evaluateMemberInProjectService, getGroupPerformanceService, getProjectPerformanceService } from "../services/performanceservices.js";

import { getUserIdByEmailService } from "../services/authservices.js";

export async function evaluateMemberInGroup(req, res, next) {
    try {
        const { group_id, email, score, comment } = req.body;

        const user_id = await getUserIdByEmailService(email);
        const created_by = req.user.id;

        const record = await evaluateMemberInGroupService({
            group_id,
            user_id,
            score,
            comment,
            created_by
        });

        return res.status(201).json({
            message: "Đánh giá thành viên trong nhóm thành công",
            performanceRecord: record
        });

    } catch (err) {
        if (err?.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function evaluateMemberInProject(req, res, next) {
    try {
        const { project_id, email, score, comment } = req.body;

        const user_id = await getUserIdByEmailService(email);
        const created_by = req.user.id;

        const record = await evaluateMemberInProjectService({
            project_id,
            user_id,
            score,
            comment,
            created_by
        });

        return res.status(201).json({
            message: "Đánh giá thành viên trong project thành công",
            performanceRecord: record
        });

    } catch (err) {
        if (err?.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function getGroupPerformance(req, res, next) {
    try {
        const { group_id, user_id } = req.query;

        const records = await getGroupPerformanceService(group_id, user_id);

        return res.status(200).json({ performances: records });

    } catch (err) {
        if (err?.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function getProjectPerformance(req, res, next) {
    try {
        const { project_id, user_id } = req.query;

        const records = await getProjectPerformanceService(project_id, user_id);

        return res.status(200).json({ performances: records });

    } catch (err) {
        if (err?.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}
