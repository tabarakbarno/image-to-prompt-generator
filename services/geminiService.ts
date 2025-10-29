import { GoogleGenAI, Modality } from "@google/genai";

// Helper function to convert a File object to a GoogleGenerativeAI.Part object
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error("Failed to read file as data URL."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
  
  const data = await base64EncodedDataPromise;

  return {
    inlineData: { data, mimeType: file.type },
  };
};

// Main system instruction for the AI model
const SYSTEM_INSTRUCTION = `You are a world-class prompt engineer specialised in creating prompts for AI image generation tools (like Midjourney, Leonardo, etc.).

Your job is to generate a single, high-quality prompt based on the provided image and user notes that a creative user can input into an AI image-generator.

Your prompt must include:
- A concise description of the main subject of the image.
- The environment / background / scene setting.
- The camera angle & lens style (if relevant) — e.g., "wide-angle", "close‐up", "bird’s‐eye view".
- The lighting mood & tone — e.g., "golden hour", "soft diffused light", "dramatic chiaroscuro".
- The art-style or medium that strongly reflects the user's desired style.
- Optional extras: colour palette, texture hints, mood/emotion, time of day, weather if relevant.

Generate exactly one prompt. Do not add any extra commentary, titles, or explanations. Only output the prompt itself.`;

// Options for prompt generation
interface PromptGenerationOptions {
  aspectRatio: string;
  promptStyle: string;
  promptTone: string;
  language: string;
  negativePrompt: string;
  isEnhanced: boolean;
}

/**
 * Generates prompts for a batch of image files.
 * @param imageFiles - An array of File objects to process.
 * @param options - An object containing all the user-selected generation options.
 * @returns A promise that resolves to an array of generated prompt strings.
 */
export const generatePrompts = async (
  imageFiles: File[], 
  options: PromptGenerationOptions
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio, promptStyle, promptTone, language, negativePrompt, isEnhanced } = options;

  // Create a generation task for a single image file
  const generateSinglePrompt = async (file: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(file);

    const contentParts = [
      imagePart,
      { text: `The desired art style is: ${promptStyle}.` },
      { text: `The desired tone/emotion is: ${promptTone}.` },
      { text: `The prompt must be generated in ${language}.`},
      ...(isEnhanced ? [{ text: 'Enhance the prompt with extra creative details, rich vocabulary, and complex scene descriptions to maximize visual quality.'}] : []),
      ...(negativePrompt ? [{ text: `VERY IMPORTANT: Avoid any mention or depiction of the following concepts in the prompt: ${negativePrompt}.` }] : []),
      ...(aspectRatio !== 'auto' ? [{ text: `VERY IMPORTANT: Ensure the generated prompt ends with the exact aspect ratio tag: "--ar ${aspectRatio}"` }] : [])
    ];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
        contents: { parts: contentParts },
      });
      return response.text;
    } catch (e) {
      console.error('Gemini API call failed for one image', e);
      // For a single failure, return an error message in place of the prompt
      return `Error generating prompt for ${file.name}. The model may have refused the request.`;
    }
  };

  try {
    // Process all image files in parallel
    const generationPromises = imageFiles.map(file => generateSinglePrompt(file));
    return await Promise.all(generationPromises);
  } catch (e) {
    console.error('Batch prompt generation failed.', e);
    if (e instanceof Error && e.message.includes('API key not valid')) {
       throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to generate prompts. An unexpected error occurred during the batch process.");
  }
};

/**
 * Re-generates a prompt based on an existing one.
 * @param existingPrompt - The prompt string to rephrase.
 * @param style - The desired art style.
 * @param tone - The desired tone/emotion.
 * @returns A promise that resolves to a new prompt string.
 */
export const regeneratePrompt = async (existingPrompt: string, style: string, tone: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = `You are a prompt rephrasing assistant. Your task is to rewrite the given prompt to be more creative, vivid, and descriptive. 
    Maintain the core subject and elements of the original prompt. Do not add commentary. Only output the new prompt.`;

    const content = `Rephrase this prompt.
    Original Prompt: "${existingPrompt}"
    Desired Style: ${style}
    Desired Tone: ${tone}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction,
            },
            contents: content,
        });
        return response.text;
    } catch (e) {
        console.error('Prompt regeneration failed.', e);
        throw new Error("Failed to regenerate the prompt.");
    }
};

/**
 * Generates an image from a text prompt.
 * @param prompt - The text prompt to generate an image from.
 * @returns A promise that resolves to a base64 encoded image string.
 */
export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        throw new Error("No image data found in the response.");
    } catch (e) {
        console.error('Image generation failed.', e);
        throw new Error("Failed to generate the image. The model may have refused the request due to safety policies.");
    }
};
