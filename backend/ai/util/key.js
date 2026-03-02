// TODO: Get saved user API key from database
//       else send default key

const getAPIKey = () => {
    return process.env.DEFAULT_AI_KEY ?? null
};

export default getAPIKey;