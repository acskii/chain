import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import userInterface from "../interface.js";

/* Authenticate using Google OAuth2.0 */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/auth/google/callback"
}, async (_, _, profile, done) => {
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