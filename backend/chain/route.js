import express from "express";

/* Get Controllers */
import { getAll, getOne } from "./controllers/get.js";
import { createOne } from "./controllers/create.js";
import { updateOne } from "./controllers/update.js";
import { deleteOne } from "./controllers/delete.js";

const router = express.Router();

/* /chain */
router.get('/', getAll);

router.post('/', createOne);

/* /chain/{id} */
router.get('/:id', getOne);

router.post('/:id', updateOne);

router.delete('/:id', deleteOne);

export default router;