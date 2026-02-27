import executionInterface from "../interface.js";

export const getByChain = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const chains = await executionInterface.getExecutionsByChain(req.params.id, Number(page) || 1, Number(limit) || 10);
        res.json(chains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getOne = async (req, res) => {
    try {
        const execution = await executionInterface.getExecutionById(req.params.id);
        if (!execution) return res.status(404).json({ error: "Execution not found" });
        res.json(execution);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        const { page, limit } = req.query;
        const executions = await executionInterface.getAllExecutions(Number(page) || 1, Number(limit) || 10);
        res.json(executions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};