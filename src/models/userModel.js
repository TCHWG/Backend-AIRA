// models/userModel.js
const { firestore } = require("../config/firebaseConfig");
const { z } = require('zod'); // Add input validation

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  socialId: z.string().nullable(),
  authProvider: z.enum(['email', 'google', 'facebook']).nullable(),
  metadata: z.object({
    lastSignInTime: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
  })
});

class UserModel {
  constructor(userID, data) {
    this.userID = userID;
    this.name = data.name;
    this.email = data.email;
    this.socialId = data.socialId;
    this.authProvider = data.authProvider;
    this.metadata = {
      lastSignInTime: data.metadata?.lastSignInTime || null,
      createdAt: data.metadata?.createdAt || new Date().toISOString(),
      updatedAt: data.metadata?.updatedAt || new Date().toISOString()
    };
  }

  toJSON() {
    return {
      userID: this.userID,
      name: this.name,
      email: this.email,
      socialId: this.socialId,
      authProvider: this.authProvider,
      metadata: this.metadata
    };
  }

  async save() {
    try {
      // Validate data before saving
      const userData = {
        name: this.name,
        email: this.email,
        socialId: this.socialId,
        authProvider: this.authProvider,
        metadata: {
          ...this.metadata,
          updatedAt: new Date().toISOString()
        }
      };

      userSchema.parse(userData);

      await firestore.collection("users").doc(this.userID).set(userData, { merge: true });
      return this;
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Failed to save user data");
    }
  }

  static async getUserById(userID) {
    try {
      const userRef = firestore.collection("users").doc(userID);
      const doc = await userRef.get();

      if (!doc.exists) {
        throw new Error("User not found");
      }

      return new UserModel(userID, doc.data());
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }

  static async getUserByEmail(email) {
    try {
      const usersRef = firestore.collection("users");
      const snapshot = await usersRef.where("email", "==", email).limit(1).get();

      if (snapshot.empty) {
        throw new Error("User not found");
      }

      const doc = snapshot.docs[0];
      return new UserModel(doc.id, doc.data());
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async update(data) {
    const updateData = {
      ...data,
      metadata: {
        ...this.metadata,
        ...data.metadata, // Merge existing metadata with new metadata
        updatedAt: new Date().toISOString()
      }
    };

    // Validate before updating
    try {
      userSchema.parse({
        name: this.name,
        email: this.email,
        socialId: this.socialId,
        authProvider: this.authProvider,
        ...updateData
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        throw new Error("Invalid update data");
      }
      throw error;
    }

    Object.assign(this, updateData);
    return this.save();
  }
}

module.exports = UserModel;
