import chainInterface from "../interface.js";

export const updateOne = async (req, res) => {
  try {
    const { name, steps } = req.body;
    const updatedChain = await chainInterface.updateChain(req.params.id, { name, steps });
    res.json(updatedChain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};