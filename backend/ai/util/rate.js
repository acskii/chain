/*
    This script will provide a facade that gives varying usage rate information based on AI provider
    specified in environment variable PROVIDER_NAME

    Supported:
        - openrouter

*/

import { getRemainingUsage, getInfoUsage } from "./rates/OpenRouter";
import getAPIKey from "./key";

const PROVIDER_NAME = process.env.PROVIDER_NAME;

export function getAvailableCalls() {
    const apiKey = getAPIKey();
    switch (PROVIDER_NAME) {
        case "openrouter":
            return getRemainingUsage(apiKey);
    }
}

export function getKeyInfo() {
    const apiKey = getAPIKey();
    switch (PROVIDER_NAME) {
        case "openrouter":
            return getInfoUsage(apiKey);
    }
}