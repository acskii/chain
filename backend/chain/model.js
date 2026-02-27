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
// NOTE: Each chain will belong to a user, this will be implemented later
const chainSchema = new Schema({
    name: { type: String, required: true, trim: true },
    steps: [stepSchema]
}, { timestamps: true });

export default model('Chain', chainSchema);