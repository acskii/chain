/* 
    Service for the purpose of running a given chain 
*/

import { call } from "../ai/service.js";
import executionInterface from "../execution/interface.js";

export default async function startPipeline(executionId, chain, stepInputs) {
    let lastResponse = "";

    try {
        await executionInterface.updateExecution(executionId, { 
            status: 'pending', 
            'progress.totalSteps': chain.steps.length
        });

        for (const step of chain.steps.sort((a, b) => a.order - b.order)) {
            let finalPrompt = "";

            if (lastResponse) {
                finalPrompt += `CONTEXT FROM PREVIOUS STEP:\n${lastResponse}\n\n`;
            }

            finalPrompt += `CURRENT STEP:\n${step.prompt}\n\n`;

            if (stepInputs[step.order]) {
                finalPrompt += `${step.type == 'input' ? "USER INPUT" : "FILE CONTENT"} FOR THIS STEP:\n${stepInputs[step.order]}\n\n`;
            }

            const response = await call([{ role: 'user', content: finalPrompt }]);
            lastResponse = response;

            // update execution progress
            await executionInterface.updateExecution(executionId, {
                'progress.currentStep': step.order,
                'progress.lastStepOutput': lastResponse
            });
        }

        await executionInterface.updateExecution(executionId, {
            status: 'success',
            response: lastResponse
        });

    } catch (error) {
        console.log("[PIPELINE] => Error occured during chain execution: ", error);
        await executionInterface.updateExecution(executionId, {
            status: 'error',
            errorDetails: error.message
        });
    }
};