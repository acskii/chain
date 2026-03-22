import chainInterface from "../interface.js";

export const updateOne = async (req, res) => {
  try {
    const { name, steps, pub } = req.body;
    const updatedChain = await chainInterface.updateChain(req.userId, req.params.id, { name, steps, pub });
    res.json(updatedChain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};