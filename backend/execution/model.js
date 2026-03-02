import { Schema, model } from "mongoose";

/* Execution Schema */
// A log record of chain execution that records
//      - Individual step user inputs
//      - Final chain response
const executionSchema = new Schema({
    chainId: { type: Schema.Types.ObjectId, ref: 'Chain', required: true },
    status: { type: String, enum: ['pending', 'error', 'success'], default: 'pending' },
    stepInputs: {
        type: Map,
        of: Schema.Types.Mixed // Allows for strings (user input) or objects (file data)
    },
    response: { type: String },
    progress: {
        currentStep: { type: Number, default: 0 },
        totalSteps: { type: Number, default: 0 },
        lastStepOutput: { type: String }
    },
    errorDetails: { type: String }
}, { timestamps: true });

export default model('Execution', executionSchema);