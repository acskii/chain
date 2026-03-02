import executionInterface from "../../execution/interface.js";
import getUsage from "../../ai/util/rate.js";
import startPipeline from "../service.js";
import chainInterface from "../../chain/interface.js";

export const runChain = async (req, res) => {
  try {
        const chainId = req.params.id;
        const { stepInputs } = req.body;

        const chain = await chainInterface.getChainById(chainId);
        if (!chain) return res.status(404).json({ error: "Chain not found" });

        const usage = getUsage();
        console.log(usage);
        // check if limit exceeded before running

        const execution = await executionInterface.createExecution(
            chainId, 
            stepInputs, 
            "pending.." 
        );

        startPipeline(execution._id, chain, stepInputs);

        res.status(202).json({ 
            message: "Chain started", 
            executionId: execution._id 
        });
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
};