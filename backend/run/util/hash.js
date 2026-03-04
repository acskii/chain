/*
    Hashes a dictionary to a unique string
*/

import crypto from "node:crypto";

export default function hash(dict) {
    return crypto.createHash('sha256').update(JSON.stringify(dict)).digest('hex');
}