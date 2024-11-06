const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");
require("dotenv").config();

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
  console.error(
    "Error: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
  );
  throw new Error(
    "Failed to initialize Firebase - missing service account path."
  );
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(
    fs.readFileSync(path.resolve(serviceAccountPath), "utf8")
  );
} catch (error) {
  console.error(
    "Error reading or parsing service account file. Ensure the path is correct and file is in valid JSON format."
  );
  throw new Error(
    "Failed to initialize Firebase - could not read service account file."
  );
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin initialized successfully.");
} catch (error) {
  console.error(
    "Error initializing Firebase Admin SDK. Please check your credentials and configuration."
  );
  throw new Error("Failed to initialize Firebase Admin SDK.");
}

const firestore = admin.firestore();
module.exports = firestore;
