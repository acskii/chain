import { connect } from "mongoose";

/*
    REQUIRED: MONGO_URI environment variable to locate MongoDB server
              -> else DEV is automatically tried.
*/

const DEV = 'mongodb://localhost:27017/promptchain'

export async function createConnection() {
    try {
        console.log("[Database] => Connecting to database...");
        const conn = await connect(process.env.MONGO_URI || DEV);
        console.log(`[Database] => Connected to MongoDB server: ${conn.connection.host}:${conn.connection.port}`);
        return conn;
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}