import {
    createMilestoneService,
    getMilestonesByProjectService,
    getMilestoneDetailService,
    updateMilestoneService,
    completeMilestoneService,
    deleteMilestoneService
} from "../services/milestone.service.js";


export class MilestoneController {
    static async create(req, res, next) {
        try {
            const milestone = await createMilestoneService(req.body);
            res.json({ message: "Tạo milestone thành công", milestone });
        } catch (err) {
            next(err);
        }
    }
    static async getByProject(req, res, next) {
        try {
            const { project_id } = req.params;
            const milestones = await getMilestonesByProjectService(project_id);
            res.json(milestones);
        } catch (err) {
            next(err);
        }
    }

    static async detail(req, res, next) {
        try {
            const { milestone_id } = req.params;
            const milestone = await getMilestoneDetailService(milestone_id);
            res.json(milestone);
        } catch (err) {
            next(err);
        }
    }

    static async update(req, res, next) {
        try {
            const { milestone_id } = req.params;
            const milestone = await updateMilestoneService(milestone_id, req.body);
            res.json({ message: "Cập nhật milestone thành công", milestone });
        } catch (err) {
            next(err);
        }
    }
    static async complete(req, res, next) {
        try {
            const { milestone_id } = req.params;
            const result = await completeMilestoneService(milestone_id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }

    static async delete(req, res, next) {
        try {
            const { milestone_id } = req.params;
            const result = await deleteMilestoneService(milestone_id);
            res.json(result);
        } catch (err) {
            next(err);
        }
    }
}
