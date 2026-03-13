/*
    Redirect on successful OAuth registration or login
*/

import generateToken from "../util/token.js";

export default async function(req, res) {
    const token = generateToken(req.user);

    res.status(200).json({ token: token });
};