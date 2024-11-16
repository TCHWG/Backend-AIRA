const userService = require('../services/userService');
const ApiError = require('../errors/apiError');

async function updateUserName(req, res) {
    const { uid } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
        const error = ApiError.badRequest('Name is required');
        return res.status(error.code).json({
            success: error.success,
            code: error.code,
            status: error.status,
            message: error.message,
        });
    }

    try {
        const updatedUser = await userService.updateUserName(uid, name);
        res.status(200).json({
            success: true,
            code: 200,
            status: "OK",
            message: "Name updated successfully",
            data: {
                uid: updatedUser.uid,
                email: updatedUser.email,
                name: updatedUser.name,
                photo_url: updatedUser.photo_url,
                provider_id: updatedUser.provider_id,
                created_at: updatedUser.created_at,
                updated_at: updatedUser.updated_at,
                last_login_at: updatedUser.last_login_at,
            },
        });
    } catch (error) {
        if (error instanceof ApiError) {
            res.status(error.code).json({
                success: error.success,
                code: error.code,
                status: error.status,
                message: error.message,
            });
        } else {
            const internalError = ApiError.internalServerError('An unexpected error occurred');
            res.status(internalError.code).json({
                success: internalError.success,
                code: internalError.code,
                status: internalError.status,
                message: internalError.message,
            });
        }
    }
}

module.exports = {
    updateUserName,
};
