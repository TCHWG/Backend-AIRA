const userService = require('../services/userService');
const photoService = require('../services/photoService');
const ApiError = require('../errors/apiError');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // Allowed file extensions
    const allowedExtensions = /jpeg|jpg|png|gif/;
    // Check the file extension
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    // Check the file MIME type
    const mimetype = allowedExtensions.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
    fileFilter: fileFilter,
}).single('photo');

async function updateUserName(req, res) {
    const { name } = req.body;
    const { uid } = req.user;

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

async function uploadProfilePhoto(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            // Handle Multer errors
            if (err instanceof multer.MulterError || err.message.includes('Only image files are allowed')) {
                return res.status(400).json({
                    success: false,
                    code: 400,
                    status: "Bad Request",
                    message: err.message,
                });
            }
            return res.status(500).json({
                success: false,
                code: 500,
                status: "Internal Server Error",
                message: 'An error occurred during the file upload.',
            });
        }

        const { uid } = req.user; // Get uid from the authenticated user
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                code: 400,
                status: "Bad Request",
                message: 'No file uploaded or invalid file type.',
            });
        }

        try {
            const updatedUser = await photoService.uploadPhoto(uid, file);
            res.status(200).json({
                success: true,
                code: 200,
                status: "OK",
                message: 'Photo uploaded successfully.',
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
            console.error('Error uploading photo:', error);
            res.status(500).json({
                success: false,
                code: 500,
                status: "Internal Server Error",
                message: 'Failed to upload photo.',
            });
        }
    });
}

module.exports = {
    updateUserName,
    uploadProfilePhoto,
};
