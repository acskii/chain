import OpenAI from "openai";
import getAPIKey from "./util/key.js";

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
            messages: messages,
        });

        return response.choices[0].message.content;
    } else {
        // Warn about missing key
        // run test API call
        console.log("[AI] => service did not find an API key..");
        console.log("[AI] => assuming test mode");
        return "TEST PLACEHOLDER";
    }
};