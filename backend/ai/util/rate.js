import axios from 'axios';

const getUsage = async (apiKey) => {
  try {
    const endpoint = process.env.PROVIDER_RATE_LIMIT_ENDPOINT;
    if (endpoint) {
        const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });
        
        return response.data.data;
    }
    
  } catch (error) {
    console.error("[AI] => Unable to retrieve model usage from endpoint: ", error.message);
    return null;
  }
};

export default getUsage;