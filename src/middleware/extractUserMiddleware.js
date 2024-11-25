function extractUserMiddleware(req, res, next) {
  const uid = req.headers["x-user-uid"];
  const email = req.headers["x-user-email"];
  const name = req.headers["x-user-name"];
  const photo = req.headers["x-user-photo"];

  if (uid) {
    req.user = { uid, email, name, photo };
    return next();
  }

  return res.status(401).json({ message: "Unauthorized: User data missing" });
}

module.exports = extractUserMiddleware;