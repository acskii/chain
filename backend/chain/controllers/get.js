import chainInterface from "../interface.js";

export const getAll = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const chains = await chainInterface.getAllChains(Number(page) || 1, Number(limit) || 10);
        res.json(chains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOne = async (req, res) => {
  try {
    const chain = await chainInterface.getChainById(req.params.id);
    if (!chain) return res.status(404).json({ error: "Chain not found" });
    res.json(chain);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};