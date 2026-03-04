/*
    Implementation of rate limit and usage limit checking for OpenRouter
*/

import getUsageData from "./General";

export async function getRemainingUsage(apiKey) {
    // Get general response from endpoint
    const response = await getUsageData(apiKey);

    // Only return the remaining usage of the API key
    const { limit_remaining } = response.data;

    return limit_remaining ?? 999;  // 999 means infinite
};

export async function getInfoUsage(apiKey) {
    // Get general response from endpoint
    const response = await getUsageData(apiKey);

    // Return the usage of the API key
    // Check: https://openrouter.ai/docs/api/reference/limits
    const { limit, limit_remaining, is_free_tier } = response.data;

    return {
        limit, limit_remaining, is_free_tier
    }
}