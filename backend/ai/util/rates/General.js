/*
  Because I have made the endpoint where API usage retrieve is interchangable,
  I must now have implementations based on supported AI models and whether they have or have not an endpoint
  to check.

  As of 4/3/2026 -> Only OpenRouter API keys is supported. Check rates/OpenRouter for implementation.
  - Andrew
*/

import axios from 'axios';

export default async function getUsageData(apiKey) {
  try {
    const endpoint = process.env.PROVIDER_RATE_LIMIT_ENDPOINT;
    if (endpoint) {
        const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        
        return response.data;
    }
    
  } catch (error) {
    console.error("[AI] => Unable to retrieve model usage from endpoint: ", error.message);
    return null;
  }
};