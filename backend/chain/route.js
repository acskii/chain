import express from "express";

/* Get Controllers */
import { getAll, getOne, getByUser } from "./controllers/get.js";
import { createOne } from "./controllers/create.js";
import { updateOne } from "./controllers/update.js";
import { deleteOne } from "./controllers/delete.js";

/* Authorisation */
import verify from "../middleware/auth.js";

const router = express.Router();

router.use(verify);

/* /chain */
router.get('/', getAll);

router.get('/u/:id', getByUser);

router.post('/', createOne);

/* /chain/{id} */
router.get('/:id', getOne);

router.patch('/:id', updateOne);

router.delete('/:id', deleteOne);

export default router;