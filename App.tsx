
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';
import { Starfield } from './components/Starfield';
import { TarotCard, CardData } from './components/TarotCard';
import { getTarotReading } from './services/gemini';
import { SparklesIcon, ArrowPathIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { MotionDetector } from './components/MotionDetector';

// --- DECK GENERATION (ABSTRACT ART) ---

const SUITS = [
  { name: 'Wands', id: 'wands', color: 'from-orange-900/60 via-red-900/60 to-zinc-900', zh: '權杖', iconType: 'fire' },
  { name: 'Cups', id: 'cups', color: 'from-blue-900/60 via-cyan-900/60 to-zinc-900', zh: '聖杯', iconType: 'water' },
  { name: 'Swords', id: 'swords', color: 'from-slate-700/60 via-zinc-800/60 to-zinc-900', zh: '寶劍', iconType: 'air' },
  { name: 'Pentacles', id: 'pentacles', color: 'from-yellow-900/60 via-amber-900/60 to-zinc-900', zh: '錢幣', iconType: 'earth' }
];

const RANKS = [
  { name: 'Ace', val: '1', zh: '王牌' },
  { name: 'Two', val: '2', zh: '二' },
  { name: 'Three', val: '3', zh: '三' },
  { name: 'Four', val: '4', zh: '四' },
  { name: 'Five', val: '5', zh: '五' },
  { name: 'Six', val: '6', zh: '六' },
  { name: 'Seven', val: '7', zh: '七' },
  { name: 'Eight', val: '8', zh: '八' },
  { name: 'Nine', val: '9', zh: '九' },
  { name: 'Ten', val: '10', zh: '十' },
  { name: 'Page', val: 'P', zh: '侍衛' },
  { name: 'Knight', val: 'Kn', zh: '騎士' },
  { name: 'Queen', val: 'Q', zh: '皇后' },
  { name: 'King', val: 'K', zh: '國王' }
];

const MAJOR_ARCANA = [
  { name: "The Fool", id: "0", zh: "愚者", iconType: "fool" },
  { name: "The Magician", id: "I", zh: "魔術師", iconType: "magic" },
  { name: "The High Priestess", id: "II", zh: "女祭司", iconType: "moon" },
  { name: "The Empress", id: "III", zh: "皇后", iconType: "nature" },
  { name: "The Emperor", id: "IV", zh: "皇帝", iconType: "crown" },
  { name: "The Hierophant", id: "V", zh: "教皇", iconType: "faith" },
  { name: "The Lovers", id: "VI", zh: "戀人", iconType: "heart" },
  { name: "The Chariot", id: "VII", zh: "戰車", iconType: "star" },
  { name: "Strength", id: "VIII", zh: "力量", iconType: "sun" },
  { name: "The Hermit", id: "IX", zh: "隱士", iconType: "lamp" },
  { name: "Wheel of Fortune", id: "X", zh: "命運之輪", iconType: "wheel" },
  { name: "Justice", id: "XI", zh: "正義", iconType: "balance" },
  { name: "The Hanged Man", id: "XII", zh: "倒吊人", iconType: "hang" },
  { name: "Death", id: "XIII", zh: "死神", iconType: "skull" },
  { name: "Temperance", id: "XIV", zh: "節制", iconType: "cup" },
  { name: "The Devil", id: "XV", zh: "惡魔", iconType: "chain" },
  { name: "The Tower", id: "XVI", zh: "高塔", iconType: "fire" },
  { name: "The Star", id: "XVII", zh: "星星", iconType: "star" },
  { name: "The Moon", id: "XVIII", zh: "月亮", iconType: "moon" },
  { name: "The Sun", id: "XIX", zh: "太陽", iconType: "sun" },
  { name: "Judgement", id: "XX", zh: "審判", iconType: "trumpet" },
  { name: "The World", id: "XXI", zh: "世界", iconType: "world" },
];

function generateDeck(): CardData[] {
  const deck: CardData[] = [];

  // 1. Major Arcana
  MAJOR_ARCANA.forEach(card => {
    deck.push({
      name: card.name,
      id: card.id,
      colors: 'from-purple-900/60 via-fuchsia-900/60 to-zinc-900',
      type: 'major',
      iconType: card.iconType,
      zhName: card.zh
    });
  });

  // 2. Minor Arcana
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        name: `${rank.name} of ${suit.name}`,
        id: rank.val, // Rank displayed on card
        colors: suit.color,
        type: 'minor',
        suit: suit.name,
        iconType: suit.iconType,
        zhName: `${suit.zh}${rank.zh}`
      });
    });
  });

  return deck;
}

const FULL_DECK = generateDeck();

const LANGUAGES = [
  { code: 'zh-TW', label: '繁體中文' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
];

const UI_TEXT: Record<string, any> = {
  'zh-TW': {
    title: '雙子星神諭',
    subtitle: '星際 • 命運 • 啟示',
    placeholder: '向宇宙提問...',
    channeling: '正在感應你的能量...',
    hold: '對著鏡頭揮手或按住按鈕',
    consultAgain: '再次諮詢',
    loading: '正在解讀星象...',
    language: '語言',
    upright: '正位',
    reversed: '逆位',
  },
  'en': {
    title: 'Oracle of Groq',
    subtitle: 'Cosmic • Destiny • Insight',
    placeholder: 'Ask the universe a question...',
    channeling: 'Sensing your energy...',
    hold: 'Wave at camera or Hold button',
    consultAgain: 'Consult Again',
    loading: 'Reading the stars...',
    language: 'Language',
    upright: 'Upright',
    reversed: 'Reversed',
  },
  'ja': {
    title: '星の神託',
    subtitle: '宇宙 • 運命 • 洞察',
    placeholder: '宇宙に問いかける...',
    channeling: 'エネルギーを感知中...',
    hold: 'カメラに手を振るか、長押し',
    consultAgain: 'もう一度占う',
    loading: '星を読んでいます...',
    language: '言語',
    upright: '正位置',
    reversed: '逆位置',
  }
};

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'channeling' | 'drawing' | 'revealed'>('intro');
  const [question, setQuestion] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [reading, setReading] = useState('');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [channelingProgress, setChannelingProgress] = useState(0);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = UI_TEXT[language] || UI_TEXT['en'];
  const channelInterval = useRef<number | null>(null);

  // --- INTERACTION HANDLERS ---

  const startChanneling = () => {
    if (step !== 'intro') return;
    setStep('channeling');
    
    let progress = 0;
    channelInterval.current = window.setInterval(() => {
        progress += 2.5; // Channeling speed
        setChannelingProgress(progress);
        if (progress >= 100) {
            completeChanneling();
        }
    }, 20);
  };

  const stopChanneling = () => {
    if (step === 'channeling' && channelingProgress < 100) {
       if (channelInterval.current) clearInterval(channelInterval.current);
       setStep('intro');
       setChannelingProgress(0);
    }
  };

  const completeChanneling = () => {
      if (channelInterval.current) clearInterval(channelInterval.current);
      setStep('drawing');
      
      const randomCard = FULL_DECK[Math.floor(Math.random() * FULL_DECK.length)];
      const reversed = Math.random() < 0.2; // 20% chance of reversal
      
      setSelectedCard(randomCard);
      setIsReversed(reversed);
      setIsReadingLoading(true);
      
      const cardName = randomCard.name + (reversed ? " (Reversed)" : " (Upright)");

      getTarotReading(cardName, question, language).then(text => {
          setReading(text);
          setIsReadingLoading(false);
      });

      // Cinematic delay before showing the revealed card
      setTimeout(() => {
          setStep('revealed');
      }, 1500);
  };

  const reset = () => {
      setStep('intro');
      setQuestion('');
      setSelectedCard(null);
      setReading('');
      setIsReversed(false);
      setChannelingProgress(0);
  };

  const getCardDisplayName = (card: CardData | null) => {
    if (!card) return '';
    if (language === 'zh-TW' && card.zhName) {
      return card.zhName;
    }
    return card.name;
  };

  // Callback from Camera Motion
  const handleMotionDetected = () => {
      if (step === 'intro') {
          startChanneling();
      }
  };
  
  const handleMotionStop = () => {
      if (step === 'channeling') {
          stopChanneling();
      }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 select-none overflow-hidden" onMouseUp={stopChanneling} onTouchEnd={stopChanneling}>
      <Starfield />

      {/* CAMERA LAYER - Invisible but active */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-0">
          <MotionDetector 
            onMotionStart={handleMotionDetected} 
            onMotionEnd={handleMotionStop} 
            isScanning={step === 'intro' || step === 'channeling'} 
          />
      </div>

      {/* LANGUAGE SELECTOR */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-1 text-zinc-400 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
          >
            <GlobeAltIcon className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider font-medium">{LANGUAGES.find(l => l.code === language)?.label}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden flex flex-col">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                  className={`px-4 py-2 text-left text-xs hover:bg-white/10 transition-colors ${language === lang.code ? 'text-yellow-400' : 'text-zinc-400'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEADER */}
      <div className={`absolute top-12 left-0 right-0 text-center transition-all duration-1000 ${step === 'revealed' ? 'opacity-50 scale-75' : 'opacity-100'}`}>
          <h1 className="text-3xl md:text-5xl font-mystic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              {t.title}
          </h1>
          <p className="text-zinc-500 font-serif italic mt-2 text-sm tracking-widest uppercase">
              {t.subtitle}
          </p>
      </div>

      {/* MAIN STAGE */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl min-h-[500px]">
          
          {/* Card Component */}
          <div className={`transition-all duration-1000 mb-8 ${step === 'revealed' ? 'scale-100' : step === 'drawing' ? 'scale-90 animate-pulse' : 'scale-0 opacity-0 absolute'}`}>
             <TarotCard 
               card={selectedCard} 
               isRevealed={step === 'revealed'} 
               isDrawing={step === 'drawing' || step === 'revealed'} 
               isReversed={isReversed}
             />
             
             {step === 'revealed' && (
                <div className="text-center mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <p className="text-amber-300 font-mystic text-xl">
                        {getCardDisplayName(selectedCard)}
                    </p>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mt-1">
                        {isReversed ? t.reversed : t.upright}
                    </p>
                </div>
             )}
          </div>

          {/* INTRO: Question & Channeling */}
          {step === 'intro' || step === 'channeling' ? (
              <div className={`flex flex-col items-center space-y-8 w-full max-w-md transition-all duration-500 ${step === 'intro' || step === 'channeling' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                  
                  {/* Question Input */}
                  <div className="w-full relative group z-20">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t.placeholder}
                        className="relative w-full bg-black/50 border border-white/10 rounded-lg px-6 py-4 text-center text-lg placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-indigo-100 font-serif"
                      />
                  </div>

                  {/* Channel Button */}
                  <div className="relative">
                       {/* Circular Progress */}
                       <div className="absolute inset-[-4px] rounded-full border border-white/10"></div>
                       <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="48%"
                            fill="transparent"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeDasharray="300" 
                            strokeDashoffset={300 - (channelingProgress / 100) * 300}
                            className="transition-all duration-75 ease-linear"
                          />
                       </svg>

                       <button
                         onMouseDown={startChanneling}
                         onMouseLeave={stopChanneling}
                         onTouchStart={startChanneling}
                         className="relative w-24 h-24 rounded-full bg-gradient-to-b from-zinc-800 to-black border border-zinc-700 shadow-[0_0_30px_rgba(100,0,255,0.1)] flex items-center justify-center group active:scale-95 transition-all duration-200 cursor-pointer select-none"
                         style={{ WebkitTapHighlightColor: 'transparent' }}
                       >
                           <div className={`absolute inset-0 rounded-full bg-purple-600/20 blur-md transition-opacity duration-300 ${step === 'channeling' ? 'opacity-100' : 'opacity-0'}`}></div>
                           <SparklesIcon className={`w-10 h-10 text-zinc-400 group-hover:text-yellow-400 transition-colors duration-300 ${step === 'channeling' ? 'animate-spin-slow text-yellow-400' : ''}`} />
                       </button>
                  </div>
                  
                  <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest animate-pulse">
                      {step === 'channeling' ? t.channeling : t.hold}
                  </p>
              </div>
          ) : null}

          {/* REVEALED: Interpretation */}
          {step === 'revealed' && (
              <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                  <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                      {/* Decorative border corners */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-yellow-500/30"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-yellow-500/30"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-yellow-500/30"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-yellow-500/30"></div>

                      <div className="prose prose-invert prose-p:font-serif prose-p:text-lg prose-p:leading-relaxed prose-headings:font-mystic prose-headings:text-amber-200">
                           {isReadingLoading ? (
                               <div className="space-y-3">
                                   <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse"></div>
                                   <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                                   <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse"></div>
                                   <p className="text-center text-xs text-zinc-500 mt-4 animate-pulse">{t.loading}</p>
                               </div>
                           ) : (
                               <div className="whitespace-pre-wrap text-zinc-200 leading-relaxed text-justify">
                                  {reading}
                               </div>
                           )}
                      </div>
                  </div>

                  <button 
                    onClick={reset}
                    className="mx-auto mt-8 flex items-center space-x-2 text-zinc-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold px-6 py-3 border border-transparent hover:border-white/10 rounded-full hover:bg-white/5"
                  >
                      <ArrowPathIcon className="w-4 h-4" />
                      <span>{t.consultAgain}</span>
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};

export default App;
