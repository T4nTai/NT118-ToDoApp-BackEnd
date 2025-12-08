import { Router } from "express";
import { authenticateFromGateway } from "../middleware/auth.gateway.middleware.js";
import { ExternalAccountController } from "../controllers/external_account.controller.js";

const External_accountRouter = Router();

External_accountRouter.use(authenticateFromGateway);


External_accountRouter.post("/:provider", ExternalAccountController.linkOrUpdate);


External_accountRouter.get("/me/list", ExternalAccountController.myAccounts);


External_accountRouter.delete("/:provider", ExternalAccountController.deleteMyProvider);

export default External_accountRouter;
