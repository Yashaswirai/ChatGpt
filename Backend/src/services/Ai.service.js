const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({})

const generateResponse = async (prompt) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config:{
      temperature: 0.7,
      systemInstruction: "You are a helpful AI assistant, and your name is Aurora."
    }
  })
  return response.text
}

const generateVector = async (content) => {
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: content,
    config: {
      outputDimensionality: 768
    }
  })
  return response.embeddings[0].values
}

module.exports = {
  generateResponse,
  generateVector
}