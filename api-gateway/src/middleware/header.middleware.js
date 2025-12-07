export const injectUserHeaders = (req, res, next) => {
    if (req.user) {
        const userId = req.user.id || req.user.user_id;
        req.headers['x-user-id'] = String(userId);
    }
    next();
};