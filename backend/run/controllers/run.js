import executionInterface from "../../execution/interface.js";
import { getAvailableCalls } from "../../ai/util/rate.js";
import startPipeline from "../service.js";
import chainInterface from "../../chain/interface.js";
import hash from "../util/hash.js";
import { validateStepInputs } from "../util/validate.js";

export const runChain = async (req, res) => {
  try {
        const chainId = req.params.id;
        const { stepInputs } = req.body;

        const chain = await chainInterface.getChainById(chainId);
        if (!chain) return res.status(404).json({ error: "Chain not found" });

        // Validate all step inputs
        // Bad request if an error is detected
        const errors = validateStepInputs(chain, stepInputs);
        if (errors.length > 0) {
            return res.status(400).json({
                message: "Step inputs missing", 
                errors: errors.join(' ')
            });
        }

        // Create hash for execution index
        const runHash = hash({ chainId, stepInputs });

        const cached = await executionInterface.findSuccessfulByHash(runHash);
        if (cached) {
            return res.status(200).json({
                message: "Previous run found", 
                executionId: cached._id,
                isCached: true,
                response: cached.response
            });
        } else {
            const usage = await getAvailableCalls();
            console.log(usage);
            // check if limit exceeded before running
            if (usage != 0) {
                const execution = await executionInterface.createExecution(
                    chainId, 
                    stepInputs, 
                    "pending..",
                    runHash 
                );

                startPipeline(execution._id, chain, stepInputs);

                res.status(202).json({ 
                    message: "Chain started", 
                    isCached: false,
                    executionId: execution._id 
                });
            } else {
                res.status(429).json({ message: "API key limit exceeded" });
            }
        }
  } catch (error) {
        res.status(500).json({ error: error.message });
  }
};