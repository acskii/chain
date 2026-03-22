import express from "express";

/* Get Controllers */
import { register, login } from "./controllers/email.js";
import { auth, callback, checkGoogleCredentials } from "./controllers/google.js";
import oauth from "./controllers/oauth.js";
import getProfile from "./controllers/profile.js";

/* Authorisation */
import verify from "../middleware/auth.js";

const router = express.Router();

/* /profile */
router.get('/profile', verify, getProfile);

/* /register */
router.post('/register', register);

/* /login */
router.post('/login', login);

/* Google OAuth */
router.get('/auth/google', checkGoogleCredentials, auth);
router.get('/auth/google/callback', checkGoogleCredentials, callback, oauth);

export default router;