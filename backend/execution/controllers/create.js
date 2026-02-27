import executionInterface from "../interface.js";

export const createOne = async (req, res) => {
  try {
    const { chainId, stepInputs, response } = req.body;
    const newExecution = await executionInterface.createExecution(chainId, stepInputs, response);
    res.status(201).json(newExecution);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};