import {
  createGroupService,
  getGroupByUserService,
  removeGroupService,
  addMemberToGroupByEmailService,
} from "../services/group.service.js";

export async function createGroup(req, res, next) {
  try {
    const owner_id = req.user.id;
    const { group_name, description, workspace_id } = req.body;
    console.log ("print:" + { owner_id,group_name,workspace_id });
    const group = await createGroupService({
      group_name,
      description,
      owner_id,
      workspace_id,
    });

    return res.status(201).json({ group });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function addMemberToGroup(req, res, next) {
  try {
    const { group_id, member_email, role } = req.body;

    const result = await addMemberToGroupByEmailService({
      group_id,
      email: member_email,
      role,
    });

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function getGroupsByUser(req, res, next) {
  try {
    const user_id = req.user.id;
    const groups = await getGroupByUserService(user_id);

    return res.status(200).json({ groups });
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}

export async function removeGroup(req, res, next) {
  try {
    const { group_id } = req.params;
    const result = await removeGroupService(group_id);

    return res.status(200).json(result);
  } catch (err) {
    if (err && err.status)
      return res.status(err.status).json({ message: err.message });
    next(err);
  }
}
