import Execution from "./model.js";

export default {
    /* CREATE */
    // Record a completed run of a chain
    async createExecution(chainId, stepInputs, response, runHash) {
        return await Execution.create({
            chainId,
            stepInputs,
            response,
            runHash
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
    },

    async getAllExecutions(page = 0, limit = 10) {
        const skip = (page - 1) * limit;
        return await Execution.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
    },

    async getExecutionById(id) {
        return Execution.findById(id);
    },

    async findSuccessfulByHash(hash) {
        return await Execution.findOne({ 
            runHash: hash, 
            status: 'success' 
        }).sort({ createdAt: -1 });
    },

    /* DELETE */
    async deleteExecutions(chainId) {
        return await Execution.deleteMany({ chainId });
    },

    /* UPDATE */
    async updateExecution(id, update) {
        return await Execution.findByIdAndUpdate(
            id,
            { $set: update },
            { returnDocument: 'after', runValidators: true }
        );
    }
};