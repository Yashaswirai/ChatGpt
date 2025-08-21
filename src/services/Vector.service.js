// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const GptIndex = pc.Index("chatgpt")

const createMemory = async({vector,messageId,metadata}) => {
    try {
        await GptIndex.upsert([{
            id: messageId,
            values: vector,
            metadata,
        }])
    } catch (error) {
        console.log("Error creating the memory: ",error)
    }
}

const queryMemory = async({vector,metadata,limit=2}) => {
    try {
        const data = await GptIndex.query({
            vector,
            topK: limit,
            includeMetadata: true,
            filter: metadata ? metadata : undefined,
        });
        return data.matches;
    } catch (error) {
        console.log("Error querying the memory: ", error);
    }
};
module.exports = {
    createMemory,
    queryMemory
};