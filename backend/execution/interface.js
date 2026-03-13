import Execution from "./model.js";
import Chain from "../chain/model.js";

export default {
    /* CREATE */
    // Record a completed run of a chain
    async createExecution(userId, chainId, stepInputs, response, runHash, chainHash) {
        return await Execution.create({
            chainId,
            userId,
            stepInputs,
            response,
            runHash,
            chainHash
        });
    },

    /* READ */
    async getExecutionsByChain(userId, chainId, page = 0, limit = 10) {
        const skip = (page - 1) * limit;
        const chain = await Chain.findById(chainId);
        const chainHash = chain.hash;
        const [data, total] = await Promise.all([
            Execution.find({ userId: userId, chainHash: chainHash }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Execution.countDocuments({})
        ]);
        
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    },

    async getAllExecutions(userId, page = 0, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Execution.find({ userId: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Execution.countDocuments({})
        ]);
        
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    },

    async getExecutionById(userId, id) {
        return Execution.findOne({ _id: id, userId: userId });
    },

    async findSuccessfulByHash(userId, hash) {
        return await Execution.findOne({ 
            userId: userId,
            runHash: hash, 
            status: 'success' 
        }).sort({ createdAt: -1 });
    },

    /* DELETE */
    async deleteExecutions(userId, chainId) {
        return await Execution.deleteMany({ chainId: chainId, userId: userId });
    },

    /* UPDATE */
    async updateExecution(userId, id, update) {
        return await Execution.findByIdAndUpdate(
            { _id: id, userId: userId },
            { $set: update },
            { returnDocument: 'after', runValidators: true }
        );
    }
};