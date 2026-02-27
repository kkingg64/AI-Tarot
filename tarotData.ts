/**
 * AI Tarot - 78張塔羅牌數據庫
 * 使用 Rider-Waite Smith 真實卡牌圖片
 */

import React from 'react';

// ===========================
// 78張塔羅牌數據庫 - 真實卡牌圖片
// ===========================
const TAROT_DECK: Record<number, { 
  name: string; 
  nameEn: string; 
  image: string;
  icon: string;
  meaning: string; 
  reverse: string; 
}> = {
  // Major Arcana (0-21) - Rider-Waite Smith 圖片
  0: { name: '愚者', nameEn: 'The Fool', icon: '🃏', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/RWS_Tarot_00_Fool.jpg/300px-RWS_Tarot_00_Fool.jpg', meaning: '新開始、自由、冒險、信任宇宙。愚者代表新的開始和無限的可能，鼓勵你勇於嘗試和冒險。', reverse: '魯莽、輕率、缺乏責任感。過度冒險而不考慮後果。' },
  1: { name: '魔術師', nameEn: 'The Magician', icon: '🎩', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/RWS_Tarot_01_Magician.jpg/300px-RWS_Tarot_01_Magician.jpg', meaning: '意志力、創造力、技巧、資源運用。你擁有實現目標所需的所有能力和工具。', reverse: '欺騙、操縱、技巧不足。未能善用你的資源和能力。' },
  2: { name: '女祭司', nameEn: 'The High Priestess', icon: '🌙', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/RWS_Tarot_02_High_Priestess.jpg/300px-RWS_Tarot_02_High_Priestess.jpg', meaning: '直覺、智慧、神秘、潛意識。倾听你內在的聲音，它會引導你找到答案。', reverse: '表面化、缺乏深度、封閉。忽視你的直覺，過於依賴表面信息。' },
  3: { name: '皇后', nameEn: 'The Empress', icon: '👑', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/RWS_Tarot_03_Empress.jpg/300px-RWS_Tarot_03_Empress.jpg', meaning: '豐盛、母性、創造力、自然。創造力和豐盛即將到來，這是培養和成長的時刻。', reverse: '依賴、濫用、缺乏創造力。過度依賴他人或物質事物。' },
  4: { name: '皇帝', nameEn: 'The Emperor', icon: '⚔️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/RWS_Tarot_04_Emperor.jpg/300px-RWS_Tarot_04_Emperor.jpg', meaning: '權威、穩定、領導力、父親形象。需要建立結構和紀律來達成目標。', reverse: '固執、暴政、缺乏彈性。過於嚴格或固執，不願接受新觀點。' },
  5: { name: '教皇', nameEn: 'The Hierophant', icon: '📜', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/RWS_Tarot_05_Hierophant.jpg/300px-RWS_Tarot_05_Hierophant.jpg', meaning: '傳統、指導、信念、教育。尋求傳統智慧或專家指導的時候到了。', reverse: '反叛、抗拒傳統、特立獨行。质疑传统价值觀，寻找自己的道路。' },
  6: { name: '戀人', nameEn: 'The Lovers', icon: '💕', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/RWS_Tarot_06_Lovers.jpg/300px-RWS_Tarot_06_Lovers.jpg', meaning: '愛情、和諧、選擇、價值觀。面臨重要選擇，需要根據你的核心價值觀來決定。', reverse: '失衡、溝通不良、價值觀衝突。關係中的不平衡或溝通問題。' },
  7: { name: '戰車', nameEn: 'The Chariot', icon: '🏃', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/RWS_Tarot_07_Chariot.jpg/300px-RWS_Tarot_07_Chariot.jpg', meaning: '勝利、意志力、克服障礙。通過堅定意志和決心，你將戰勝挑戰並取得勝利。', reverse: '攻擊性、缺乏方向、挫折。過於激進或失去方向感。' },
  8: { name: '力量', nameEn: 'Strength', icon: '💪', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/RWS_Tarot_08_Strength.jpg/300px-RWS_Tarot_08_Strength.jpg', meaning: '勇氣、耐心、內在力量、温順。真正的力量來自內心的平靜和自信。', reverse: '軟弱、屈服、缺乏耐心。失去內心的平衡，過度放任。' },
  9: { name: '隱士', nameEn: 'The Hermit', icon: '🕯️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/RWS_Tarot_09_Hermit.jpg/300px-RWS_Tarot_09_Hermit.jpg', meaning: '內省、智慧、孤獨、尋求真理。是時候退一步，傾聽內在智慧的聲音了。', reverse: '孤立、過度內向、逃避。過度孤立於他人或現實。' },
  10: { name: '命運輪', nameEn: 'Wheel of Fortune', icon: '🎡', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/RWS_Tarot_10_Wheel.jpg/300px-RWS_Tarot_10_Wheel.jpg', meaning: '命運、轉變、幸運、週期。命運的轉機即將到來，準備好接受新的機會。', reverse: '厄運、停滯、抗拒改變。抗拒改變或感覺運氣不佳。' },
  11: { name: '正義', nameEn: 'Justice', icon: '⚖️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/RWS_Tarot_11_Justice.jpg/300px-RWS_Tarot_11_Justice.jpg', meaning: '公平、真相、因果、法律。你的行動會有相應的後果，保持誠實和公正。', reverse: '不公平、欺騙、逃避責任。不公正的決定或逃避責任。' },
  12: { name: '吊人', nameEn: 'The Hanged Man', icon: '🔄', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/RWS_Tarot_12_Hanged_Man.jpg/300px-RWS_Tarot_12_Hanged_Man.jpg', meaning: '犧牲、暫停、新的觀點、順從。有時需要暫停並從不同角度看問題。', reverse: '停滯、犧牲無回報、抗拒改變。過度犧牲卻沒有回報。' },
  13: { name: '死神', nameEn: 'Death', icon: '💀', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/RWS_Tarot_13_Death.jpg/300px-RWS_Tarot_13_Death.jpg', meaning: '轉變、結束、新生、蛻變。舊的即將結束，新的將要開始。接受轉變才能成長。', reverse: '恐懼改變、停滯抗拒重生。抗拒必要的轉變和結束。' },
  14: { name: '節制', nameEn: 'Temperance', icon: '🌊', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/RWS_Tarot_14_Temperance.jpg/300px-RWS_Tarot_14_Temperance.jpg', meaning: '平衡、節制、耐心、和諧。在生活各方面尋找平衡和諧。', reverse: '失衡、過度、缺乏耐心。過度縱慾或缺乏節制。' },
  15: { name: '惡魔', nameEn: 'The Devil', icon: '😈', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/RWS_Tarot_15_Devil.jpg/300px-RWS_Tarot_15_Devil.jpg', meaning: '誘惑、束縛、慾望、物質主義。注意那些綑綁你的事物，學會釋放。', reverse: '解脫、覺醒、擺脫束縛。擺脫物質束縛，獲得精神自由。' },
  16: { name: '塔', nameEn: 'The Tower', icon: '🗼', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/RWS_Tarot_16_Tower.jpg/300px-RWS_Tarot_16_Tower.jpg', meaning: '突變、毀滅、覺醒、啟示。表面的東西崩潰是為了讓更好的東西重生。', reverse: '恐懼改變、避免災難、固執。試圖避免必要的破壞和轉變。' },
  17: { name: '星星', nameEn: 'The Star', icon: '⭐', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/RWS_Tarot_17_Star.jpg/300px-RWS_Tarot_17_Star.jpg', meaning: '希望、靈感、療癒、樂觀。經歷困難後，希望和康復的時刻即將到來。', reverse: '絕望、失去信心、幻滅。失去希望或過度悲觀。' },
  18: { name: '月亮', nameEn: 'The Moon', icon: '🌙', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/RWS_Tarot_18_Moon.jpg/300px-RWS_Tarot_18_Moon.jpg', meaning: '直覺、潛意識、幻覺、恐懼。倾听你的直覺，但要注意恐懼和幻覺。', reverse: '覺醒、擺脫恐懼、面對真相。克服恐懼，發現真相。' },
  19: { name: '太陽', nameEn: 'The Sun', icon: '☀️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/RWS_Tarot_19_Sun.jpg/300px-RWS_Tarot_19_Sun.jpg', meaning: '成功、活力、喜悦、生命力。充滿活力和成功的時期，享受生命的喜悦。', reverse: '暫時的陰霾、憂鬱、缺乏活力。暫時的困難，但會很快過去。' },
  20: { name: '審判', nameEn: 'Judgement', icon: '🔔', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/RWS_Tarot_20_Judgement.jpg/300px-RWS_Tarot_20_Judgement.jpg', meaning: '覺醒、復原、重生、寬恕。是時候內省並準備新開始了。', reverse: '自我懷疑、拒絕覺醒、批判。過度自我批判或拒絕新的開始。' },
  21: { name: '世界', nameEn: 'The World', icon: '🌍', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/RWS_Tarot_21_World.jpg/300px-RWS_Tarot_21_World.jpg', meaning: '完成、成就、圓滿、統合。一個階段的圓滿結束，準備邁向新的旅程。', reverse: '未完成、延遲、缺乏閉環。感覺某事未完成或延遲。' },
  
  // Minor Arcana - 精選牌 (使用主要Ace)
  22: { name: '權杖Ace', nameEn: 'Ace of Wands', icon: '🔥', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/RWS_Tarot_01_Wands.jpg/300px-RWS_Tarot_01_Wands.jpg', meaning: '創意、靈感、新開始、熱情。新的創意機會或靈感即將來臨。', reverse: '延遲、缺乏熱情、創意受阻。創意能量被阻塞。' },
  23: { name: '權杖二', nameEn: 'Two of Wands', icon: '🔥', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/RWS_Tarot_02_Wands.jpg/300px-RWS_Tarot_02_Wands.jpg', meaning: '規劃、未來、決策、領導。規劃未來，做出重要決定。', reverse: '恐懼未知、規劃過多、拖延。過度擔憂未來。' },
  24: { name: '權杖三', nameEn: 'Three of Wands', icon: '🔥', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/RWS_Tarot_03_Wands.jpg/300px-RWS_Tarot_03_Wands.jpg', meaning: '展望、預見、耐心、收獲。展望未來，耐心等待收獲。', reverse: '阻礙、挫折、等待太久。外部障礙阻擋進展。' },
  25: { name: '權杖四', nameEn: 'Four of Wands', icon: '🔥', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/RWS_Tarot_04_Wands.jpg/300px-RWS_Tarot_04_Wands.jpg', meaning: '慶祝、團聚、和諧、休息。慶祝成功，享受和諧時光。', reverse: '不穩定、短暫慶祝、過渡。過渡期間的不穩定。' },
  
  32: { name: '聖杯Ace', nameEn: 'Ace of Cups', icon: '💗', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/RWS_Tarot_01_Cups.jpg/300px-RWS_Tarot_01_Cups.jpg', meaning: '愛、感情、喜悅、創造力。新的愛情、友誼或情感機會。', reverse: '空虛、情感的封閉、缺乏愛。情感空虛或封閉自己。' },
  33: { name: '聖杯二', nameEn: 'Two of Cups', icon: '💗', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/RWS_Tarot_02_Cups.jpg/300px-RWS_Tarot_02_Cups.jpg', meaning: ' partnership、 love、 harmony。新關係的開始或現有關係的和諧。', reverse: '不平衡、距離、破裂。關係中的不平衡或分離。' },
  34: { name: '聖杯三', nameEn: 'Three of Cups', icon: '💗', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/RWS_Tarot_03_Cups.jpg/300px-RWS_Tarot_03_Cups.jpg', meaning: '慶祝、友誼、團體、歡樂。與朋友和親人慶祝的時刻。', reverse: '過度放縱、孤獨、退出。過度沉溺於玩樂。' },
  35: { name: '聖杯四', nameEn: 'Four of Cups', icon: '💗', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/RWS_Tarot_04_Cups.jpg/300px-RWS_Tarot_04_Cups.jpg', meaning: '冷漠、厭倦、反思、機會。對現狀感到厭倦，但新機會即將到來。', reverse: '覺醒、接受、行動離開。接受新機會並離開舒適區。' },
  
  42: { name: '寶劍Ace', nameEn: 'Ace of Swords', icon: '⚔️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/RWS_Tarot_01_Swords.jpg/300px-RWS_Tarot_01_Swords.jpg', meaning: '真相、清晰、突破、智力。清晰的思維和新的理解。', reverse: '混乱、模糊、過度思考。思維混乱或過度分析。' },
  43: { name: '寶劍二', nameEn: 'Two of Swords', icon: '⚔️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/RWS_Tarot_02_Swords.jpg/300px-RWS_Tarot_02_Swords.jpg', meaning: '困難的選擇、僵局、逃避。面臨困難選擇，需要更多信息。', reverse: '資訊過多、優柔寡斷、決定。獲得足夠信息後做出決定。' },
  44: { name: '寶劍三', nameEn: 'Three of Swords', icon: '⚔️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/RWS_Tarot_03_Swords.jpg/300px-RWS_Tarot_03_Swords.jpg', meaning: '心碎、悲傷、背叛、淚水。情感上的痛苦和失落。', reverse: '康復、療癒、放下。開始療癒和放下過去。' },
  45: { name: '寶劍四', nameEn: 'Four of Swords', icon: '⚔️', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/RWS_Tarot_04_Swords.jpg/300px-RWS_Tarot_04_Swords.jpg', meaning: '休息、恢復、靜止、恢復体力。是時候休息和恢復了。', reverse: '失眠、焦慮、無法休息。過度焦慮或壓力過大。' },
  
  52: { name: '錢幣Ace', nameEn: 'Ace of Pentacles', icon: '💰', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/RWS_Tarot_01_Pentacles.jpg/300px-RWS_Tarot_01_Pentacles.jpg', meaning: '新機會、繁榮、實際、礼物。新的物質或職業機會。', reverse: '機會流失、財務問題、過度擴張。財務上的問題或過度擴張。' },
  53: { name: '錢幣二', nameEn: 'Two of Pentacles', icon: '💰', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/RWS_Tarot_02_Pentacles.jpg/300px-RWS_Tarot_02_Pentacles.jpg', meaning: '平衡、優先順序適应、優先順序。在多個責任中保持平衡。', reverse: '失衡、壓力過大、優先順序混亂。過度擴張導致失衡。' },
  54: { name: '錢幣三', nameEn: 'Three of Pentacles', icon: '💰', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/RWS_Tarot_03_Pentacles.jpg/300px-RWS_Tarot_03_Pentacles.jpg', meaning: '團隊合作、技能、匠心、認可。通過團隊合作獲得成功。', reverse: '缺乏團隊、技不如人、工作質量差。缺乏團隊支持或技能不足。' },
  55: { name: '錢幣四', nameEn: 'Four of Pentacles', icon: '💰', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/RWS_Tarot_04_Pentacles.jpg/300px-RWS_Tarot_04_Pentacles.jpg', meaning: '安全感、控制、節儉、擁有。對財務和物質的安全感。', reverse: '慷慨、財務不穩定、恐懼失去。學會放手和分享。' },
};

// ===========================
// 牌陣位置解釋
// ===========================
const POSITIONS = {
  past: { 
    name: '過去', 
    nameEn: 'Past', 
    desc: '過去的經歷和影響' 
  },
  present: { 
    name: '現在', 
    nameEn: 'Present', 
    desc: '當前的情況和挑戰' 
  },
  future: { 
    name: '未來', 
    nameEn: 'Future', 
    desc: '未來的可能性和建議' 
  }
};

// ===========================
// 抽牌邏輯
// ===========================
const drawCards = (count = 3) => {
  const indices = Object.keys(TAROT_DECK).map(Number);
  const shuffled = [...indices].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((idx, i) => ({
    ...TAROT_DECK[idx],
    id: idx,
    position: Object.keys(POSITIONS)[i]
  }));
};

// ===========================
// 生成解讀
// ===========================
const generateReading = (cards: any[], question: string, language: string = 'zh-TW') => {
  const positionNames = {
    past: language === 'zh-TW' ? '過去' : 'Past',
    present: language === 'zh-TW' ? '現在' : 'Present', 
    future: language === 'zh-TW' ? '未來' : 'Future'
  };
  
  const readings = cards.map((card, i) => {
    const position = Object.keys(POSITIONS)[i];
    const posName = positionNames[position as keyof typeof positionNames];
    
    let angle = '';
    if (position === 'past') {
      angle = language === 'zh-TW' 
        ? '這張牌反映了你過去的經歷對現在的影響。你曾經做過的選擇和經歷塑造了今天的你。'
        : 'This card reflects how your past experiences are affecting your present.';
    } else if (position === 'present') {
      angle = language === 'zh-TW'
        ? '這是你目前正在面對的課題。這個挑戰是成長的機會，需要你積極面對。'
        : 'This is the challenge you are currently facing.';
    } else {
      angle = language === 'zh-TW'
        ? '這是未來的可能性。建議你保持開放的心態，準備好接受新的機會。'
        : 'This is a possibility for your future.';
    }
    
    return {
      card,
      position: position,
      positionName: posName,
      angle,
      meaning: card.meaning
    };
  });
  
  const summary = language === 'zh-TW'
    ? `根據你的問題「${question}」，這個牌陣顯示了從過去到未來的發展趨勢。建議你珍惜當下的機會，同時保持開放的心態迎接未來。`
    : `Based on your question "${question}", this spread shows the development from past to future.`;
  
  return {
    cards: readings,
    summary,
    question
  };
};

export { TAROT_DECK, POSITIONS, drawCards, generateReading };
export default { TAROT_DECK, POSITIONS, drawCards, generateReading };
