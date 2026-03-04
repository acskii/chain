/*
    Validation for /run/chain route
    Includes checking the validity of step inputs for a specific chain
*/

export function validateStepInputs(chain, stepInputs) {
    const requiredSteps = chain.steps.filter(
        step => step.type === 'input' || step.type === 'file'
    );

    const errors = [];

    requiredSteps.forEach(step => {
        if (!stepInputs || !stepInputs[step.order.toString()]) {
            errors.push(`Step ${step.order} (${step.type}) requires input.`);
        }
    });

    return errors;
};