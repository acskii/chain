import { call } from "../ai/service.js";
import executionInterface from "../execution/interface.js";

/* Service for the purpose of running a given chain */

export const startPipeline = async (executionId, chain, stepInputs) => {
    let conversationHistory = [];

    try {
        await executionInterface.updateExecution(executionId, { 
            status: 'pending', 
            'progress.totalSteps': chain.steps.length
        });

        for (const step of chain.steps.sort((a, b) => a.order - b.order)) {
            let currentPrompt = step.prompt;

            if (step.stepType === 'input' && stepInputs[step.order]) {
                currentPrompt = `${currentPrompt}\n\nUser Input: ${stepInputs[step.order]}`;
            }

            if (step.stepType === 'file' && stepInputs[step.order]) {
                currentPrompt = `${currentPrompt}\n\nFile Content: ${stepInputs[step.order]}`;
            }

            const response = await call([...conversationHistory, { role: 'user', content: currentPrompt }]);

            // update message history
            conversationHistory.push({ role: 'user', content: currentPrompt });
            conversationHistory.push({ role: 'assistant', content: response });

            // update execution progress
            await executionInterface.updateExecution(executionId, {
                'progress.currentStep': step.order,
                'progress.lastStepOutput': response
            });
        }

        await executionInterface.updateExecution(executionId, {
            status: 'success',
            response: conversationHistory[conversationHistory.length - 1].content
        });

    } catch (error) {
        console.log("[PIPELINE] => Error occured during chain execution: ", error);
        await executionInterface.updateStatus(executionId, {
            status: 'error',
            errorDetails: error.message
        });
    }
};

export default startPipeline;