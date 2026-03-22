import Chain from "./model.js";
import Execution from "../execution/model.js";
import hash from "./util/hash.js";

export default {
    /* READ */
    async getAllChains(userId, page = 1, limit = 10) {
        // Get all chains paginated
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Chain.find({ userId: userId }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Chain.countDocuments({})
        ]);
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    },

    async getChainById(id) {
        // Get chain by ID
        return await Chain.findById(id);
    },

    async getChainsByUser(userId, page = 1, limit = 10) {
        // Get all chains by a specific user paginated
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            Chain.find({ userId: userId, public: true }).skip(skip).limit(limit).sort({ createdAt: -1 }),
            Chain.countDocuments({})
        ]);
        return { data, total, page, totalPages: Math.ceil(total / limit) };
    },

    /* CREATE */
    async createChain(userId, name) {
        // Create an empty chain
        return await Chain.create({ name, userId, steps: [], hash: hash([]) });
    },

    /* DELETE */
    async deleteChain(userId, id) {
        // Delete chain along with all its execution history
        await Execution.deleteMany({ userId: id, chainId: id });
        return await Chain.findOneAndDelete({ _id: id, userId: userId });
    },

    /* UPDATE */
    async updateChain(userId, id, { name, steps, pub }) {    
        const updateData  = {};
        
        if (name) updateData.name = name;
        if (steps) {
            updateData.steps = steps;
            updateData.hash = hash([...steps, id]);
        }
        if (pub) updateData.public = pub;

        return await Chain.findOneAndUpdate(
            { _id: id, userId: userId },
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );
    },
};