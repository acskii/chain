import { Schema, model } from "mongoose";

/* Chain Step Schema */
const stepSchema = new Schema({
    type: { 
        type: String, 
        enum: ['fixed', 'input', 'file', 'output'], 
        required: true 
    },
    prompt: { type: String, required: true },
    order: { type: Number, required: true },
    
    // Optional fields based on type
    variableName: String, // For 'input' steps
    fileUrl: String,      // For 'file' steps
    format: String        // For 'output' steps
}, {_id: true});

/* Chain Schema */
const chainSchema = new Schema({
    name: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hash: { type: String, required: true },
    steps: [stepSchema],
    public: { type: Boolean, default: false }
}, { timestamps: true });

export default model('Chain', chainSchema);