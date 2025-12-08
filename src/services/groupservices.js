import { Group } from '../models/group.model.js';
import { User } from '../models/auth.model.js';
import { GroupMember } from '../models/group_member.model.js';
import { NotificationHook } from "../hooks/notification.hook.js";


export async function createGroupService({ group_name, description, owner_id, workspace_id }) {
  if (!group_name || !owner_id || !workspace_id) {
    throw { status: 400, message: "Thiếu group_name, owner_id hoặc workspace_id" };
  }

  const group = await Group.create({
    name: group_name,
    description,
    workspace_id
  });
  const owner = await User.findByPk(owner_id);
  await GroupMember.create({
    group_id: group.group_id,
    user_id: owner_id,
    role: "Owner"
  });
  //await NotificationHook.groupMemberAdded(owner, group);

  return group;
}



export async function getGroupByUserService(user_id) {
  const groups = await Group.findAll({
    include: [
      {
        model: GroupMember,
        as: 'groupMembers',
        where: { user_id },
        attributes: [],
        required: true
      },
      {
        model: GroupMember,
        as: 'members',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'username', 'email']
          }
        ],
        required: false
      }
    ]
  });

  return groups;
}

export async function addMemberToGroupService({ group_id, user_id, role }) {
  const group = await Group.findByPk(group_id);
  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  const user = await User.findByPk(user_id);
  if (!user) {
    throw { status: 404, message: "Người dùng không tồn tại" };
  }

  const existing = await GroupMember.findOne({
    where: { group_id, user_id }
  });

  if (existing) {
    throw { status: 400, message: "Người dùng đã trong nhóm" };
  }

  await GroupMember.create({
    group_id,
    user_id,
    role: role || "Member"
  });
  //await NotificationHook.groupMemberAdded(user, group);
  return { message: "Thêm thành viên vào nhóm thành công" };
}

export async function removeMemberFromGroupService(group_id, user_id) {
  const group = await Group.findByPk(group_id);
  if (!group) {
    throw { status: 404, message: "Group không tồn tại" };
  }

  const member = await GroupMember.findOne({ where: { group_id, user_id } });
  if (!member) {
    throw { status: 404, message: "User không thuộc group" };
  }

  const user = await User.findByPk(user_id);

  await GroupMember.destroy({
    where: { group_id, user_id }
  });
  //await NotificationHook.groupMemberRemoved(user, group);

  return { message: "Xóa thành viên khỏi group thành công" };
}

export async function removeGroupService(group_id) {
  const group = await Group.findByPk(group_id);
  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  const members = await GroupMember.findAll({ where: { group_id } });
  await GroupMember.destroy({ where: { group_id } });
  await group.destroy();
  /*for (const m of members) {
    const user = await User.findByPk(m.user_id);
    await NotificationHook.groupMemberRemoved(user, group);
  }*/

  return { message: "Xóa nhóm thành công" };
}
