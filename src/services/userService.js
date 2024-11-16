const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ApiError = require('../errors/apiError');

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
    updateUserName,
};
