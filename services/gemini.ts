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

// Element mapping for card analysis
const CARD_ELEMENTS: Record<string, string> = {
  "Fool": "Air", "Magician": "Air", "High Priestess": "Moon", "Empress": "Earth",
  "Emperor": "Fire", "Hierophant": "Earth", "Lovers": "Air", "Chariot": "Fire",
  "Strength": "Fire", "Hermit": "Earth", "Wheel of Fortune": "Fire", "Justice": "Air",
  "Hanged Man": "Water", "Death": "Water", "Temperance": "Fire", "Devil": "Fire",
  "Tower": "Fire", "Star": "Air", "Moon": "Water", "Sun": "Fire",
  "Judgement": "Fire", "World": "Earth",
  "Wands": "Fire", "Cups": "Water", "Swords": "Air", "Pentacles": "Earth"
};

const ELEMENT_MEANINGS: Record<string, string> = {
  "Fire": "行動力、創造力、激情",
  "Water": "情感、直覺、潛意識",
  "Air": "思想、溝通、變化",
  "Earth": "物質、穩定、實際"
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
  // New enhanced fields
  cardAnalysis: {
    element: string;
    elementMeaning: string;
    relationship: string;
    advice: string;
  };
}

// OFFLINE GENERATOR with enhanced analysis
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

  // Get elements
  const getElement = (cardName: string): string => {
    for (const [key, elem] of Object.entries(CARD_ELEMENTS)) {
      if (cardName.toLowerCase().includes(key.toLowerCase())) {
        return elem;
      }
    }
    // Default for minor arcana
    if (cardName.toLowerCase().includes("wand")) return "Fire";
    if (cardName.toLowerCase().includes("cup")) return "Water";
    if (cardName.toLowerCase().includes("sword")) return "Air";
    if (cardName.toLowerCase().includes("pentacle")) return "Earth";
    return "Unknown";
  };

  const elements = cards.map(c => getElement(c.name));
  const uniqueElements = [...new Set(elements)];
  
  let relationshipText = isZh 
    ? `呢三張牌包含${uniqueElements.join('、')}能量，展現左一個獨特既能量組合。` 
    : `These three cards contain ${uniqueElements.join(', ')} energy, showing a unique energy combination.`;
    
  const adviceText = isZh
    ? `宇宙建議你將呢啲能量转化为行動。注意你既直覺，同時保持實際既態度。呢個係一個適合開始新計劃既時機。`
    : `The universe advises you to transform these energies into action. Trust your intuition while maintaining a practical attitude. This is a good time to start new projects.`;

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
    summary: summaryText,
    cardAnalysis: {
      element: uniqueElements.join(' + '),
      elementMeaning: uniqueElements.map(e => ELEMENT_MEANINGS[e] || e).join(' / '),
      relationship: relationshipText,
      advice: adviceText
    }
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

  const systemInstruction = language === 'zh-TW' 
    ? `你係一位神秘既 Tarot 讀牌師。你既回應必須用繁體中文。你必須只回傳有效既 JSON，遵從以下既 schema。唔好包含 markdown 格式或者其他文字。`
    : `You are a mystical Tarot Reader. Your response language must be ${language}. You must return ONLY valid JSON that adheres to the provided schema. Do not include markdown formatting (like \`\`\`json) or any text outside of the JSON structure.`;

  const userPrompt = language === 'zh-TW'
    ? `
我抽左三張牌（過去、現在、未來）。請提供一個深刻既解讀。

抽既牌係：
${spreadDescription}
  
用家問既問題係: "${question || "一般指引"}"
  
基於呢個牌陣同問題，請提供：
1. 「過去」牌既詳細解讀，解釋佢對現況既影響。
2. 「現在」牌既詳細解讀，解釋目前既能量同挑戰。
3. 「未來」牌既詳細解讀，顯示潛在既結果或者未來既路向。
4. 「總結」- 將三張牌既敘事融合，並提供針對用家問題既具體行動建議。
5. 「元素分析」- 分析呢三張牌既元素組合（火焰、水、空氣、大地），解釋佢地既關係同埋呢種組合既特別意義。
6. 「行動建議」- 具體既行動步驟，用家可以點樣將呢啲能量轉化為實際行動。

請用溫暖、有洞察力既語氣回應，好似一個有智慧既導師。`
    : `
I have drawn a three-card spread (Past, Present, Future). Please provide a profound interpretation.

The cards drawn are:
${spreadDescription}
  
The question asked was: "${question || "General Guidance"}"
  
Based on this spread and question, please provide:
1. A detailed interpretation for the "Past" card, explaining its influence on the current situation.
2. A detailed interpretation for the "Present" card, explaining the current energies and challenges.
3. A detailed interpretation for the "Future" card, showing the potential outcome or path forward.
4. A final "Summary" that synthesizes the narrative arc of the three cards and offers specific, actionable spiritual advice related to the user's question.
5. "Element Analysis" - Analyze the elemental combination (Fire, Water, Air, Earth) of these three cards, explain their relationship and the special meaning of this combination.
6. "Action Advice" - Specific action steps on how the user can transform these energies into practical action.

Respond with warmth and insight, like a wise mentor guiding someone through a transformative journey.`;

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
            summary: { type: Type.STRING, description: "A summary of the reading and spiritual advice." },
            cardAnalysis: { 
              type: Type.OBJECT,
              description: "Enhanced card analysis with elements and advice",
              properties: {
                element: { type: Type.STRING, description: "The combined element(s) of the cards" },
                elementMeaning: { type: Type.STRING, description: "Meaning of the element combination" },
                relationship: { type: Type.STRING, description: "How the cards relate to each other" },
                advice: { type: Type.STRING, description: "Actionable advice for the user" }
              }
            }
          },
          required: ["past", "present", "future", "summary", "cardAnalysis"]
        },
        temperature: 0.8,
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
