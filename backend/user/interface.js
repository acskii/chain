import User from "./model.js";

export default {
    async findByEmail(email) {
        return await User.findOne({ email });
    },
    async findById(id) {
        return await User.findById(id);
    },
    async create(userData) {
        return await User.create(userData);
    },
    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    }
};