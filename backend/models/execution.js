import { Schema, model } from "mongoose";

/* Execution Schema */
// A log record of chain execution that records
//      - Individual step user inputs
//      - Final chain response
//      - Chain execution status
const executionSchema = new Schema({
    chainId: { type: Schema.Types.ObjectId, ref: 'Chain', required: true },
    stepInputs: {
        type: Map,
        of: Schema.Types.Mixed // Allows for strings (user input) or objects (file data)
    },
    response: String,
    status: { type: String, enum: ['success', 'error', 'pending'], default: 'pending' }
}, { timestamps: true });

export const Execution = model('Execution', executionSchema);