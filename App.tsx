
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { Starfield } from './components/Starfield';
import { TarotCard, CardData } from './components/TarotCard';
import { MotionDetector } from './components/MotionDetector';
import { getTarotReading } from './services/gemini';
import { ArrowPathIcon, GlobeAltIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

// --- DECK GENERATION (Sacred Texts Mapping) ---

const BASE_IMAGE_URL = "https://sacred-texts.com/tarot/pkt/img";

const SUITS = [
  { name: 'Wands', id: 'wa', color: 'from-orange-900/40 via-red-900/40 to-zinc-900', zh: '權杖' },
  { name: 'Cups', id: 'cu', color: 'from-blue-900/40 via-cyan-900/40 to-zinc-900', zh: '聖杯' },
  { name: 'Swords', id: 'sw', color: 'from-slate-700/40 via-zinc-800/40 to-zinc-900', zh: '寶劍' },
  { name: 'Pentacles', id: 'pe', color: 'from-yellow-900/40 via-amber-900/40 to-zinc-900', zh: '錢幣' }
];

// Sacred Texts filename mapping: ac, 02..10, pa, kn, qu, ki
const RANKS = [
  { name: 'Ace', val: 'ac', zh: '王牌' },
  { name: 'Two', val: '02', zh: '二' },
  { name: 'Three', val: '03', zh: '三' },
  { name: 'Four', val: '04', zh: '四' },
  { name: 'Five', val: '05', zh: '五' },
  { name: 'Six', val: '06', zh: '六' },
  { name: 'Seven', val: '07', zh: '七' },
  { name: 'Eight', val: '08', zh: '八' },
  { name: 'Nine', val: '09', zh: '九' },
  { name: 'Ten', val: '10', zh: '十' },
  { name: 'Page', val: 'pa', zh: '侍衛' },
  { name: 'Knight', val: 'kn', zh: '騎士' },
  { name: 'Queen', val: 'qu', zh: '皇后' },
  { name: 'King', val: 'ki', zh: '國王' }
];

const MAJOR_ARCANA = [
  { name: "The Fool", id: "ar00", zh: "愚者" },
  { name: "The Magician", id: "ar01", zh: "魔術師" },
  { name: "The High Priestess", id: "ar02", zh: "女祭司" },
  { name: "The Empress", id: "ar03", zh: "皇后" },
  { name: "The Emperor", id: "ar04", zh: "皇帝" },
  { name: "The Hierophant", id: "ar05", zh: "教皇" },
  { name: "The Lovers", id: "ar06", zh: "戀人" },
  { name: "The Chariot", id: "ar07", zh: "戰車" },
  { name: "Strength", id: "ar08", zh: "力量" },
  { name: "The Hermit", id: "ar09", zh: "隱士" },
  { name: "Wheel of Fortune", id: "ar10", zh: "命運之輪" },
  { name: "Justice", id: "ar11", zh: "正義" },
  { name: "The Hanged Man", id: "ar12", zh: "倒吊人" },
  { name: "Death", id: "ar13", zh: "死神" },
  { name: "Temperance", id: "ar14", zh: "節制" },
  { name: "The Devil", id: "ar15", zh: "惡魔" },
  { name: "The Tower", id: "ar16", zh: "高塔" },
  { name: "The Star", id: "ar17", zh: "星星" },
  { name: "The Moon", id: "ar18", zh: "月亮" },
  { name: "The Sun", id: "ar19", zh: "太陽" },
  { name: "Judgement", id: "ar20", zh: "審判" },
  { name: "The World", id: "ar21", zh: "世界" },
];

function generateDeck(): CardData[] {
  const deck: CardData[] = [];

  // 1. Major Arcana
  MAJOR_ARCANA.forEach(card => {
    deck.push({
      name: card.name,
      image: `${BASE_IMAGE_URL}/${card.id}.jpg`,
      colors: 'from-purple-900/40 via-fuchsia-900/40 to-zinc-900',
      desc: 'Major Arcana',
      zhName: card.zh
    });
  });

  // 2. Minor Arcana
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        name: `${rank.name} of ${suit.name}`,
        image: `${BASE_IMAGE_URL}/${suit.id}${rank.val}.jpg`,
        colors: suit.color,
        desc: `${suit.name} Suit`,
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
    subtitle: '人工智能 • 神秘洞察',
    placeholder: '向宇宙提問...',
    start: '開啟星鏡',
    channeling: '在鏡前揮手以引導能量...',
    flipInstruction: '再次揮手以揭示命運',
    consultAgain: '再次諮詢',
    loading: '正在諮詢星辰...',
    language: '語言',
    upright: '正位',
    reversed: '逆位',
    cameraError: '無法存取相機，請使用點擊模式',
  },
  'en': {
    title: 'Oracle of Gemini',
    subtitle: 'Artificial Intelligence • Mystical Insight',
    placeholder: 'Ask the universe a question...',
    start: 'Open Scrying Mirror',
    channeling: 'Wave hand over mirror to channel energy...',
    flipInstruction: 'Wave again to reveal destiny',
    consultAgain: 'Consult Again',
    loading: 'Consulting the stars...',
    language: 'Language',
    upright: 'Upright',
    reversed: 'Reversed',
    cameraError: 'Camera access denied. Using click mode.',
  },
  'ja': {
    title: '双子座の神託',
    subtitle: '人工知能 • 神秘的な洞察',
    placeholder: '宇宙に問いかける...',
    start: '鏡を開く',
    channeling: 'エネルギーを導くために鏡の前で手を振ってください...',
    flipInstruction: '運命を明らかにするためにもう一度手を振ってください',
    consultAgain: 'もう一度占う',
    loading: '星々に尋ねています...',
    language: '言語',
    upright: '正位置',
    reversed: '逆位置',
    cameraError: 'カメラにアクセスできません。クリックモードを使用します。',
  }
};

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'channeling' | 'ready_to_reveal' | 'revealed'>('intro');
  const [question, setQuestion] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [reading, setReading] = useState('');
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  const [channelingProgress, setChannelingProgress] = useState(0);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const t = UI_TEXT[language] || UI_TEXT['en'];

  // Start the Ritual
  const startRitual = () => {
    setStep('channeling');
    setCameraEnabled(true);
  };

  // Handle Motion Detection
  const handleMotion = (motionLevel: number) => {
    if (step === 'channeling') {
      setChannelingProgress(prev => {
        const next = prev + (motionLevel * 5); // Sensitivity
        if (next >= 100) {
          completeChanneling();
          return 100;
        }
        return next;
      });
    } else if (step === 'ready_to_reveal') {
        if (motionLevel > 5) { // Threshold for flip
             revealCard();
        }
    }
  };

  const completeChanneling = () => {
      // Pick random card
      const randomCard = FULL_DECK[Math.floor(Math.random() * FULL_DECK.length)];
      const reversed = Math.random() < 0.2; 
      
      setSelectedCard(randomCard);
      setIsReversed(reversed);
      setStep('ready_to_reveal'); // Wait for flip gesture

      // Start fetching reading immediately
      setIsReadingLoading(true);
      const cardName = randomCard.name + (reversed ? " (Reversed)" : " (Upright)");
      getTarotReading(cardName, question, language).then(text => {
          setReading(text);
          setIsReadingLoading(false);
      });
  };

  const revealCard = () => {
      setStep('revealed');
      setCameraEnabled(false); // Turn off camera
  };

  const reset = () => {
      setStep('intro');
      setQuestion('');
      setSelectedCard(null);
      setReading('');
      setIsReversed(false);
      setChannelingProgress(0);
      setCameraEnabled(false);
  };

  const getCardDisplayName = (card: CardData | null) => {
    if (!card) return '';
    if (language === 'zh-TW' && card.zhName) {
      return card.zhName;
    }
    return card.name;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 select-none overflow-hidden text-zinc-100">
      <Starfield />

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

      {/* MAIN CARD STAGE */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl min-h-[500px]">
          
          {/* Card Component */}
          {selectedCard && (
             <div className={`transition-all duration-1000 mb-8 cursor-pointer ${step === 'revealed' ? 'scale-100' : 'scale-90'}`} onClick={step === 'ready_to_reveal' ? revealCard : undefined}>
                <TarotCard 
                  card={selectedCard} 
                  isRevealed={step === 'revealed'} 
                  isDrawing={step === 'ready_to_reveal' || step === 'revealed'} 
                  isReversed={isReversed}
                  displayName={getCardDisplayName(selectedCard)}
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
          )}

          {/* INTRO STEP */}
          {step === 'intro' && (
              <div className="flex flex-col items-center space-y-8 w-full max-w-md animate-in fade-in duration-700">
                  <div className="w-full relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                      <input 
                        type="text" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={t.placeholder}
                        className="relative w-full bg-black/50 border border-white/10 rounded-lg px-6 py-4 text-center text-lg placeholder-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all text-indigo-100 font-serif"
                      />
                  </div>

                  <button
                    onClick={startRitual}
                    className="group relative px-8 py-3 bg-zinc-900 border border-zinc-700 rounded-full flex items-center space-x-2 overflow-hidden transition-all hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      <VideoCameraIcon className="w-5 h-5 text-amber-500" />
                      <span className="uppercase tracking-widest text-sm font-medium text-zinc-300 group-hover:text-amber-200">{t.start}</span>
                  </button>
              </div>
          )}

          {/* CHANNELING / SCRYING MIRROR */}
          {(step === 'channeling' || step === 'ready_to_reveal') && (
            <div className="relative flex flex-col items-center justify-center animate-in zoom-in duration-500">
                {/* Scrying Mirror Container */}
                <div className={`relative rounded-full p-1 bg-gradient-to-b from-amber-600/50 to-purple-900/50 shadow-[0_0_50px_rgba(88,28,135,0.4)] transition-all duration-700 ${step === 'ready_to_reveal' ? 'w-24 h-24 mt-8 opacity-50' : 'w-64 h-64'}`}>
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                       <MotionDetector 
                          active={true} 
                          onMotion={handleMotion} 
                          className="w-full h-full object-cover opacity-60 mix-blend-screen scale-125"
                        />
                        {/* Mystical Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-amber-900/20 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-full border-[4px] border-inset border-black/30 pointer-events-none"></div>
                    </div>
                    
                    {/* Progress Ring */}
                    {step === 'channeling' && (
                       <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90 pointer-events-none">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="48%" 
                            fill="transparent"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeDasharray="500" 
                            strokeDashoffset={500 - (channelingProgress / 100) * 500}
                            className="transition-all duration-100 ease-linear shadow-[0_0_10px_#fbbf24]"
                          />
                       </svg>
                    )}
                </div>

                <p className="mt-6 text-center text-amber-200/80 font-mystic text-lg animate-pulse tracking-wide max-w-xs">
                    {step === 'channeling' ? t.channeling : t.flipInstruction}
                </p>
                <p className="text-xs text-zinc-500 mt-2">(Or click the card if camera is unavailable)</p>
            </div>
          )}

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
