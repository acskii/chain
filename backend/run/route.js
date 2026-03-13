import express from "express";

/* Get Controllers */
import { runChain } from "./controllers/run.js";

/* Authorisation */
import verify from "../middleware/auth.js";

const router = express.Router();

router.use(verify);

/* /run/chain */
router.post('/chain/:id', runChain);

export default router;