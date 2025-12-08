import {
  checkGroupExistsService,
  getGroupMembersService,
  checkGroupMemberService,
  getUserGroupsInternalService,
} from "../services/group.service.js";

export async function internalCheckGroupExists(req, res, next) {
  try {
    const group_id = parseInt(req.params.group_id, 10);
    const group = await checkGroupExistsService(group_id);

    return res.status(200).json({
      exists: true,
      group_id: group.group_id,
      name: group.name,
      workspace_id: group.workspace_id,
    });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalGetGroupMembers(req, res, next) {
  try {
    const group_id = parseInt(req.params.group_id, 10);
    const members = await getGroupMembersService(group_id);

    return res.status(200).json({ members });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalCheckGroupMember(req, res, next) {
  try {
    const group_id = parseInt(req.params.group_id, 10);
    const user_id = parseInt(req.params.user_id, 10);

    const member = await checkGroupMemberService(group_id, user_id);

    return res.status(200).json({
      exists: true,
      group_id: member.group_id,
      user_id: member.user_id,
      role: member.role,
    });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function internalGetUserGroups(req, res, next) {
  try {
    const user_id = parseInt(req.params.user_id, 10);
    const groups = await getUserGroupsInternalService(user_id);

    return res.status(200).json({ groups });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
