import express from "express";

/* Get Controllers */
import { getAll, getOne, getByChain } from "./controllers/get.js";
import { createOne } from "./controllers/create.js";
import { deleteByChain } from "./controllers/delete.js";

const router = express.Router();

/* /execution */
router.get('/', getAll);

router.post('/', createOne);

/* /execution/{id} */
router.get('/:id', getOne);

/* /execution/chain/{id} */
router.get('/chain/:id', getByChain);

router.delete('/chain/:id', deleteByChain);

export default router;