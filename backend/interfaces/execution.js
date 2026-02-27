import { Execution } from "../models/execution.js";

export const executionInterface = {
    /* CREATE */
    // Record a completed run of a chain
    async createExecution(chainId, stepInputs, response) {
        return await Execution.create({
            chainId,
            stepInputs,
            finalResponse,
            status: 'success'
        });
    },

    /* READ */
    async getExecutionsByChain(chainId, page = 0, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Execution.find({ chainId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Execution.countDocuments({})
        ]);
        
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    }

    // getExecutionById
};