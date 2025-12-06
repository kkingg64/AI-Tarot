/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Starfield } from './components/Starfield';
import { TarotCard, CardData, CardBack } from './components/TarotCard';
import { getTarotReading, CardReadingInput, StructuredReading } from './services/gemini';
import { SparklesIcon, ArrowPathIcon, GlobeAltIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid';

const { useState, useRef, useEffect } = React;

// --- DECK GENERATION ---

const SUITS = [
  { name: 'Wands', id: 'wands', code: 'wa', gradientColors: ['rgba(124, 58, 23, 0.6)', 'rgba(127, 29, 29, 0.6)', 'rgba(24, 24, 27, 1)'], zh: '權杖', iconType: 'fire' },
  { name: 'Cups', id: 'cups', code: 'cu', gradientColors: ['rgba(30, 58, 138, 0.6)', 'rgba(22, 78, 99, 0.6)', 'rgba(24, 24, 27, 1)'], zh: '聖杯', iconType: 'water' },
  { name: 'Swords', id: 'swords', code: 'sw', gradientColors: ['rgba(51, 65, 85, 0.6)', 'rgba(39, 39, 42, 0.6)', 'rgba(24, 24, 27, 1)'], zh: '寶劍', iconType: 'air' },
  { name: 'Pentacles', id: 'pentacles', code: 'pe', gradientColors: ['rgba(113, 63, 18, 0.6)', 'rgba(120, 53, 15, 0.6)', 'rgba(24, 24, 27, 1)'], zh: '錢幣', iconType: 'earth' }
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
  const majorArcanaGradient = ['rgba(88, 28, 135, 0.6)', 'rgba(112, 26, 117, 0.6)', 'rgba(24, 24, 27, 1)'];
  
  MAJOR_ARCANA.forEach(card => {
    deck.push({
      name: card.name,
      id: card.id,
      gradientColors: majorArcanaGradient,
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
        gradientColors: suit.gradientColors,
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
    drag_instruction: '將三張牌拖曳至下方對應位置',
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
    drag_instruction: 'Drag 3 cards to the slots below',
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
    drag_instruction: '下のスロットにカードを3枚ドラッグ',
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
  positionLabel: 'Past' | 'Present' | 'Future';
}

type ActiveReadingView = 'past' | 'present' | 'future' | 'summary';

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'channeling' | 'dealing' | 'drawing'>('intro');
  const [revealedCards, setRevealedCards] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [activeReadingView, setActiveReadingView] = useState<ActiveReadingView | null>(null);
  const [question, setQuestion] = useState('');
  
  const [shuffledDeck, setShuffledDeck] = useState<CardData[]>([]);
  const [drawnCards, setDrawnCards] = useState<(DrawnCard | null)[]>([null, null, null]);
  
  const [draggedCardInfo, setDraggedCardInfo] = useState<{ card: CardData; indexInDeck: number } | null>(null);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  
  const [reading, setReading] = useState<StructuredReading | null>(null);
  const [isReadingLoading, setIsReadingLoading] = useState(false);
  
  const [channelingProgress, setChannelingProgress] = useState(0);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [sessionId, setSessionId] = useState(1);

  const t = UI_TEXT[language] || UI_TEXT['en'];
  const channelInterval = useRef<number | null>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
     const deckCopy = [...FULL_DECK];
     for (let i = deckCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
     }
     setShuffledDeck(deckCopy);
  }, [sessionId]); 

  const completeChanneling = () => {
      if (channelInterval.current) clearInterval(channelInterval.current);
      setDrawnCards([null, null, null]);
      setStep('dealing');
  };

  // --- INTERACTION HANDLERS ---
  const allSlotsFilled = drawnCards.every(c => c !== null);

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

  // --- GESTURE LOGIC ---
  const handleCardPointerDown = (e: React.PointerEvent, card: CardData, indexInDeck: number) => {
    if (!e.isPrimary || allSlotsFilled || draggedCardInfo) return;
    e.preventDefault();
    e.stopPropagation();
    setDraggedCardInfo({ card, indexInDeck });
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleGlobalPointerMove = (e: React.PointerEvent) => {
      if (draggedCardInfo) {
          setDragPosition({ x: e.clientX, y: e.clientY });
      }
  };

  const handleGlobalPointerUp = (e: React.PointerEvent) => {
    stopChanneling(); 
    
    if (draggedCardInfo) {
        let droppedSlot = -1;
        slotRefs.current.forEach((ref, index) => {
            if (ref) {
                const rect = ref.getBoundingClientRect();
                if (
                    e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom
                ) {
                    droppedSlot = index;
                }
            }
        });

        if (droppedSlot !== -1 && !drawnCards[droppedSlot]) {
           const { card } = draggedCardInfo;
           const reversed = Math.random() < 0.2;
           
           const newDrawn = [...drawnCards];
           newDrawn[droppedSlot] = {
               card,
               reversed,
               positionLabel: droppedSlot === 0 ? 'Past' : droppedSlot === 1 ? 'Present' : 'Future'
           };
           setDrawnCards(newDrawn);
           
           setShuffledDeck(prevDeck => prevDeck.filter(c => c.image !== card.image));
        }
        
        setDraggedCardInfo(null);
        setDragPosition(null);
    }
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
  };
  
  const handleCardClick = (idx: number) => {
    if (isReadingLoading || !reading) return;

    if (!revealedCards[idx]) {
      const newRevealed = [...revealedCards] as [boolean, boolean, boolean];
      newRevealed[idx] = true;
      setRevealedCards(newRevealed);
    }
    
    const position = idx === 0 ? 'past' : idx === 1 ? 'present' : 'future';
    setActiveReadingView(position);
  };

  const reset = (e?: React.MouseEvent | React.TouchEvent) => {
      e?.stopPropagation();
      setStep('intro');
      setRevealedCards([false, false, false]);
      setActiveReadingView(null);
      setQuestion('');
      setDrawnCards([null, null, null]);
      setReading(null);
      setChannelingProgress(0);
      setSessionId(id => id + 1);
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
      if (!reading || !activeReadingView) return '';
      switch (activeReadingView) {
          case 'past': return reading.past;
          case 'present': return reading.present;
          case 'future': return reading.future;
          case 'summary': return reading.summary;
          default: return '';
      }
  };
  
  const getReadingTitle = () => {
      if (!activeReadingView) return '';
      switch (activeReadingView) {
          case 'past': return t.pos_past;
          case 'present': return t.pos_present;
          case 'future': return t.pos_future;
          case 'summary': return t.summary_title;
          default: return '';
      }
  };

  return (
    <div 
      className={`relative min-h-screen flex flex-col items-center select-none overflow-x-hidden overflow-y-auto touch-none cursor-default ${step === 'dealing' ? 'dealing-glow-active' : ''}`}
      onPointerMove={handleGlobalPointerMove}
      onPointerUp={handleGlobalPointerUp}
      onClick={() => showLangMenu && setShowLangMenu(false)}
    >
      <Starfield />

      {/* LANGUAGE SELECTOR */}
      <div className="absolute top-4 right-4 z-60">
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowLangMenu(!showLangMenu); }}
            className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-all bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-amber-400/50 shadow-lg group"
          >
            <GlobeAltIcon className="w-4 h-4 text-amber-500 group-hover:rotate-12 transition-transform" />
            <span className="text-xs uppercase tracking-widest font-semibold">{LANGUAGES.find(l => l.code === language)?.label}</span>
          </button>
          
          {showLangMenu && (
            <div className="absolute top-full right-0 mt-3 w-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col z-50 animate-fade-in">
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
      <header className={`transition-all duration-1000 mt-6 mb-2 text-center z-10 w-full ${step === 'drawing' ? 'scale-75 header-shift-draw' : 'scale-100'} ${(step === 'dealing') ? 'opacity-80 scale-90' : ''}`}>
          <h1 className="text-3xl md:text-5xl font-mystic text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-200 to-amber-500 text-glow-amber tracking-wide">
              {t.title}
          </h1>
          <p className="text-amber-100/40 font-serif italic mt-2 text-xs tracking-widest uppercase">
              {t.subtitle}
          </p>
      </header>
      
      {/* MAIN CONTENT */}
      <main className={`relative z-10 flex flex-col items-center w-full max-w-7xl flex-grow ${step === 'intro' || step === 'channeling' ? 'justify-center' : 'justify-start'} ${step === 'drawing' ? 'pb-8' : ''}`}>

          {/* DEALING PHASE UI */}
          {step === 'dealing' && (
             <div className="w-full flex flex-col items-center justify-start h-full pt-4 animate-fade-in">
                 
                <div className="deck-card-container">
                    {shuffledDeck.slice(0, 42).map((card, i) => {
                        const totalCards = Math.min(42, shuffledDeck.length);
                        const angleOffset = -Math.PI / 2;
                        const angle = angleOffset + (i / totalCards) * 2 * Math.PI;
                        
                        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                        const radius = isMobile ? 220 : 450;
                        const ellipseFactor = 0.5;
                        
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle) * ellipseFactor;

                        const rotation = (angle * 180 / Math.PI) + 90;

                        const isDragged = draggedCardInfo?.indexInDeck === i;

                        return (
                            <div
                                key={card.image || card.name + i}
                                className={`deck-card group ${isDragged ? 'opacity-0' : ''}`}
                                style={{
                                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                                    zIndex: i,
                                }}
                                onPointerDown={(e) => handleCardPointerDown(e, card, i)}
                            >
                                <div className="card-inner-container">
                                    <CardBack small />
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="flex justify-center gap-2 md:gap-8 w-full px-4 pointer-events-auto">
                            {[0, 1, 2].map((idx) => (
                                <div 
                                   key={idx}
                                   ref={(el) => { slotRefs.current[idx] = el }}
                                   className={`
                                     relative w-24 h-40 rounded-xl border-2 transition-all duration-300
                                     ${drawnCards[idx] 
                                       ? 'border-amber-500/50 bg-black/40 shadow-lg shadow-amber-600/20' 
                                       : 'border-dashed border-white/10 bg-white/5 hover:border-white/30'
                                     }
                                     ${draggedCardInfo !== null ? 'scale-105 border-violet-400/50' : ''}
                                   `}
                                >
                                   <div className="absolute -top-6 left-0 right-0 text-center">
                                       <span className="text-9px md:text-xs uppercase tracking-wider text-zinc-500 font-mystic">
                                           {idx === 0 ? t.pos_past : idx === 1 ? t.pos_present : t.pos_future}
                                       </span>
                                   </div>
                                   {drawnCards[idx] ? (
                                       <div className="w-full h-full p-1">
                                          <CardBack className="w-full h-full" />
                                       </div>
                                   ) : (
                                       <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                          <div className="w-8 h-8 rounded-full border border-white/20"></div>
                                       </div>
                                   )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-8 pointer-events-auto z-20">
                           {!allSlotsFilled ? (
                              <p className="text-amber-200/80 font-mystic text-xs md:text-sm uppercase tracking-widest animate-pulse bg-black/50 px-6 py-2 rounded-full border border-amber-500/20 backdrop-blur-sm pointer-events-none">
                                  {t.drag_instruction}
                              </p>
                           ) : (
                              <button 
                                onClick={(e) => {e.stopPropagation(); finishDealing();}}
                                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-600 rounded-full text-white font-mystic tracking-widest shadow-lg shadow-amber-500/50 hover:scale-105 transition-transform"
                              >
                                 {t.draw_ready}
                              </button>
                           )}
                        </div>
                    </div>
                </div>
             </div>
          )}

          {/* GHOST CARD (When Dragging) */}
          {draggedCardInfo && dragPosition && (
             <div 
               className="fixed w-24 h-40 md:w-28 md:h-44 z-100 pointer-events-none opacity-90 shadow-2xl shadow-amber-500/50 rotate-3"
               style={{ 
                   left: dragPosition.x, 
                   top: dragPosition.y,
                   transform: 'translate(-50%, -50%)'
               }}
             >
                 <CardBack />
             </div>
          )}

          {/* DRAWING / REVEAL STAGE */}
          {step === 'drawing' && (
              <div className="w-full flex flex-col items-center justify-center gap-4 md:gap-6 px-4 mt-4 md:mt-6 flex-grow">
                  
                  <div className="w-full flex items-center justify-center gap-2 md:gap-4 lg:gap-6 perspective-1000 z-20 flex-shrink-0">
                      {drawnCards.map((drawn, idx) => {
                          if (!drawn) return null;
                          const position = idx === 0 ? 'past' : idx === 1 ? 'present' : 'future';
                          const isActive = activeReadingView === position || activeReadingView === null;
                          
                          return (
                              <div 
                                  key={idx} 
                                  onClick={(e) => { 
                                      e.stopPropagation();
                                      handleCardClick(idx);
                                  }}
                                  className={`flex flex-col items-center group transition-all duration-700 ${!isReadingLoading && reading ? 'cursor-pointer' : 'cursor-wait'} ${isActive ? 'opacity-100 scale-100' : 'opacity-60 scale-95'}`}
                              >
                                  <div className={`mb-4 text-xs font-mystic uppercase tracking-widest text-amber-400 transition-all delay-700 duration-700 ${revealedCards[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                      {getPositionLabel(drawn.positionLabel)}
                                  </div>
                                  <TarotCard 
                                      card={drawn.card} 
                                      isRevealed={revealedCards[idx]} 
                                      isDrawing={true} 
                                      isReversed={drawn.reversed}
                                      index={idx}
                                  />
                                  {revealedCards[idx] && (
                                      <div className={`text-center mt-6 transition-all duration-700 delay-500 opacity-0 animate-slide-in-up`} style={{animationDelay: `500ms`}}>
                                          <h4 className="text-amber-100 font-mystic text-lg md:text-xl lg:text-2xl drop-shadow-md bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                                              {getCardDisplayName(drawn.card)}
                                          </h4>
                                          <div className="flex items-center justify-center gap-2 mt-2">
                                              <span className="h-1px w-4 bg-amber-500/50"></span>
                                              <p className="text-10px text-amber-500/80 uppercase tracking-wider font-semibold">
                                                  {drawn.reversed ? t.reversed : t.upright}
                                              </p>
                                              <span className="h-1px w-4 bg-amber-500/50"></span>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          );
                      })}
                  </div>
                  
                  {isReadingLoading && (
                    <div className="text-center my-8 animate-fade-in">
                      <p className="text-sm font-mystic text-violet-300/80 animate-pulse tracking-widest">{t.loading}</p>
                    </div>
                  )}
              </div>
          )}

          {/* INTRO: Question & Channeling */}
          {step === 'intro' || step === 'channeling' ? (
              <div className={`flex flex-col items-center space-y-10 w-full max-w-lg transition-all duration-700 mt-8 mb-20 ${step === 'intro' || step === 'channeling' ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-20 blur-lg pointer-events-none'}`}>
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
                                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-violet-400/30 text-11px text-zinc-400 hover:text-violet-200 transition-all duration-300 cursor-pointer active:scale-95"
                             >
                                {q}
                             </button>
                          ))}
                      </div>
                  </div>

                  <div className="relative w-64 h-64 flex items-center justify-center">
                       <div className="absolute w-56 h-56 rounded-full border border-violet-500/10 animate-spin-slow-10s"></div>
                       <div className="absolute w-48 h-48 rounded-full border border-amber-500/10 animate-spin-slow-15s-reverse"></div>

                       <div className="absolute w-36 h-36 rotate-neg-90">
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
                              className="transition-all duration-75 ease-linear drop-shadow-violet"
                            />
                          </svg>
                       </div>

                       <button
                         onPointerDown={(e) => { e.stopPropagation(); startChanneling(); }}
                         className="relative w-28 h-28 rounded-full flex items-center justify-center group cursor-pointer select-none outline-none z-10 active:scale-90 transition-transform duration-150"
                         style={{ WebkitTapHighlightColor: 'transparent' }}
                       >
                           <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-800 to-black border border-white/10 shadow-xl shadow-black/50 group-active:scale-95 transition-transform duration-200"></div>
                           <div className={`absolute inset-0 rounded-full bg-violet-600/30 blur-md transition-opacity duration-500 ${step === 'channeling' ? 'opacity-100 scale-110' : 'opacity-0 scale-100'}`}></div>
                           <div className="relative z-10 flex flex-col items-center space-y-1">
                               <SparklesIcon className={`w-8 h-8 text-zinc-400 group-hover:text-amber-200 transition-colors duration-500 ${step === 'channeling' ? 'text-violet-200 animate-pulse' : ''}`} />
                           </div>
                       </button>
                  </div>
                  
                  <p className="text-zinc-500 text-xs font-mystic uppercase tracking-wider animate-pulse text-center">
                      {step === 'channeling' ? t.channeling : t.hold}
                  </p>
              </div>
          ) : null}

      </main>

      {/* READING MODAL */}
      {activeReadingView && reading && (
          <div 
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setActiveReadingView(null)}
              role="dialog"
              aria-modal="true"
              aria-labelledby="reading-title"
          >
              <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="w-full max-w-2xl md:max-w-4xl lg:max-w-5xl animate-slide-in-up touch-auto pointer-events-auto"
              >
                  <div className="relative bg-black/70 backdrop-blur-lg border border-white/10 shadow-2xl shadow-black/70 overflow-hidden flex flex-col group rounded-2xl" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
                      
                      <div className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
                          <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setActiveReadingView('summary')}
                                className={`relative flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-mystic tracking-widest border transition-all duration-300 group
                                  ${activeReadingView === 'summary' 
                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/80 shadow-md shadow-amber-500/20' 
                                    : `bg-white/5 text-zinc-400 border-transparent hover:border-white/20 hover:text-white ${revealedCards.every(Boolean) ? 'animate-pulse-glow' : ''}`
                                  }`
                                }
                              >
                                <SparklesIconSolid className={`w-3.5 h-3.5 transition-colors ${activeReadingView === 'summary' ? 'text-amber-400' : 'text-amber-500'}`} />
                                <span>{t.summary_title}</span>
                              </button>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className={`transition-opacity duration-500 ${activeReadingView === 'summary' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                              <button 
                                  onClick={reset}
                                  className="group relative px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 rounded-full border border-amber-600/80 shadow-lg shadow-black/50 transition-all duration-300 flex items-center space-x-2 active:scale-95"
                              >
                                  <ArrowPathIcon className="w-3 h-3 text-zinc-800 group-hover:rotate-180 transition-transform duration-500" />
                                  <span className="uppercase tracking-widest text-10px font-bold text-zinc-900">{t.consultAgain}</span>
                              </button>
                            </div>
                             <button 
                                onClick={() => setActiveReadingView(null)} 
                                className="text-zinc-500 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                          </div>
                      </div>

                      <div className="relative z-10 overflow-y-auto p-6 reading-panel-content">
                          <>
                              <div className="flex items-center justify-center space-x-3 mb-6">
                                  <div className="h-1px flex-grow bg-gradient-to-r from-transparent to-amber-500/50"></div>
                                  <h3 id="reading-title" className="text-center text-amber-300 font-mystic text-lg tracking-widest whitespace-nowrap">{getReadingTitle()}</h3>
                                  <div className="h-1px flex-grow bg-gradient-to-l from-transparent to-amber-500/50"></div>
                              </div>
                              <div className="prose prose-invert max-w-none pb-4">
                                  <p className="text-zinc-200 font-serif text-justify drop-shadow-md reading-text">
                                      {getCurrentReadingText()}
                                  </p>
                              </div>
                          </>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;
