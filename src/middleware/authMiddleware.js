const { PrismaClient } = require("@prisma/client");
const { auth } = require("../config/firebaseConfig");
const ApiError = require("../errors/apiError");

const prisma = new PrismaClient();

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return next(ApiError.unauthorized("Unauthorized: Token missing"));
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);

    const { uid, email, name = null, picture: photo_url = null } = decodedToken;

    if (!uid) {
      throw new Error("UID missing in token");
    }

    let user = await prisma.user.findUnique({
      where: { uid },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          uid,
          email,
          name,
          photo_url,
          provider_id: "google.com",
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return next(ApiError.unauthorized("Unauthorized: Invalid token"));
  }
}

module.exports = verifyToken;
