import passport from "passport";

export async function auth() {
    passport.authenticate('google', { scope: ['profile', 'email'] });
};

export async function callback() {
    passport.authenticate('google', { session: false });
};