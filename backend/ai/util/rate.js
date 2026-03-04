/*
    This script will provide a facade that gives varying usage rate information based on AI provider
    specified in environment variable PROVIDER_NAME

    Supported:
        - openrouter

*/

import { getRemainingUsage, getInfoUsage } from "./rates/OpenRouter.js";
import getAPIKey from "./key.js";

const PROVIDER_NAME = process.env.PROVIDER_NAME;

export async function getAvailableCalls() {
    const apiKey = getAPIKey();
    switch (PROVIDER_NAME) {
        case "openrouter":
            return await getRemainingUsage(apiKey);
        default: 
            return 1;   // For testing
    }
}

export async function getKeyInfo() {
    const apiKey = getAPIKey();
    switch (PROVIDER_NAME) {
        case "openrouter":
            return await getInfoUsage(apiKey);
    }
}