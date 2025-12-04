
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// CONSTANTS for Offline Fallback
const FALLBACK_VERBS = ["embrace", "reflect upon", "channel", "release", "harmonize with", "seek"];
const FALLBACK_NOUNS = ["inner truth", "cosmic flow", "hidden potential", "past burdens", "future possibilities"];
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

// SAFELY ACCESS API KEY
const getApiKey = () => {
  // Check typical locations for API keys in different environments
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // @ts-ignore - Vite specific
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_KEY) {
    // @ts-ignore
    return import.meta.env.VITE_API_KEY;
  }
  return null;
};

// OFFLINE GENERATOR
function generateOfflineReading(cardName: string, question: string, language: string): string {
  // Simple extraction of keywords
  const lowerName = cardName.toLowerCase();
  let keywords = ["mystery", "fate", "destiny"];
  
  for (const [key, words] of Object.entries(KEYWORDS)) {
    if (lowerName.includes(key.toLowerCase())) {
      keywords = words;
      break;
    }
  }

  const k1 = keywords[0];
  const k2 = keywords[1] || keywords[0];
  
  if (language === 'zh-TW') {
      return `【${cardName}】
      
星辰指引：這張牌象徵著 ${k1} 與 ${k2}。
此刻，命運的迷霧散去，宇宙建議你尋找內心的平衡。
${question ? `關於你的提問 "${question}"，請相信直覺，答案就在平靜之中。` : '命運之輪正在轉動，保持信念。'}`;
  }

  // English Default
  return `The mists part to reveal ${cardName}.
  
The essence of this card is ${k1} and ${k2}.
The stars suggest you must look inward.
${question ? "Regarding your query, the answer lies in finding balance within the chaos." : "Trust in the turning of the wheel."}`;
}

export async function getTarotReading(cardName: string, question: string, language: string): Promise<string> {
  const apiKey = getApiKey();
  
  // If no key is found, immediately return offline reading without crashing
  if (!apiKey) {
    console.log("No API Key found, using Offline Oracle.");
    return generateOfflineReading(cardName, question, language);
  }

  // GROQ SYSTEM PROMPT
  const systemPrompt = `You are an ancient Tarot Reader. Tone: Mystical, Ethereal. Max 100 words.
  Language: ${language}.
  Card: ${cardName}.
  Question: ${question || "General guidance"}.
  Structure: 1. Essence. 2. Actionable advice.`;

  try {
    // Attempt to use Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
            { role: "system", content: "You are a mystical tarot reader." },
            { role: "user", content: systemPrompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
        throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || generateOfflineReading(cardName, question, language);

  } catch (error) {
    console.warn("AI Connection Failed, switching to Offline Oracle:", error);
    return generateOfflineReading(cardName, question, language);
  }
}
