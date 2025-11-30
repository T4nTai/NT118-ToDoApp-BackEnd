import { updateAvatarService, deleteAvatarService, getAvatarService } from "../services/avatarservices.js";


export async function updateAvatar(req, res, next) {
  try {
    const userId = req.user.id;
    const { imageBase64 } = req.body;

    const result = await updateAvatarService(userId, imageBase64);
    res.json(result);

  } catch (err) {
    next(err);
  }
}

export async function deleteAvatar(req, res, next) {
  try {
    const userId = req.user.id;

    const result = await deleteAvatarService(userId);
    res.json(result);

  } catch (err) {
    next(err);
  }
}

export async function getAvatar(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await getAvatarService(userId);
    res.json(result);

  } catch (err) {
    next(err);
  }
}