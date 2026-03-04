import OpenAI from "openai";
import getAPIKey from "./util/key.js";

const SYSTEM_MESSAGE = `
You are a functional processing unit in a sequence of automated steps. 
Your task is to provide ONLY the direct result of the user's request. 
Do not provide introductions, conclusions, explanations or markdown unless requested. 
Do not use conversational filler (e.g., 'Here is your result'). 
Output the raw value only.
`;

export const call = async (messages) => {
    const key = getAPIKey();

    // An API key must be provided
    if (key) {
        const ai = new OpenAI({
            baseURL: process.env.PROVIDER_BASE_URL,
            apiKey: key,
        });

        const response = await ai.chat.completions.create({
            model: process.env.DEFAULT_AI_MODEL,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_MESSAGE
                },
                ...messages
            ],
            temperature: 0.1
        });

        console.log("[AI] => Returning response from model");
        return response.choices[0].message.content;
    } else {
        // Warn about missing key
        // run test API call
        console.log("[AI] => service did not find an API key..");
        console.log("[AI] => assuming test mode");
        return "TEST PLACEHOLDER";
    }
};