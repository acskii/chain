/*
    Hashes an array to a unique string
*/

import crypto from "node:crypto";

export default function hash(array) {
    return crypto.createHash('sha256').update(JSON.stringify(array)).digest('hex');
}