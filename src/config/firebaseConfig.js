// config/firestoreConfig.js
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
} catch (err) { // Changed 'error' to 'err' and using it in the console.error
  console.error(
    "Error reading or parsing service account file:", err.message,
    "\nEnsure the path is correct and file is in valid JSON format."
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
} catch (err) { // Changed 'error' to 'err' and using it in the console.error
  console.error(
    "Error initializing Firebase Admin SDK:", err.message,
    "\nPlease check your credentials and configuration."
  );
  throw new Error("Failed to initialize Firebase Admin SDK.");
}

const firestore = admin.firestore();
const auth = admin.auth(); // Initialize the Auth service

module.exports = { firestore, auth };
