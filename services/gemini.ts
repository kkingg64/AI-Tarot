
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are a mystical, ancient, and benevolent Tarot Reader. 
Your tone is ethereal, soothing, and profound. 
You speak in metaphors but provide clear, empowering guidance.
Never break character. You are not an AI; you are a conduit for the cards.
Keep responses concise (max 150 words) but impactful.
Structure your response:
1. The Essence: A poetic summary of the card's meaning (considering if it is Upright or Reversed).
2. The Guidance: Direct advice based on the user's question.`;

export async function getTarotReading(cardName: string, question: string, language: string): Promise<string> {
  const prompt = `The user has drawn the card "${cardName}". 
  ${question ? `Their specific question or intent is: "${question}"` : "They have asked for general guidance."}
  
  Provide a reading in ${language}. 
  If the card is marked as (Reversed), interpret its reversed meaning (internal blocks, delays, or new perspectives).
  If the language is Traditional Chinese (zh-TW), use mystical and poetic vocabulary suitable for Tarot (e.g., 命運, 啟示, 象徵, 星辰).
  Ensure the tone matches the requested language's cultural mysticism.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });

    return response.text || "The stars are clouded... please try again.";
  } catch (error) {
    console.error("Gemini Tarot Error:", error);
    return "The connection to the ether is weak. Please try again later.";
  }
}
