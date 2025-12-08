import { Group } from "./group.model.js";
import { GroupMember } from "./group_member.model.js";

export default function initModels() {
  Group.hasMany(GroupMember, {
    foreignKey: "group_id",
    as: "members",
  });
  Group.hasMany(GroupMember, {
    foreignKey: "group_id",
    as: "membership",
  });
  GroupMember.belongsTo(Group, {
    foreignKey: "group_id",
    as: "group",
  });
  return {
    Group,
    GroupMember,
  };
}
export { Group, GroupMember };
