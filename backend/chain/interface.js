import Chain from "./model.js";
import Execution from "../execution/model.js";
import hash from "./util/hash.js";

export default {
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
        return await Chain.create({ name, steps: [], hash: hash([]) });
    },

    /* DELETE */
    async deleteChain(id) {
        // Delete chain along with all its execution history
        await Execution.deleteMany({ chainId: id });
        return await Chain.findByIdAndDelete(id);
    },

    /* UPDATE */
    async updateChain(id, { name, steps }) {    
        const updateData  = {};
        
        if (name) updateData.name = name;
        if (steps) {
            updateData.steps = steps;
            updateData.hash = hash([...steps, id]);
        }

        return await Chain.findByIdAndUpdate(
            id,
            { $set: updateData },
            { returnDocument: 'after', runValidators: true }
        );
    },
};