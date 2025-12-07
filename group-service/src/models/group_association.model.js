import { Group } from "./group.model.js";
import { GroupMember } from "./group_member.model.js";

export function initGroupAssociations() {
  Group.hasMany(GroupMember, {
    foreignKey: "group_id",
    as: "members"
  });

  GroupMember.belongsTo(Group, {
    foreignKey: "group_id",
    as: "group"
  });
}
export { Group, GroupMember };
