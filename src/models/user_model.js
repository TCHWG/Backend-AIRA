const firestore = require("../config/firestoreConfig");

const saveUser = async (firebaseUid, name, email, createdAt, updatedAt) => {
  try {
    const userData = {
      firebase_uid: firebaseUid,
      name: name,
      email: email,
      created_at: createdAt || new Date().toISOString(),
      updated_at: updatedAt || new Date().toISOString(),
    };

    await firestore.collection("users").doc(firebaseUid).set(userData);
    return { success: true, message: "User added successfully" };
  } catch (error) {
    console.error("Error saving user:", error);
    return { success: false, message: "Error saving user", error: error };
  }
};

module.exports = {
  saveUser,
};
