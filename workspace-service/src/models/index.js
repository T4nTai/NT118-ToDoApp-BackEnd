import { Workspace } from "./workspace.model.js";
import { WorkspaceMember } from "./workspace_member.model.js";

export default function initModels() {

    Workspace.hasMany(WorkspaceMember, {
        foreignKey: "workspace_id",
        as: "members"
    });

    WorkspaceMember.belongsTo(Workspace, {
        foreignKey: "workspace_id",
        as: "workspace"
    });
}

export { Workspace, WorkspaceMember };

