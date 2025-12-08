import { Group, GroupMember } from "../models/index.js";
import { getUserIdByEmail, checkUserExists } from "../helper/auth.helper.js";

export async function createGroupService({
  group_name,
  description,
  owner_id,
  workspace_id,
}) {
  if (!group_name || !owner_id || !workspace_id) {
    throw {
      status: 400,
      message: "Thiếu group_name, owner_id hoặc workspace_id",
    };
  }

  await checkUserExists(owner_id);

  const group = await Group.create({
    name: group_name,
    description: description || null,
    workspace_id,
  });

  await GroupMember.create({
    group_id: group.group_id,
    user_id: owner_id,
    role: "Owner",
  });

  return group;
}

export async function getGroupByUserService(user_id) {
  const groups = await Group.findAll({
    include: [
      {
        model: GroupMember,
        as: "membership",
        where: { user_id },
        attributes: [],
        required: true,
      },
      {
        model: GroupMember,
        as: "members",
        required: false,
      },
    ],
  });

  return groups;
}

export async function addMemberToGroupByUserIdService({
  group_id,
  user_id,
  role,
}) {
  const group = await Group.findByPk(group_id);
  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }

  await checkUserExists(user_id);

  const existing = await GroupMember.findOne({
    where: { group_id, user_id },
  });

  if (existing) {
    throw { status: 400, message: "Người dùng đã trong nhóm" };
  }

  await GroupMember.create({
    group_id,
    user_id,
    role: role || "Member",
  });

  

  return { message: "Thêm thành viên vào nhóm thành công" };
}

export async function addMemberToGroupByEmailService({ group_id, email, role }) {
  const user_id = await getUserIdByEmail(email);
  return addMemberToGroupByUserIdService({ group_id, user_id, role });
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

  await GroupMember.destroy({
    where: { group_id, user_id },
  });


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

  return { message: "Xóa nhóm thành công" };
}


export async function checkGroupExistsService(group_id) {
  const group = await Group.findByPk(group_id);
  if (!group) {
    throw { status: 404, message: "Nhóm không tồn tại" };
  }
  return group;
}

export async function getGroupMembersService(group_id) {
  await checkGroupExistsService(group_id);
  const members = await GroupMember.findAll({ where: { group_id } });
  return members;
}

export async function checkGroupMemberService(group_id, user_id) {
  const member = await GroupMember.findOne({
    where: { group_id, user_id },
  });

  if (!member) {
    throw { status: 404, message: "User không thuộc group" };
  }

  return member;
}

export async function getUserGroupsInternalService(user_id) {
  const memberships = await GroupMember.findAll({
    where: { user_id },
  });

  return memberships.map((m) => ({
    group_id: m.group_id,
    role: m.role,
  }));
}
