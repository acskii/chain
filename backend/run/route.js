import express from "express";

/* Get Controllers */
import { runChain } from "./controllers/run.js";

const router = express.Router();

/* /run/chain */
router.post('/chain/:id', runChain);

export default router;