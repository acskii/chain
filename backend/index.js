/*
    Written by: Andrew Sameh Adel
    Main program file
*/

import express from "express";
import { createConnection } from "./db.js";
import chainRoutes from "./chain/route.js";
import executionRoutes from "./execution/route.js";
import userRoutes from "./user/route.js";
import runRoutes from "./run/route.js";

const DEFAULT_PORT = 5000;

// Connect to the database
createConnection();

// Start server
const app = express();
app.use(express.json());

// Routes
app.use('/api/chain', chainRoutes);
app.use('/api/execution', executionRoutes);
app.use('/api/user', userRoutes);
app.use('/run', runRoutes);

// Listener
const port = process.env.PORT || DEFAULT_PORT;
app.listen(port, () => console.log(`[Server] => Running on port ${port}`));