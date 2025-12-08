import { ProjectMember } from "../models/project_member.model.js";
import { GroupMember } from "../models/group_member.model.js";
import { Project } from "../models/project.model.js";
import { PerformanceRecord } from "../models/performance_record.model.js";
import { NotificationHook } from "../hooks/notification.hook.js";


export async function evaluateMemberInGroupService({ group_id, user_id, score, comment, created_by }) {
    if (!group_id || !user_id || score === undefined || !created_by) {
        throw { status: 400, message: "Thiếu dữ liệu: group_id, user_id, score, created_by" };
    }

    const evaluator = await GroupMember.findOne({
        where: { group_id, user_id: created_by }
    });

    if (!evaluator) {
        throw { status: 403, message: "Người đánh giá không thuộc nhóm" };
    }

    if (evaluator.role !== "Owner" && evaluator.role !== "Manager") {
        throw { status: 403, message: "Chỉ Owner hoặc Manager mới có quyền đánh giá trong nhóm" };
    }

    const target = await GroupMember.findOne({
        where: { group_id, user_id }
    });

    if (!target) {
        throw { status: 404, message: "Thành viên không tồn tại trong nhóm" };
    }

    const record = await PerformanceRecord.create({
        project_id: null,
        group_id,
        user_id,
        score,
        comment,
        created_by
    });

    return record;
}

export async function evaluateMemberInProjectService({ project_id, user_id, score, comment, created_by }) {
    if (!project_id || !user_id || score === undefined || !created_by) {
        throw { status: 400, message: "Thiếu dữ liệu: project_id, user_id, score, created_by" };
    }

    const project = await Project.findByPk(project_id);
    if (!project) {
        throw { status: 404, message: "Project không tồn tại" };
    }

    const evaluator = await ProjectMember.findOne({
        where: { project_id, user_id: created_by }
    });

    if (!evaluator || evaluator.role !== "Owner") {
        throw { status: 403, message: "Chỉ Owner của project mới có quyền đánh giá" };
    }

    let target = await ProjectMember.findOne({ where: { project_id, user_id } });

    if (!target && project.assigned_group_id) {
        target = await GroupMember.findOne({
            where: { group_id: project.assigned_group_id, user_id }
        });
    }
    if (!target) {
        throw { status: 404, message: "User này không thuộc project hoặc group được assign" };
    }
    const record = await PerformanceRecord.create({
        project_id,
        group_id: null,
        user_id,
        score,
        comment,
        created_by
    });

    return record;
}


export async function getGroupPerformanceService(group_id, user_id) {
    if (!group_id || !user_id) {
        throw { status: 400, message: "Thiếu group_id hoặc user_id" };
    }
    return PerformanceRecord.findAll({
        where: { group_id, user_id }
    });
}

export async function getProjectPerformanceService(project_id, user_id) {
    if (!project_id || !user_id) {
        throw { status: 400, message: "Thiếu project_id hoặc user_id" };
    }

    return PerformanceRecord.findAll({
        where: { project_id, user_id }
    });
}