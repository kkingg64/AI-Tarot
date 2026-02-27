/**
 * AI Tarot - Local Tarot Reading API
 * 使用本地牌義數據庫，無需外部AI
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ===========================
// 78張塔羅牌數據庫
// ===========================
const TAROT_DECK = {
  // Major Arcana (0-21)
  0: { name: '愚者', nameEn: 'The Fool', icon: '🃏', meaning: '新開始、自由、冒險、信任宇宙', reverse: '魯莽、輕率、缺乏責任感' },
  1: { name: '魔術師', nameEn: 'The Magician', icon: '🎩', meaning: '意志力、創造力、技巧、資源運用', reverse: '欺騙、操縱、技巧不足' },
  2: { name: '女祭司', nameEn: 'The High Priestess', icon: '🌙', meaning: '直覺、智慧、神秘、潛意識', reverse: '表面化、缺乏深度、封閉' },
  3: { name: '皇后', nameEn: 'The Empress', icon: '👑', meaning: '豐盛、母性、創造力、自然', reverse: '依賴、濫用、缺乏創造力' },
  4: { name: '皇帝', nameEn: 'The Emperor', icon: '⚔️', meaning: '權威、穩定、領導力、父親形象', reverse: '固執、暴政、缺乏彈性' },
  5: { name: '教皇', nameEn: 'The Hierophant', icon: '📜', meaning: '傳統、指導、信念、教育', reverse: '反叛、抗拒傳統、特立獨行' },
  6: { name: '戀人', nameEn: 'The Lovers', icon: '💕', meaning: '愛情、和諧、選擇、價值觀', reverse: '失衡、溝通不良、價值觀衝突' },
  7: { name: '戰車', nameEn: 'The Chariot', icon: '🏃', meaning: '勝利、意志力、克服障礙', reverse: '攻擊性、缺乏方向、挫折' },
  8: { name: '力量', nameEn: 'Strength', icon: '💪', meaning: '勇氣、耐心、內在力量、温順', reverse: '軟弱、屈服、缺乏耐心' },
  9: { name: '隱士', nameEn: 'The Hermit', icon: '🕯️', meaning: '內省、智慧、孤獨、尋求真理', reverse: '孤立、過度內向、逃避' },
  10: { name: '命運輪', nameEn: 'Wheel of Fortune', icon: '🎡', meaning: '命運、轉變、幸運、週期', reverse: '厄運、停滯、抗拒改變' },
  11: { name: '正義', nameEn: 'Justice', icon: '⚖️', meaning: '公平、真相、因果、法律', reverse: '不公平、欺騙、逃避責任' },
  12: { name: '吊人', nameEn: 'The Hanged Man', icon: '🔄', meaning: '犧牲、暫停、新的觀點、順從', reverse: '停滯、犧牲無回報、抗拒改變' },
  13: { name: '死神', nameEn: 'Death', icon: '💀', meaning: '轉變、結束、新生、蛻變', reverse: '恐懼改變、停滯抗拒重生' },
  14: { name: '節制', nameEn: 'Temperance', icon: '🌊', meaning: '平衡、節制、耐心、和諧', reverse: '失衡、過度、缺乏耐心' },
  15: { name: '惡魔', nameEn: 'The Devil', icon: '😈', meaning: '誘惑、束縛、慾望、物質主義', reverse: '解脫、覺醒、擺脫束縛' },
  16: { name: '塔', nameEn: 'The Tower', icon: '🗼', meaning: '突變、毀滅、覺醒、啟示', reverse: '恐懼改變、避免災難、固執' },
  17: { name: '星星', nameEn: 'The Star', icon: '⭐', meaning: '希望、靈感、療癒、樂觀', reverse: '絕望、失去信心、幻滅' },
  18: { name: '月亮', nameEn: 'The Moon', icon: '🌙', meaning: '直覺、潛意識、幻覺、恐懼', reverse: '覺醒、擺脫恐懼、面對真相' },
  19: { name: '太陽', nameEn: 'The Sun', icon: '☀️', meaning: '成功、活力、喜悦、生命力', reverse: '暫時的陰霾、憂鬱、缺乏活力' },
  20: { name: '審判', nameEn: 'Judgement', icon: '🔔', meaning: '覺醒、復原、重生、寬恕', reverse: '自我懷疑、拒絕覺醒、批判' },
  21: { name: '世界', nameEn: 'The World', icon: '🌍', meaning: '完成、成就、圓滿、統合', reverse: '未完成、延遲、缺乏閉環' },
  
  // Minor Arcana - Wands (Rods)
  22: { name: '權杖Ace', nameEn: 'Ace of Wands', icon: '🔥', meaning: '創意、靈感、新開始、熱情', reverse: '延遲、缺乏熱情、創意受阻' },
  23: { name: '權杖二', nameEn: 'Two of Wands', icon: '🔥', meaning: '規劃、未來、決策、領導', reverse: '恐懼未知、規劃過多、拖延' },
  24: { name: '權杖三', nameEn: 'Three of Wands', icon: '🔥', meaning: '展望、預見、耐心、收獲', reverse: '阻礙、挫折、等待太久' },
  25: { name: '權杖四', nameEn: 'Four of Wands', icon: '🔥', meaning: '慶祝、團聚、和諧、休息', reverse: '不穩定、短暫慶祝、過渡' },
  26: { name: '權杖五', nameEn: 'Five of Wands', icon: '🔥', meaning: '衝突、競爭、挑戰、活力', reverse: '避免衝突、競爭過度、內鬥' },
  27: { name: '權杖六', nameEn: 'Six of Wands', icon: '🔥', meaning: '勝利、認可、聲望、團隊', reverse: '失敗、缺乏認可、驕傲' },
  28: { name: '權杖七', nameEn: 'Seven of Wands', icon: '🔥', meaning: '防守、挑戰、堅持、勇氣', reverse: '疲憊、放棄、士氣低落' },
  29: { name: '權杖八', nameEn: 'Eight of Wands', icon: '🔥', meaning: '快速行動、訊息、傳播、進展', reverse: '延遲、等待、阻礙' },
  30: { name: '權杖九', nameEn: 'Nine of Wands', icon: '🔥', meaning: '韌性、經驗、防守、等待', reverse: '偏執、準備過度、懷疑' },
  31: { name: '權杖十', nameEn: 'Ten of Wands', icon: '🔥', meaning: '重擔、責任、壓力、完成', reverse: '無法承擔、崩潰、委派' },
  
  // Cups
  32: { name: '聖杯Ace', nameEn: 'Ace of Cups', icon: '💗', meaning: '愛、感情、喜悅、創造力', reverse: '空虛、情感的封閉、缺乏愛' },
  33: { name: '聖杯二', nameEn: 'Two of Cups', icon: '💗', meaning: ' partnership、 love、 harmony', reverse: '不平衡、距離、破裂' },
  34: { name: '聖杯三', nameEn: 'Three of Cups', icon: '💗', meaning: '慶祝、友誼、團體、歡樂', reverse: '過度放縱、孤獨、退出' },
  35: { name: '聖杯四', nameEn: 'Four of Cups', icon: '💗', meaning: '冷漠、厭倦、反思、機會', reverse: '覺醒、接受、行動離開' },
  36: { name: '聖杯五', nameEn: 'Five of Cups', icon: '💗', meaning: '損失、悲傷、失望、接受', reverse: '康復、向前看、寬恕' },
  37: { name: '聖杯六', nameEn: 'Six of Cups', icon: '💗', meaning: '懷舊、回憶、純真、給予', reverse: '過去的陰影、幻想破滅' },
  38: { name: '聖杯七', nameEn: 'Seven of Cups', icon: '💗', meaning: '幻想、選擇、夢想、誘惑', reverse: '清晰、選擇、覺醒' },
  39: { name: '聖杯八', nameEn: 'Eight of Cups', icon: '💗', meaning: '離開、尋求、悲傷、追求', reverse: '停留、拒絕離開、恐懼未知' },
  40: { name: '聖杯九', nameEn: 'Nine of Cups', icon: '💗', meaning: '滿足、願望成真、慶祝', reverse: '不滿足、貪心、幻想破滅' },
  41: { name: '聖杯十', nameEn: 'Ten of Cups', icon: '💗', meaning: '和諧、家庭、幸福、圓滿', reverse: '家庭不和、破裂、疏遠' },
  
  // Swords
  42: { name: '寶劍Ace', nameEn: 'Ace of Swords', icon: '⚔️', meaning: '真相、清晰、突破、智力', reverse: '混乱、模糊、過度思考' },
  43: { name: '寶劍二', nameEn: 'Two of Swords', icon: '⚔️', meaning: '困難的選擇、僵局、逃避', reverse: '資訊過多、優柔寡斷、決定' },
  44: { name: '寶劍三', nameEn: 'Three of Swords', icon: '⚔️', meaning: '心碎、悲傷、背叛、淚水', reverse: '康復、療癒、放下' },
  45: { name: '寶劍四', nameEn: 'Four of Swords', icon: '⚔️', meaning: '休息、恢復、靜止、恢復体力', reverse: '失眠、焦慮、無法休息' },
  46: { name: '寶劍五', nameEn: 'Five of Swords', icon: '⚔️', meaning: '衝突、勝利代價、溝通不良', reverse: '寬恕、和解、放下' },
  47: { name: '寶劍六', nameEn: 'Six of Swords', icon: '⚔️', meaning: '過渡、療癒、離開困境', reverse: '停滯、拒絕前進、回去' },
  48: { name: '寶劍七', nameEn: 'Seven of Swords', icon: '⚔️', meaning: '策略、欺騙、生存、逃跑', reverse: '坦誠、暴露、承認' },
  49: { name: '寶劍八', nameEn: 'Eight of Swords', icon: '⚔️', meaning: '限制、困境、受害者心態', reverse: '自由、突破、新的視角' },
  50: { name: '寶劍九', nameEn: 'Nine of Swords', icon: '⚔️', meaning: '焦慮、恐懼、內疚、困擾', reverse: '希望、走出恐懼、康復' },
  51: { name: '寶劍十', nameEn: 'Ten of Swords', icon: '⚔️', meaning: '背叛、痛苦、結束、低谷', reverse: '康復、復原、新的開始' },
  
  // Pentacles (Coins)
  52: { name: '錢幣Ace', nameEn: 'Ace of Pentacles', icon: '💰', meaning: '新機會、繁榮、實際、礼物', reverse: '機會流失、財務問題、過度擴張' },
  53: { name: '錢幣二', nameEn: 'Two of Pentacles', icon: '💰', meaning: '平衡、優先順序適应、優先順序', reverse: '失衡、壓力過大、優先順序混亂' },
  54: { name: '錢幣三', nameEn: 'Three of Pentacles', icon: '💰', meaning: '團隊合作、技能、匠心、認可', reverse: '缺乏團隊、技不如人、工作質量差' },
  55: { name: '錢幣四', nameEn: 'Four of Pentacles', icon: '💰', meaning: '安全感、控制、節儉、擁有', reverse: '慷慨、財務不穩定、恐懼失去' },
  56: { name: '錢幣五', nameEn: 'Five of Pentacles', icon: '💰', meaning: '困難、孤獨、掙扎、援助', reverse: '康復、康復、援助到來' },
  57: { name: '錢幣六', nameEn: 'Six of Pentacles', icon: '💰', meaning: '慷慨、分享、慈善、平衡', reverse: '自私、不公平、債務' },
  58: { name: '錢幣七', nameEn: 'Seven of Pentacles', icon: '💰', meaning: '耐心、規劃、长期投资、回報', reverse: '缺乏耐心、過度擴張、看不到回報' },
  59: { name: '錢幣八', nameEn: 'Eight of Pentacles', icon: '💰', meaning: '匠心、技巧、學習、專注', reverse: '缺乏匠心、懶惰、質量差' },
  60: { name: '錢幣九', nameEn: 'Nine of Pentacles', icon: '💰', meaning: '獨立、成就、財富、自足', reverse: '依賴、財務損失、不安全感' },
  61: { name: '錢幣十', nameEn: 'Ten of Pentacles', icon: '💰', meaning: '富足、傳承、家庭、成功', reverse: '財務損失、家庭問題、缺乏基礎' },
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
const generateReading = (cards, question, language = 'zh-TW') => {
  const positionNames = {
    past: language === 'zh-TW' ? '過去' : 'Past',
    present: language === 'zh-TW' ? '現在' : 'Present', 
    future: language === 'zh-TW' ? '未來' : 'Future'
  };
  
  const readings = cards.map((card, i) => {
    const position = Object.keys(POSITIONS)[i];
    const posName = positionNames[position];
    
    // 根據位置生成不同解讀角度
    let angle = '';
    if (position === 'past') {
      angle = language === 'zh-TW' 
        ? '這張牌反映了你過去的經歷對現在的影響。'
        : 'This card reflects how your past experiences are affecting your present.';
    } else if (position === 'present') {
      angle = language === 'zh-TW'
        ? '這是你目前正在面對的課題。'
        : 'This is the challenge you are currently facing.';
    } else {
      angle = language === 'zh-TW'
        ? '這是未來的可能性，建議你...'
        : 'This is a possibility for your future; it is advised that you...';
    }
    
    return {
      card,
      position: position,
      positionName: posName,
      angle,
      meaning: card.meaning
    };
  });
  
  // 綜合建議
  const summary = language === 'zh-TW'
    ? `根據你的問題「${question}」，這個牌陣顯示了從過去到未來的發展趨勢。建議你珍惜當下的機會，同時為未來做好準備。`
    : `Based on your question "${question}", this spread shows the development from past to future. It is advised that you cherish the present opportunities while preparing for the future.`;
  
  return {
    cards: readings,
    summary,
    question
  };
};

// ===========================
// API 端點 (模擬)
// ===========================
// 在實際應用中，這會是一個真正的 API
// 例如: POST /api/tarot/read

export { TAROT_DECK, POSITIONS, drawCards, generateReading };
export default { TAROT_DECK, POSITIONS, drawCards, generateReading };
