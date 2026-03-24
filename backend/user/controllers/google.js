import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userInterface from "../interface.js";

/* Authenticate using Google OAuth2.0 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URI,
}, async (accessToken, refreshToken, profile, done) => {
    let user = await userInterface.findByEmail(profile.emails[0].value);
    if (!user) {
        user = await userInterface.create({
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true, // Google emails are pre-verified
            profilePicture: profile.photos[0].value
        });
    }
    return done(null, user);
}));

export const auth = passport.authenticate('google', { scope: ['profile', 'email'] });

export const callback = passport.authenticate('google', { session: false, failureRedirect: process.env.REDIRECT_URI });

export async function checkGoogleCredentials(_, res, next) {
    if (process.env.GOOGLE_CLIENT_ID == null || process.env.GOOGLE_CLIENT_SECRET == null || process.env.GOOGLE_CALLBACK_URI == null) {
        return res.status(404).json({
            message: "Missing Google OAuth Credentials"
        })
    }

    if (process.env.REDIRECT_URI_FAILURE == null || process.env.REDIRECT_URI_LOGIN == null) {
        return res.status(404).json({
            message: "Missing Client Redirect URI"
        })
    }

    return next();
}