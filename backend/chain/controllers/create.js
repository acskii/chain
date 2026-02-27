import chainInterface from "../interface.js";

const DEFAULT_NAME = "Untitled";

export const createOne = async (req, res) => {
  try {
    const { name } = req.body;
    const newChain = await chainInterface.createChain(name || DEFAULT_NAME);
    res.status(201).json(newChain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};