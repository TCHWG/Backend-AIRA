const { firestore: db, auth } = require("../config/firebaseConfig");
const ApiError = require("../errors/apiError");

async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];

  if (!idToken) {
    return next(ApiError.unauthorized("Unauthorized: Token missing"));
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken;
    const { uid, name = "", email, picture = "" } = decodedToken;

    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    let user;

    if (userDoc.exists) {
      user = userDoc.data();
    } else {
      user = { uid, name, email, picture };
      await userRef.set(user);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    return next(ApiError.unauthorized("Unauthorized: Invalid token"));
  }
}

module.exports = verifyToken;
