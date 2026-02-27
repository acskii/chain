import executionInterface from "../interface.js";

export const deleteByChain = async (req, res) => {
    try {
        await executionInterface.deleteExecutions(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};