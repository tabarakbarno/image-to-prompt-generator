
import { GoogleGenAI } from "@google/genai";

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve((reader.result as string).split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  
  const data = await base64EncodedDataPromise;
  if (!data) {
    throw new Error("Failed to read file data.");
  }

  return {
    inlineData: { data, mimeType: file.type },
  };
};

export const generatePromptFromImage = async (imageFile: File, userText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);

  const masterPrompt = `You are a world-class prompt engineer specialised in creating prompts for AI image generation tools (like Midjourney, Leonardo, etc.).

Your job is to generate a single, high-quality prompt based on the provided image and user notes that a creative user can input into an AI image-generator.

Your prompt must include:
• A concise description of the main subject of the image.
• The environment / background / scene setting.
• The camera angle & lens style (if relevant) — e.g., "wide-angle", "close‐up", "bird’s‐eye view".
• The lighting mood & tone — e.g., "golden hour", "soft diffused light", "dramatic chiaroscuro".
• The art-style or medium (e.g., "hyper-realistic 8K render", "cinematic photorealism", "digital illustration", "vibrant cartoon").
• Optional extras: colour palette, texture hints, mood/emotion, time of day, weather if relevant.
• End the prompt with an aspect ratio tag (for example: “–ar 9:16”) suitable for the image provided.

Generate exactly one prompt. Do not add any extra commentary, titles, or explanations. Only output the prompt itself.
${userText ? `\nUser notes to consider: ${userText}` : ''}
`;

  const textPart = { text: masterPrompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });
    return response.text;
  } catch (e) {
    console.error(e);
    // Provide a more user-friendly error message
    if (e instanceof Error && e.message.includes('API key not valid')) {
       throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to generate prompt from the image. The model may be unable to process this request. Please try another image or check the API status.");
  }
};
