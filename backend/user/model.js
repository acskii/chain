import { Schema, model } from "mongoose";

/* User Schema */
const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth users
    googleId: { type: String },
    githubId: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    profilePicture: String
}, { timestamps: true });

export default model('User', userSchema);