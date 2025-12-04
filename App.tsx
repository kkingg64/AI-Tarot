

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef, useEffect } from 'react';
import { Starfield } from './components/Starfield';
import { TarotCard, CardData, CardBack } from './components/TarotCard';
import { getTarotReading, CardReadingInput, StructuredReading } from './services/gemini';
import { SparklesIcon, ArrowPathIcon, GlobeAltIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// --- DECK GENERATION ---

const SUITS = [
  { name: 'Wands', id: 'wands', code: 'wa', color: 'from-orange-900/60 via-red-900/60 to-zinc-900', zh: '權杖', iconType: 'fire' },
  { name: 'Cups', id: 'cups', code: 'cu', color: 'from-blue-900/60 via-cyan-900/60 to-zinc-900', zh: '聖杯', iconType: 'water' },
  { name: 'Swords', id: 'swords', code: 'sw', color: 'from-slate-700/60 via-zinc-800/60 to-zinc-900', zh: '寶劍', iconType: 'air' },
  { name: 'Pentacles', id: 'pentacles', code: 'pe', color: 'from-yellow-900/60 via-amber-900/60 to-zinc-900', zh: '錢幣', iconType: 'earth' }
];

const RANKS = [
  { name: 'Ace', val: '1', code: 'ac', zh: '王牌' },
  { name: 'Two', val: '2', code: '02', zh: '二' },
  { name: 'Three', val: '3', code: '03', zh: '三' },
  { name: 'Four', val: '4', code: '04', zh: '四' },
  { name: 'Five', val: '5', code: '05', zh: '五' },
  { name: 'Six', val: '6', code: '06', zh: '六' },
  { name: 'Seven', val: '7', code: '07', zh: '七' },
  { name: 'Eight', val: '8', code: '08', zh: '八' },
  { name: 'Nine', val: '9', code: '09', zh: '九' },
  { name: 'Ten', val: '10', code: '10', zh: '十' },
  { name: 'Page', val: 'P', code: 'pa', zh: '侍衛' },
  { name: 'Knight', val: 'Kn', code: 'kn', zh: '騎士' },
  { name: 'Queen', val: 'Q', code: 'qu', zh: '皇后' },
  { name: 'King', val: 'K', code: 'ki', zh: '國王' }
];

const MAJOR_ARCANA = [
  { name: "The Fool", id: "0", code: "ar00", zh: "愚者", iconType: "fool" },
  { name: "The Magician", id: "I", code: "ar01", zh: "魔術師", iconType: "magic" },
  { name: "The High Priestess", id: "II", code: "ar02", zh: "女祭司", iconType: "moon" },
  { name: "The Empress", id: "III", code: "ar03", zh: "皇后", iconType: "nature" },
  { name: "The Emperor", id: "IV", code: "ar04", zh: "皇帝", iconType: "crown" },
  { name: "The Hierophant", id: "V", code: "ar05", zh: "教皇", iconType: "faith" },
  { name: "The Lovers", id: "VI", code: "ar06", zh: "戀人", iconType: "heart" },
  { name: "The Chariot", id: "VII", code: "ar07", zh: "戰車", iconType: "star" },
  { name: "Strength", id: "VIII", code: "ar08", zh: "力量", iconType: "sun" },
  { name: "The Hermit", id: "IX", code: "ar09", zh: "隱士", iconType: "lamp" },
  { name: "Wheel of Fortune", id: "X", code: "ar10", zh: "命運之輪", iconType: "wheel" },
  { name: "Justice", id: "XI", code: "ar11", zh: "正義", iconType: "balance" },
  { name: "The Hanged Man", id: "XII", code: "ar12", zh: "倒吊人", iconType: "hang" },
  { name: "Death", id: "XIII", code: "ar13", zh: "死神", iconType: "skull" },
  { name: "Temperance", id: "XIV", code: "ar14", zh: "節制", iconType: "cup" },
  { name: "The Devil", id: "XV", code: "ar15", zh: "惡魔", iconType: "chain" },
  { name: "The Tower", id: "XVI", code: "ar16", zh: "高塔", iconType: "fire" },
  { name: "The Star", id: "XVII", code: "ar17", zh: "星星", iconType: "star" },
  { name: "The Moon", id: "XVIII", code: "ar18", zh: "月亮", iconType: "moon" },
  { name: "The Sun", id: "XIX", code: "ar19", zh: "太陽", iconType: "sun" },
  { name: "Judgement", id: "XX", code: "ar20", zh: "審判", iconType: "trumpet" },
  { name: "The World", id: "XXI", code: "ar21", zh: "世界", iconType: "world" },
];

const BASE_URL = "https://sacred-texts.com/tarot/pkt/img";

function generateDeck(): CardData[] {
  const deck: CardData[] = [];
  MAJOR_ARCANA.forEach(card => {
    deck.push({
      name: card.name,
      id: card.id,
      colors: 'from-purple-900/60 via-fuchsia-900/60 to-zinc-900',
      type: 'major',
      iconType: card.iconType,
      zhName: card.zh,
      image: `${BASE_URL}/${card.code}.jpg`
    });
  });
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        name: `${rank.name} of ${suit.name}`,
        id: rank.val, 
        colors: suit.color,
        type: 'minor',
        suit: suit.name,
        iconType: suit.iconType,
        zhName: `${suit.zh}${rank.zh}`,
        image: `${BASE_URL}/${suit.code}${rank.code}.jpg`
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
    title: '未來之鏡',
    subtitle: '過去 • 現在 • 未來',
    placeholder: '輸入您心中的疑惑...',
    channeling: '注入能量中...',
    hold: '長按水晶以感應能量',
    drag_instruction: '從下方牌堆「垂直」拖曳三張牌',
    draw_ready: '準備揭示',
    consultAgain: '開啟新解讀',
    loading: '星辰正在排列...',
    language: '語言',
    upright: '正位',
    reversed: '逆位',
    pos_past: '過去之根',
    pos_present: '當下顯化',
    pos_future: '未來潛能',
    next: '下一步',
    reveal: '揭示命運',
    summary_title: '來自宇宙的指引',
    pick_card: '選擇此牌',
    tap_anywhere: '點擊螢幕繼續',
    questions: [
        '我目前的感情發展如何？',
        '我的事業會有突破嗎？',
        '我該如何面對目前的挑戰？',
        '未來三個月的財運如何？'
    ]
  },
  'en': {
    title: 'Trinity Oracle',
    subtitle: 'Past • Present • Future',
    placeholder: 'Type your question to the universe...',
    channeling: 'Channeling Energy...',
    hold: 'Press & Hold the Crystal to Connect',
    drag_instruction: 'Drag 3 cards UP from the deck',
    draw_ready: 'Ready to Reveal',
    consultAgain: 'New Reading',
    loading: 'Aligning the stars...',
    language: 'Language',
    upright: 'Upright',
    reversed: 'Reversed',
    pos_past: 'The Roots',
    pos_present: 'The Manifestation',
    pos_future: 'The Potential',
    next: 'Next',
    reveal: 'Reveal Destiny',
    summary_title: 'Universal Guidance',
    pick_card: 'Pick Card',
    tap_anywhere: 'Tap to Continue',
    questions: [
        'What path should I take in my career?',
        'Is love coming into my life?',
        'What do I need to know right now?',
        'How can I find balance?'
    ]
  },
  'ja': {
    title: '未来の鏡',
    subtitle: '過去 • 現在 • 未来',
    placeholder: '心にある問いを入力してください...',
    channeling: 'エネルギーを注入中...',
    hold: '水晶を長押しして接続',
    drag_instruction: 'デッキからカードを上にドラッグ',
    draw_ready: '運命を明かす準備',
    consultAgain: '新たなリーディング',
    loading: '星々が整列しています...',
    language: '言語',
    upright: '正位置',
    reversed: '逆位置',
    pos_past: '過去の根源',
    pos_present: '現在の顕現',
    pos_future: '未来の可能性',
    next: '次へ',
    reveal: '運命を明かす',
    summary_title: '宇宙からの導き',
    pick_card: 'カードを選択',
    tap_anywhere: '画面をタップして続行',
    questions: [
        '今の恋愛運はどうですか？',
        '仕事で成功するには？',
        '今、何に集中すべきですか？',
        '来月の運勢を教えてください'
    ]
  }
};

interface DrawnCard {
  card: CardData;
  reversed: boolean;
  positionLabel: string;
}

type RevealStage = 0 | 1 | 2 | 3 | 4;

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'channeling' | 'dealing' | 'drawing'>('intro');
  const [revealStage, setRevealStage] = useState<RevealStage>(0);
  const [question, setQuestion] = useState('');
  
  const [shuffledDeck, setShuffledDeck] = useState<CardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<(DrawnCard | null)[]>([null, null, null]);
  
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const gestureStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const [reading, setReading] = useState<StructuredReading | null>(null);
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  
  const [channelingProgress, setChannelingProgress] = useState(0);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [sessionId, setSessionId] = useState(1);

  const t = UI_TEXT[language] || UI_TEXT['en'];
  const channelInterval = useRef<number | null>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
     const deckCopy = [...FULL_DECK];
     for (let i = deckCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
     }
     setShuffledDeck(deckCopy);
  }, [sessionId]); 

  // --- INTERACTION HANDLERS ---

  const startChanneling = () => {
    if (step !== 'intro') return;
    setStep('channeling');
    
    let progress = 0;
    channelInterval.current = window.setInterval(() => {
        progress += 4; 
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
      setDrawnCards([null, null, null]);
      setStep('dealing');
  };

  // --- GESTURE LOGIC ---
  const handlePointerDown = (e: React.PointerEvent, deckIndex: number) => {
      if (!e.isPrimary) return;
      gestureStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent, deckIndex: number) => {
      if (!gestureStartRef.current) return;
      
      const deltaX = Math.abs(e.clientX - gestureStartRef.current.x);
      const deltaY = Math.abs(e.clientY - gestureStartRef.current.y);

      if (draggedCardIndex !== null) {
          e.preventDefault();
          e.stopPropagation();
          setDragPosition({ x: e.clientX, y: e.clientY });
          return;
      }

      // Threshold of 10px to ignore jitter
      if (deltaY > 10 && deltaY > deltaX) {
          e.preventDefault(); // Prevent scroll now
          setDraggedCardIndex(deckIndex);
          setDragPosition({ x: e.clientX, y: e.clientY });
      } else if (deltaX > 10) {
          gestureStartRef.current = null; 
      }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
      gestureStartRef.current = null;

      if (draggedCardIndex !== null) {
          e.preventDefault();
          
          let droppedSlot = -1;
          
          slotRefs.current.forEach((ref, index) => {
              if (ref) {
                  const rect = ref.getBoundingClientRect();
                  if (
                      e.clientX >= rect.left && 
                      e.clientX <= rect.right && 
                      e.clientY >= rect.top && 
                      e.clientY <= rect.bottom
                  ) {
                      droppedSlot = index;
                  }
              }
          });

          if (droppedSlot !== -1 && !drawnCards[droppedSlot]) {
             const card = shuffledDeck[draggedCardIndex];
             const reversed = Math.random() < 0.2;
             
             const newDrawn = [...drawnCards];
             newDrawn[droppedSlot] = {
                 card: card,
                 reversed: reversed,
                 positionLabel: droppedSlot === 0 ? 'Past' : droppedSlot === 1 ? 'Present' : 'Future'
             };
             setDrawnCards(newDrawn);
             
             const newDeck = [...shuffledDeck];
             newDeck.splice(draggedCardIndex, 1);
             setShuffledDeck(newDeck);
          }
          
          setDraggedCardIndex(null);
          setDragPosition(null);
      }
  };

  const handleGlobalPointerUp = (e: React.PointerEvent) => {
    handlePointerUp(e); // Handles card dragging logic
    stopChanneling(); // Handles releasing the channeling crystal
  };

  const finishDealing = () => {
    if (drawnCards.some(c => c === null)) return;
    const validCards = drawnCards as DrawnCard[];
    setStep('drawing');
    setIsReadingLoading(true);
    const aiInput: CardReadingInput[] = validCards.map(d => ({
      name: d.card.name,
      isReversed: d.reversed,
      position: d.positionLabel
    }));

    getTarotReading(aiInput, question, language).then(data => {
        setReading(data);
        setIsReadingLoading(false);
    });

    setTimeout(() => setRevealStage(1), 500);
  };

  const nextReveal = (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation(); // Prevent background click conflict
      if (revealStage < 4) {
          setRevealStage(prev => (prev + 1) as RevealStage);
      }
  };

  const reset = (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation();
      setStep('intro');
      setRevealStage(0);
      setQuestion('');
      setDrawnCards([null, null, null]);
      setReading(null);
      setChannelingProgress(0);
      setSessionId(id => id + 1);
  };

  // Background Tap to Next
  const handleBackgroundTap = () => {
      if (step === 'drawing' && revealStage > 0 && revealStage < 4 && !isReadingLoading) {
          nextReveal();
      }
  };

  const getCardDisplayName = (card: CardData | null) => {
    if (!card) return '';
    if (language === 'zh-TW' && card.zhName) {
      return card.zhName;
    }
    return card.name;
  };
  
  const getPositionLabel = (pos: string) => {
    if (pos === 'Past') return t.pos_past;
    if (pos === 'Present') return t.pos_present;
    if (pos === 'Future') return t.pos_future;
    return pos;
  };

  const getCurrentReadingText = () => {
      if (!reading) return '';
      switch (revealStage) {
          case 1: return reading.past;
          case 2: return reading.present;
          case 3: return reading.future;
          case 4: return reading.summary;
          default: return '';
      }
  };

  const allSlotsFilled = drawnCards.every(c => c !== null);

  return (
    <div 
      className="relative min-h-screen flex flex-col items-center select-none overflow-x-hidden overflow-y-auto touch-none cursor-pointer" 
      onPointerUp={handleGlobalPointerUp}
      // Global click for background advancement
      onClick={handleBackgroundTap}
    >
      <Starfield />

      {/* LANGUAGE SELECTOR */}
      <div className="absolute top-4 right-4 z-[60]">
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
            className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-amber-400/50 shadow-lg group"
          >
            <GlobeAltIcon className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-semibold">{LANGUAGES.find(l => l.code === language)?.label}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full right-0 mt-3 w-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col z-50 animate-in fade-in zoom-in-95 duration-200">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={(e) => { e.stopPropagation(); setLanguage(lang.code); setShowLangMenu(false); }}
                  className={`px-4 py-3 text-left text-xs tracking-wider font-medium hover:bg-white/10 transition-colors ${language === lang.code ? 'text-amber-400 bg-white/5' : 'text-zinc-400'}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEADER */}
      <div className={`transition-all duration-1000 mt-6 mb-2 text-center z-10 w-full ${step === 'drawing' ? 'scale-75 translate-y-[-1vh]' : 'scale-100'} ${(step === 'dealing') ? 'opacity-80 scale-90' : ''}`}>
          <h1 className="text-3xl md:text-5xl font-mystic text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500 drop-shadow-[0_0_25px_rgba(251,191,36,0.4)] tracking-wide">
              {t.title}
          </h1>
          <p className="text-amber-100/40 font-serif italic mt-2 text-xs tracking-[0.3em] uppercase">
              {t.subtitle}
          </p>
      </div>

      {/* MAIN CONTENT */}
      {/* Added pb to ensure cards aren't covered by bottom sheet on mobile */}
      <div className={`relative z-10 flex flex-col items-center w-full max-w-6xl flex-grow ${step === 'intro' ? 'justify-center' : 'justify-start'} ${step === 'drawing' ? 'pb-[50vh] md:pb-0' : ''}`}>

          {/* DEALING PHASE UI */}
          {step === 'dealing' && (
             <div className="w-full flex flex-col items-center justify-between h-full py-8 animate-in fade-in duration-700">
                 
                 {/* 1. TOP: Slots */}
                 <div className="flex justify-center gap-2 md:gap-12 w-full px-4 mb-auto pt-4 md:pt-8">
                     {[0, 1, 2].map((idx) => (
                         <div 
                            key={idx}
                            ref={(el) => { slotRefs.current[idx] = el }}
                            className={`
                              relative w-24 h-40 md:w-48 md:h-80 rounded-xl border-2 transition-all duration-300
                              ${drawnCards[idx] 
                                ? 'border-amber-500/50 bg-black/40 shadow-[0_0_30px_rgba(217,119,6,0.3)]' 
                                : 'border-dashed border-white/10 bg-white/5 hover:border-white/30'
                              }
                              ${draggedCardIndex !== null ? 'scale-105 border-violet-400/50' : ''}
                            `}
                         >
                            <div className="absolute -top-6 md:-top-8 left-0 right-0 text-center">
                                <span className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 font-mystic">
                                    {idx === 0 ? t.pos_past : idx === 1 ? t.pos_present : t.pos_future}
                                </span>
                            </div>
                            {drawnCards[idx] ? (
                                <div className="w-full h-full p-1 md:p-2">
                                   <CardBack className="w-full h-full" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                   <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-white/20"></div>
                                </div>
                            )}
                         </div>
                     ))}
                 </div>
                 
                 {/* Instruction */}
                 <div className="my-4 md:my-8 pointer-events-none z-20 pb-48"> 
                     {!allSlotsFilled ? (
                        <p className="text-amber-200/80 font-mystic text-xs md:text-sm uppercase tracking-widest animate-pulse bg-black/50 px-6 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm">
                            {t.drag_instruction}
                        </p>
                     ) : (
                        <button 
                          onClick={(e) => {e.stopPropagation(); finishDealing();}}
                          className="pointer-events-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full text-white font-mystic tracking-widest shadow-[0_0_30px_rgba(217,119,6,0.6)] hover:scale-105 transition-transform animate-in zoom-in"
                        >
                           {t.draw_ready}
                        </button>
                     )}
                 </div>

                 {/* 2. BOTTOM: Deck Fan (Fixed to Bottom for Mobile) */}
                 <div className="fixed bottom-0 left-0 right-0 h-48 md:h-80 z-40">
                    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
                    <div 
                      ref={deckRef}
                      className="absolute inset-0 overflow-x-auto overflow-y-clip flex items-end px-8 pt-20 pb-4 scrollbar-hide snap-x touch-pan-x"
                    >
                        {shuffledDeck.slice(0, 40).map((card, i) => (
                           <div 
                             key={card.id + i}
                             onPointerDown={(e) => handlePointerDown(e, i)}
                             onPointerMove={(e) => handlePointerMove(e, i)}
                             className="group flex-shrink-0 w-20 h-32 md:w-28 md:h-44 -mr-12 md:-mr-12 relative cursor-grab active:cursor-grabbing deck-card transition-transform duration-200 origin-bottom"
                             style={{ zIndex: i, marginBottom: '1rem' }}
                           >
                              <CardBack small />
                              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur text-amber-100 text-[10px] px-2 py-1 rounded border border-amber-500/30 whitespace-nowrap pointer-events-none deck-tooltip z-50">
                                {getCardDisplayName(card)}
                              </div>
                           </div>
                        ))}
                         <div className="w-16 flex-shrink-0"></div>
                    </div>
                 </div>

             </div>
          )}

          {/* GHOST CARD (When Dragging) */}
          {draggedCardIndex !== null && dragPosition && (
             <div 
               className="fixed w-20 h-32 md:w-24 md:h-40 z-[9999] pointer-events-none opacity-90 shadow-[0_0_30px_rgba(251,191,36,0.5)] rotate-3"
               style={{ 
                   left: dragPosition.x, 
                   top: dragPosition.y,
                   transform: 'translate(-50%, -50%)'
               }}
             >
                 <CardBack small />
             </div>
          )}

          {/* REVEAL STAGE UI */}
          <div 
            className={`transition-all duration-1000 w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 perspective-1000 mt-8 mb-4 z-20 ${step === 'drawing' ? 'scale-100 opacity-100' : 'hidden'}`}
          >
             
             {drawnCards.map((drawn, idx) => {
               if (!drawn) return null;
               const isRevealed = revealStage >= idx + 1;
               const isFocused = (revealStage === idx + 1) || (revealStage as number) === 4;
               const mobileVisibility = (isFocused || revealStage === 4) ? 'flex' : 'hidden md:flex';

               return (
                 <div 
                    key={idx} 
                    // Add click handler to Card container for "Tap to Reveal"
                    onClick={(e) => { 
                        // If this card is the current focus, tap it to go next
                        if (isFocused && revealStage < 4) {
                            e.stopPropagation();
                            nextReveal();
                        }
                    }}
                    className={`flex-col items-center group transition-all duration-700 ${mobileVisibility} ${revealStage === 4 ? 'md:opacity-100 md:scale-100 opacity-100 scale-90' : isFocused ? 'opacity-100 scale-100' : 'opacity-40 scale-90 blur-sm'}`}
                 >
                    <div className={`mb-4 text-xs font-mystic uppercase tracking-[0.25em] text-amber-400 transition-all delay-700 duration-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                       {getPositionLabel(drawn.positionLabel)}
                    </div>
                    <TarotCard 
                      card={drawn.card} 
                      isRevealed={isRevealed} 
                      isDrawing={true} 
                      isReversed={drawn.reversed}
                      index={idx}
                    />
                    {isRevealed && (
                       <div className={`text-center mt-6 transition-all duration-700 delay-500 opacity-0 animate-in fade-in slide-in-from-bottom-2 fill-mode-forwards`} style={{animationDelay: `500ms`}}>
                           <h4 className="text-amber-100 font-mystic text-xl drop-shadow-md bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                               {getCardDisplayName(drawn.card)}
                           </h4>
                           <div className="flex items-center justify-center gap-2 mt-2">
                             <span className="h-[1px] w-4 bg-amber-500/50"></span>
                             <p className="text-amber-500/80 text-[10px] uppercase tracking-[0.2em] font-semibold">
                                 {drawn.reversed ? t.reversed : t.upright}
                             </p>
                             <span className="h-[1px] w-4 bg-amber-500/50"></span>
                           </div>
                       </div>
                    )}
                 </div>
               );
             })}
          </div>

          {/* INTRO: Question & Channeling */}
          {step === 'intro' || step === 'channeling' ? (
              <div className={`flex flex-col items-center space-y-10 w-full max-w-lg transition-all duration-700 mt-8 mb-20 ${step === 'intro' || step === 'channeling' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-lg pointer-events-none'}`}>
                  {/* ... Same Intro Content ... */}
                  <div className="w-full space-y-4 px-4">
                      <div className="relative group z-20">
                          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center shadow-2xl">
                             <div className="pl-4 text-violet-400">
                                <SparklesIcon className="w-5 h-5" />
                             </div>
                             <input 
                               type="text" 
                               value={question}
                               onChange={(e) => setQuestion(e.target.value)}
                               placeholder={t.placeholder}
                               className="w-full bg-transparent border-none px-4 py-4 text-center text-lg placeholder-zinc-500 focus:outline-none focus:ring-0 text-violet-100 font-serif"
                             />
                          </div>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2 px-2">
                          {t.questions.map((q: string, i: number) => (
                             <button 
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setQuestion(q); }}
                                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-400/30 text-[11px] text-zinc-400 hover:text-violet-200 transition-all duration-300 cursor-pointer active:scale-95"
                             >
                                {q}
                             </button>
                          ))}
                      </div>
                  </div>

                  <div className="relative w-64 h-64 flex items-center justify-center">
                       <div className="absolute w-56 h-56 rounded-full border border-violet-500/10 animate-[spin-slow_10s_linear_infinite]"></div>
                       <div className="absolute w-48 h-48 rounded-full border border-amber-500/10 animate-[spin-slow_15s_linear_infinite_reverse]"></div>

                       <div className="absolute w-36 h-36 rotate-[-90deg]">
                          <svg className="w-full h-full">
                            <circle
                              cx="50%"
                              cy="50%"
                              r="48%"
                              fill="transparent"
                              stroke="#8b5cf6" 
                              strokeWidth="2"
                              strokeDasharray="300" 
                              strokeDashoffset={300 - (channelingProgress / 100) * 300}
                              className="transition-all duration-75 ease-linear drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                            />
                          </svg>
                       </div>

                       <button
                         onPointerDown={(e) => { e.stopPropagation(); startChanneling(); }}
                         className="relative w-28 h-28 rounded-full flex items-center justify-center group cursor-pointer select-none outline-none z-10 active:scale-90 transition-transform duration-150"
                         style={{ WebkitTapHighlightColor: 'transparent' }}
                       >
                           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-active:scale-95 transition-transform duration-200"></div>
                           <div className={`absolute inset-0 rounded-full bg-violet-600/30 blur-md transition-opacity duration-500 ${step === 'channeling' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}></div>
                           <div className="relative z-10 flex flex-col items-center space-y-1">
                               <SparklesIcon className={`w-8 h-8 text-zinc-400 group-hover:text-amber-200 transition-colors duration-500 ${step === 'channeling' ? 'text-violet-200 animate-pulse' : ''}`} />
                           </div>
                       </button>
                  </div>
                  
                  <p className="text-zinc-500 text-xs font-mystic uppercase tracking-[0.2em] animate-pulse text-center">
                      {step === 'channeling' ? t.channeling : t.hold}
                  </p>
              </div>
          ) : null}

          {/* TEXT REVELATION AREA (FIXED BOTTOM SHEET ON MOBILE) */}
          {step === 'drawing' && revealStage > 0 && (
              <div 
                  onClick={(e) => e.stopPropagation()} // Stop background tap when clicking text area
                  className={`
                    w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 
                    /* Mobile: Fixed Bottom, HIGH Z-INDEX */
                    fixed bottom-0 left-0 right-0 z-[100] touch-auto pointer-events-auto
                    /* Desktop: Relative */
                    md:relative md:bottom-auto md:left-auto md:right-auto md:max-w-2xl md:mt-8 md:mb-4 md:mx-4
                    flex flex-col
              `}>
                  <div className={`
                    relative bg-black/80 backdrop-blur-xl 
                    border-t border-white/20 md:border md:border-white/10 md:rounded-2xl
                    shadow-[0_-10px_50px_rgba(0,0,0,0.9)] 
                    overflow-hidden flex flex-col group 
                    h-[40vh] md:h-auto md:max-h-[60vh]
                    rounded-t-3xl 
                  `}>
                      
                      <div className="absolute -top-20 -right-20 w-60 h-60 bg-violet-600/20 rounded-full blur-[80px] group-hover:bg-violet-600/30 transition-colors duration-1000 pointer-events-none"></div>
                      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                      {/* HEADER ROW WITH CONTROLS */}
                      <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
                           {/* HEADER TITLE / STATUS */}
                           <div className="flex items-center space-x-2">
                              {isReadingLoading ? (
                                  <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-violet-400 rounded-full animate-ping"></div>
                                      <span className="text-[10px] uppercase tracking-widest text-violet-300">{t.loading}</span>
                                  </div>
                              ) : (
                                  <span className="text-[10px] uppercase tracking-widest text-zinc-400">{t.tap_anywhere}</span>
                              )}
                           </div>

                           {/* BUTTONS */}
                           <div className="flex space-x-2">
                             {revealStage < 4 ? (
                                  <button 
                                    onClick={nextReveal}
                                    disabled={isReadingLoading}
                                    className={`
                                        group relative px-5 py-2 rounded-full overflow-hidden transition-all duration-300 flex items-center space-x-2
                                        ${isReadingLoading ? 'bg-white/5 cursor-not-allowed opacity-50' : 'bg-white/10 hover:bg-white/20 shadow-lg border border-white/20 active:scale-95'}
                                    `}
                                  >
                                      <span className="uppercase tracking-widest text-[10px] font-bold text-white">{t.next}</span>
                                      <ChevronRightIcon className="w-3 h-3 text-white group-hover:translate-x-1 transition-transform" />
                                  </button>
                              ) : (
                                  <button 
                                    onClick={reset}
                                    className="group relative px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-md rounded-full border border-amber-500/40 shadow-lg transition-all duration-300 flex items-center space-x-2 active:scale-95"
                                  >
                                      <ArrowPathIcon className="w-3 h-3 text-amber-300 group-hover:rotate-180 transition-transform duration-500" />
                                      <span className="uppercase tracking-widest text-[10px] font-bold text-amber-200">{t.consultAgain}</span>
                                  </button>
                              )}
                          </div>
                      </div>

                      {/* TEXT CONTENT */}
                      <div className="relative z-10 overflow-y-auto p-6 flex-grow min-h-0 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                          {revealStage === 4 && (
                               <div className="flex items-center justify-center space-x-3 mb-6">
                                   <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
                                   <h3 className="text-center text-amber-300 font-mystic text-xl tracking-widest">{t.summary_title}</h3>
                                   <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
                               </div>
                           )}

                           {isReadingLoading ? (
                               <div className="space-y-6 pt-4 px-2">
                                   <div className="h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-pulse"></div>
                                   <p className="text-center text-sm font-mystic text-violet-300/80 animate-pulse tracking-widest">{t.loading}</p>
                                   <div className="h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-pulse delay-150"></div>
                               </div>
                           ) : (
                               <div className="prose prose-invert max-w-none pb-4">
                                  <p className="text-zinc-200 leading-8 text-lg font-serif text-justify drop-shadow-md">
                                    {getCurrentReadingText()}
                                  </p>
                               </div>
                           )}
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default App;