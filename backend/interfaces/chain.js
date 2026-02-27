import { Chain } from "../models/chain.js";

export const chainInterface = {
    /* READ */
    async getAllChains(page = 1, limit = 10) {
        // Get all chains paginated
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Chain.find({}).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Chain.countDocuments({})
        ]);
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    },

    async getChainById(id) {
        // Get chain by ID
        return await Chain.findById(id);
    },

    /* CREATE */
    async createChain(name) {
        // Create an empty chain
        return await Chain.create({ name, steps: [] });
    },

    async createStep(chainId, stepData) {
        return await Chain.findByIdAndUpdate(
            chainId,
            { $push: { steps: stepData } },
            { new: true, runValidators: true }
        );
    },

    /* DELETE */
    async deleteChain(id) {
        // Delete chain along with all its execution history
        await Execution.deleteMany({ chainId: id });
        return await Chain.findByIdAndDelete(id);
    },

    async removeStep(chainId, stepId) {
        return await Chain.findByIdAndUpdate(
            chainId,
            { $pull: { steps: { _id: stepId } } },
            { new: true }
        );
    },

    /* UPDATE */
    async updateChain(id, { name, steps }) {        
        if (name) updateData.name = name;
        if (steps) updateData.steps = steps;

        return await Chain.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );
    },
};