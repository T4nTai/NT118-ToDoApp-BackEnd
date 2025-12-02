import { evaluateMemberInGroup, evaluateMemberInProject, getGroupPerformance, getProjectPerformance } from '../controllers/performance.controller.js';

import { authenticateJWT } from '../middleware/auth.middleware.js';
import { Router } from 'express';

const PerformanceRouter = Router();

PerformanceRouter.post("/group/evaluate", authenticateJWT, evaluateMemberInGroup );

PerformanceRouter.post("/project/evaluate", authenticateJWT, evaluateMemberInProject );

PerformanceRouter.get("/group/performance", authenticateJWT, getGroupPerformance );

PerformanceRouter.get("/project/performance", authenticateJWT, getProjectPerformance );


export default PerformanceRouter;
