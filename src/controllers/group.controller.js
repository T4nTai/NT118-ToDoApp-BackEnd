import { createGroupService, getGroupByUserService, removeGroupService, addMemberToGroupService, getMembersInGroupService } from "../services/groupservices.js";
import { getUserIdByEmailService } from "../services/authservices.js";

export async function createGroup(req, res) {
  try {
    const owner_id = req.user.id;
    const { group_name, description, workspace_id } = req.body;
    const group = await createGroupService({
      group_name,
      description,
      owner_id,
      workspace_id
    });

    return res.status(201).json({ group });
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message });
  }
}


export async function getMembersInGroup(req, res) {
  try {
    const { group_id } = req.params;
    const data = await getMembersInGroupService(group_id);

    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}


export async function addMemberToGroup(req, res, next) {
    try {
        const { group_id, member_email } = req.body;
        const member_id = await getUserIdByEmailService(member_email);
        const result = await addMemberToGroupService({ group_id, user_id: member_id });
        return res.status(200).json(result);
    } catch (err) {
        if (err && err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }
}

export async function getGroupsByUser(req, res, next) {
    try {
        const user_id = req.user.id;
        const groups = await getGroupByUserService(user_id);
        return res.status(200).json({ groups });
    } catch (err) {
        if (err && err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }  
}

export async function removeGroup(req, res, next) {
    try {
        const { group_id } = req.params;    
        const result = await removeGroupService(group_id);
        return res.status(200).json(result);
    } catch (err) {
        if (err && err.status) return res.status(err.status).json({ message: err.message });
        next(err);
    }   
}