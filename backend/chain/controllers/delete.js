import chainInterface from "../interface.js";

export const deleteOne = async (req, res) => {
  try {
    await chainInterface.deleteChain(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};