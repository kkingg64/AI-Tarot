
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";

// CONSTANTS for Offline Fallback
const KEYWORDS: Record<string, string[]> = {
  "Fool": ["beginnings", "spontaneity", "faith"],
  "Magician": ["manifestation", "power", "action"],
  "High Priestess": ["intuition", "mystery", "subconscious"],
  "Empress": ["fertility", "nature", "abundance"],
  "Emperor": ["authority", "structure", "control"],
  "Hierophant": ["tradition", "conformity", "morality"],
  "Lovers": ["partnership", "union", "choices"],
  "Chariot": ["control", "willpower", "victory"],
  "Strength": ["courage", "persuasion", "influence"],
  "Hermit": ["introspection", "solitude", "guidance"],
  "Wheel of Fortune": ["luck", "karma", "cycles"],
  "Justice": ["fairness", "truth", "law"],
  "Hanged Man": ["sacrifice", "release", "martyrdom"],
  "Death": ["endings", "change", "transformation"],
  "Temperance": ["balance", "moderation", "patience"],
  "Devil": ["bondage", "addiction", "materialism"],
  "Tower": ["disaster", "upheaval", "sudden change"],
  "Star": ["hope", "faith", "rejuvenation"],
  "Moon": ["illusion", "fear", "anxiety"],
  "Sun": ["positivity", "fun", "warmth"],
  "Judgement": ["judgement", "rebirth", "inner calling"],
  "World": ["completion", "integration", "accomplishment"],
  "Wands": ["creativity", "action", "passion"],
  "Cups": ["emotion", "relationships", "intuition"],
  "Swords": ["intellect", "communication", "conflict"],
  "Pentacles": ["material wealth", "career", "manifestation"]
};

export interface CardReadingInput {
  name: string;
  isReversed: boolean;
  position: string; // "Past", "Present", "Future"
}

export interface StructuredReading {
  past: string;
  present: string;
  future: string;
  summary: string;
}

// OFFLINE GENERATOR
function generateOfflineReading(cards: CardReadingInput[], question: string, language: string): StructuredReading {
  const isZh = language === 'zh-TW';
  
  const getCardText = (card: CardReadingInput) => {
    const lowerName = card.name.toLowerCase();
    let keywords = ["mystery", "fate"];
    
    for (const [key, words] of Object.entries(KEYWORDS)) {
      if (lowerName.includes(key.toLowerCase())) {
        keywords = words;
        break;
      }
    }
    const k1 = keywords[0];
    const k2 = keywords[1] || keywords[0];

    if (isZh) {
       return `${card.name} ${card.isReversed ? '(逆位)' : '(正位)'} 象徵著${k1}。${card.isReversed ? '目前能量受阻，建議反思內在。' : '這是一股強大的推動力。'} 在這個位置，它暗示你需要關注${k2}。`;
    } else {
       return `${card.name} (${card.isReversed ? 'Reversed' : 'Upright'}) symbolizes ${k1}. ${card.isReversed ? 'The energy is currently blocked, calling for inner reflection.' : 'This serves as a powerful driving force.'} In this position, it suggests focusing on ${k2}.`;
    }
  };

  const pastText = getCardText(cards[0]);
  const presentText = getCardText(cards[1]);
  const futureText = getCardText(cards[2]);
  
  const summaryText = isZh 
    ? `總結來說，這三張牌形成了一個強大的敘事。過去的${cards[0].name}為現在的${cards[1].name}奠定了基礎，最終指向${cards[2].name}的潛能。${question ? `針對您的問題 "${question}"，` : ''} 宇宙建議您整合這些能量，相信直覺，勇敢前行。`
    : `In summary, these three cards weave a powerful narrative. The ${cards[0].name} of the past laid the groundwork for the ${cards[1].name} you experience now, pointing towards the potential of the ${cards[2].name}. ${question ? `Regarding "${question}",` : ''} The universe advises you to synthesize these energies, trust your intuition, and move forward with purpose.`;

  return {
    past: pastText,
    present: presentText,
    future: futureText,
    summary: summaryText
  };
}

export async function getTarotReading(cards: CardReadingInput[], question: string, language: string): Promise<StructuredReading> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.log("No API Key found. Using Offline Oracle.");
    return generateOfflineReading(cards, question, language);
  }

  const ai = new GoogleGenAI({ apiKey });

  const spreadDescription = cards.map(c => 
    `${c.position}: ${c.name} (${c.isReversed ? 'Reversed' : 'Upright'})`
  ).join('\n');

  const systemInstruction = `You are a mystical Tarot Reader. Your response language must be ${language}.
  You must return ONLY valid JSON that adheres to the provided schema.
  Do not include markdown formatting (like \`\`\`json) or any text outside of the JSON structure.`;

  const userPrompt = `
  I have drawn a three-card spread (Past, Present, Future). Please provide a profound interpretation.

  The cards drawn are:
  ${spreadDescription}
  
  The question asked was: "${question || "General Guidance"}"
  
  Based on this spread and question, please provide:
  1.  A detailed interpretation for the "Past" card, explaining its influence on the current situation.
  2.  A detailed interpretation for the "Present" card, explaining the current energies and challenges.
  3.  A detailed interpretation for the "Future" card, showing the potential outcome or path forward.
  4.  A final "Summary" that synthesizes the narrative arc of the three cards and offers specific, actionable spiritual advice related to the user's question.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            past: { type: Type.STRING, description: "Interpretation of the past card." },
            present: { type: Type.STRING, description: "Interpretation of the present card." },
            future: { type: Type.STRING, description: "Interpretation of the future card." },
            summary: { type: Type.STRING, description: "A summary of the reading and spiritual advice." }
          },
          required: ["past", "present", "future", "summary"]
        },
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as StructuredReading;
    }
    
    throw new Error("AI response was empty.");

  } catch (error) {
    console.error("AI Connection Failed, switching to Offline Oracle:", error);
    return generateOfflineReading(cards, question, language);
  }
}