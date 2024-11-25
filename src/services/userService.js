const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/apiError');

async function findOrCreateUser(uid, email, name, photo) {
    let user = await prisma.user.findUnique({ where: { uid } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                uid,
                email,
                name,
                photo_url: photo,
                provider_id: "google.com",
                created_at: new Date(),
                updated_at: new Date()
            },
        });
    }

    return user;
}

async function updateUserName(uid, newName) {
    const user = await prisma.user.findUnique({
        where: { uid },
    });

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const updatedUser = await prisma.user.update({
        where: { uid },
        data: { name: newName },
    });

    return updatedUser;
}

module.exports = {
    findOrCreateUser,
    updateUserName,
};
