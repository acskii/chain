/*
    Redirect on successful OAuth registration or login
*/

import generateToken from "../util/token.js";

export default async function(req, res) {
    const token = generateToken(req.user);

    res.redirect(`${process.env.REDIRECT_URI_LOGIN}?user_token=${token}`);
};