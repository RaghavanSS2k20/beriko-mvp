import { GoogleGenAI } from "@google/genai";

console.log(process.env.GEMINI_API_KEY);
export const model = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
