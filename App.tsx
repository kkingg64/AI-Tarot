/**
 * AI Tarot - 全新規範設計提案
 * 使用技能: layout-automation + palette-master + vector-forge + framer-motion-master + apple-hig
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TAROT_DECK, POSITIONS, drawCards, generateReading } from './tarotData';

// ===========================
// 調色板 - Mystical Purple & Gold
// ===========================
const THEME = {
  colors: {
    primary: '#8B5CF6',      // Violet
    primaryDark: '#7C3AED',
    accent: '#F59E0B',       // Gold/Amber
    accentGlow: '#FBBF24',
    pink: '#EC4899',
    background: '#0A0A0F',   // Deep Black
    surface: '#121218',      // Card bg
    surfaceLight: '#1E1E2A',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
    border: 'rgba(255,255,255,0.1)',
  },
  gradients: {
    card: 'linear-gradient(135deg, #1E1E2A 0%, #121218 100%)',
    gold: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  },
  shadows: {
    card: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.2)',
    glow: '0 0 40px rgba(245, 158, 11, 0.3)',
  }
};

// ===========================
// 動畫 Variants
// ===========================
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardFlip = {
  initial: { rotateY: 0, scale: 0.9, opacity: 0 },
  flipped: { 
    rotateY: 180, 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.8, type: "spring", stiffness: 100 }
  }
};

// ===========================
// 星星背景組件
// ===========================
const StarField = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#121218] to-[#0A0A0F]" />
    {/* 動態星星 */}
    {[...Array(60)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
    {/* 發光球體 */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-600/10 rounded-full blur-[96px]" />
  </div>
);

// ===========================
// 神秘卡牌背設計
// ===========================
const CardBack = () => (
  <div 
    className="w-full h-full rounded-2xl"
    style={{
      background: 'linear-gradient(135deg, #1E1E2A 0%, #0A0A0F 100%)',
      border: '2px solid rgba(245, 158, 11, 0.3)',
      boxShadow: THEME.shadows.card,
    }}
  >
    {/* 神秘圖騰 */}
    <div className="absolute inset-0 opacity-20">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <pattern id="mystic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="rgba(251, 191, 36, 0.4)" />
            <path d="M10 0v20M0 10h20" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#mystic-pattern)" />
      </svg>
    </div>
    
    {/* 中央符號 */}
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="text-6xl opacity-40">✦</span>
    </div>
    
    {/* 角落裝飾 */}
    {['⚜', '⚜', '⚜', '⚜'].map((symbol, i) => (
      <span 
        key={i}
        className="absolute text-amber-500/40 text-lg"
        style={{
          top: i < 2 ? '8px' : 'auto',
          bottom: i >= 2 ? '8px' : 'auto',
          left: i % 2 === 0 ? '8px' : 'auto',
          right: i % 2 === 1 ? '8px' : 'auto',
          transform: i === 2 ? 'rotate(180deg)' : i === 3 ? 'rotate(-90deg)' : i === 1 ? 'rotate(90deg)' : 'none',
        }}
      >
        {symbol}
      </span>
    ))}
  </div>
);

// ===========================
// 卡牌正面
// ===========================
const CardFront = ({ card }: { card: { icon: string; name: string; position: string } }) => (
  <div 
    className="w-full h-full rounded-2xl p-4 flex flex-col items-center justify-center"
    style={{
      background: 'linear-gradient(180deg, #1E1E2A 0%, #121218 100%)',
      border: '2px solid rgba(245, 158, 11, 0.5)',
      boxShadow: THEME.shadows.card,
    }}
  >
    <span className="text-5xl mb-3">{card.icon}</span>
    <span 
      className="text-lg font-medium text-center"
      style={{ 
        fontFamily: 'Cinzel, serif',
        color: THEME.colors.accent 
      }}
    >
      {card.name}
    </span>
    <span className="text-xs uppercase tracking-widest text-gray-500 mt-2">
      {card.position}
    </span>
    <div className="w-16 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-3" />
  </div>
);

// ===========================
// 3D 翻轉卡牌
// ===========================
const TarotCard3D = ({ card, position, isFlipped, delay }: { 
  card: { icon: string; name: string }; 
  position: string; 
  isFlipped: boolean;
  delay: number;
}) => (
  <div className="relative w-32 h-48 md:w-40 md:h-56" style={{ perspective: '1000px' }}>
    <motion.div
      className="w-full h-full relative"
      initial={{ rotateY: 0, scale: 0.8, opacity: 0 }}
      animate={{ 
        rotateY: isFlipped ? 180 : 0, 
        scale: 1, 
        opacity: 1 
      }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* 背面 */}
      <div 
        className="absolute inset-0 backface-hidden"
        style={{ transform: 'rotateY(0deg)' }}
      >
        <CardBack />
      </div>
      
      {/* 正面 (翻轉後顯示) */}
      <div 
        className="absolute inset-0 backface-hidden"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <CardFront card={card} position={position} />
      </div>
    </motion.div>
  </div>
);

// ===========================
// Step Indicator Component
// ===========================
const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center gap-2 mb-8">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-2">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              i + 1 < currentStep 
                ? 'bg-green-500 text-white' 
                : i + 1 === currentStep 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-gray-500'
            }`}
          >
            {i + 1 < currentStep ? '✓' : i + 1}
          </div>
          <span className={`text-sm ${i + 1 === currentStep ? 'text-white' : 'text-gray-500'}`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-8 h-px ${i + 1 < currentStep ? 'bg-green-500' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);
const PremiumBadge = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="absolute top-4 left-4 z-50 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
    style={{
      background: THEME.gradients.gold,
      boxShadow: THEME.shadows.glow,
    }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>💎</span>
    <span>Pro</span>
  </motion.button>
);

// ===========================
// 語言選擇器
// ===========================
const LanguageSelector = ({ 
  language, 
  setLanguage,
  isOpen,
  setIsOpen 
}: { 
  language: string; 
  setLanguage: (lang: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const languages = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <div className="absolute top-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border"
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ borderColor: 'rgba(245,158,11,0.5)' }}
      >
        <span className="text-amber-400 text-lg">🌐</span>
        <span className="text-xs text-gray-300">
          {languages.find(l => l.code === language)?.label}
        </span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-3 w-36 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(0,0,0,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setIsOpen(false); }}
                className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                  language === lang.code 
                    ? 'text-amber-400 bg-white/5' 
                    : 'text-gray-400 hover:bg-white/5'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ===========================
// 主應用
// ===========================
const TarotApp = () => {
  const [step, setStep] = useState<'welcome' | 'spread' | 'question' | 'drawing' | 'result'>('welcome');
  const [spread, setSpread] = useState('three');
  const [question, setQuestion] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [reading, setReading] = useState<any>(null);
  const [showPremium, setShowPremium] = useState(false);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const steps = {
    'zh-TW': ['歡迎', '選擇牌陣', '專注問題', '抽牌', '解讀結果'],
    'en': ['Welcome', 'Select Spread', 'Focus Question', 'Draw Cards', 'Reading'],
    'ja': ['ようこそ', 'スプレッド選択', '質問に集中', 'カードを引く', '解釈'],
  };

  const titles = {
    'zh-TW': { title: '智能塔羅牌', subtitle: '未來之鏡' },
    'en': { title: 'AI Tarot', subtitle: 'Mirror of Destiny' },
    'ja': { title: 'AI タロット', subtitle: '運命の鏡' },
  };

  const spreads = [
    { id: 'single', name: '單牌', icon: '🃏', desc: '快速指引' },
    { id: 'three', name: '三牌', icon: '🔮', desc: '過去·現在·未來' },
    { id: 'celtic', name: '凱爾特', icon: '⚜️', desc: '深入解讀' },
    { id: 'horseshoe', name: '馬蹄鐵', icon: '🧲', desc: '運勢大全' },
  ];

  const stepTitles = {
    'zh-TW': ['歡迎使用', '選擇牌陣', '專注你的問題', '宇宙能量匯聚', '解讀結果'],
    'en': ['Welcome', 'Choose Your Spread', 'Focus Your Question', 'Universe Energy', 'Your Reading'],
    'ja': ['ようこそ', 'スプレッド選択', '質問に集中', '宇宙エネルギー', '解釈結果'],
  };

  const t = titles[language as keyof typeof titles] || titles['zh-TW'];
  const currentSteps = steps[language as keyof typeof steps] || steps['zh-TW'];
  const currentStepTitles = stepTitles[language as keyof typeof stepTitles] || stepTitles['zh-TW'];

  const stepIndex = { 'welcome': 0, 'spread': 1, 'question': 2, 'drawing': 3, 'result': 4 };
  const currentStepNum = stepIndex[step] + 1;

  const handleNext = () => {
    const order = ['welcome', 'spread', 'question', 'drawing', 'result'];
    const currentIdx = order.indexOf(step);
    if (currentIdx < order.length - 1) {
      setStep(order[currentIdx + 1] as typeof step);
    }
  };

  const handleDraw = () => {
    setStep('drawing');
    setIsDrawing(true);
    
    // 使用本地塔羅牌數據抽牌
    setTimeout(() => {
      const drawnCards = drawCards(3); // 抽3張牌
      const reading = generateReading(drawnCards, question || '你的命運', language);
      
      console.log('Draw result:', drawnCards);
      console.log('Reading:', reading);
      
      setCards(reading.cards);
      setReading(reading);
      setIsDrawing(false);
      setStep('result');
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StarField />
      
      <PremiumBadge onClick={() => setShowPremium(true)} />
      <LanguageSelector 
        language={language} 
        setLanguage={setLanguage}
        isOpen={showLangMenu}
        setIsOpen={setShowLangMenu}
      />
      
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStepNum} steps={currentSteps} />

      {/* Step Title */}
      <motion.h2
        key={step}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8"
        style={{ fontFamily: 'Cinzel, serif', color: '#F59E0B' }}
      >
        {currentStepTitles[stepIndex[step]]}
      </motion.h2>

      {/* Welcome Step */}
      {step === 'welcome' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-6 pb-12 text-center"
        >
          <div className="text-8xl mb-6 animate-float">🔮</div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {language === 'zh-TW' 
              ? '歡迎來到未來之鏡。準備好探索你的命運了嗎？'
              : 'Welcome to the Mirror of Destiny. Are you ready to explore your fate?'}
          </p>
          <motion.button
            onClick={handleNext}
            className="px-12 py-4 rounded-2xl font-bold text-lg"
            style={{
              background: THEME.gradients.gold,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            開始占卜 →
          </motion.button>
        </motion.div>
      )}

      {/* Spread Selection Step */}
      {step === 'spread' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-6 pb-12"
        >
          <div className="flex gap-3 overflow-x-auto pb-4 justify-center">
            {spreads.map((s) => (
              <motion.button
                key={s.id}
                onClick={() => setSpread(s.id)}
                className={`flex-shrink-0 p-5 rounded-2xl text-center transition-all min-w-[140px] ${
                  spread === s.id ? 'border-2' : 'border border-white/5'
                }`}
                style={{
                  background: spread === s.id ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                  borderColor: spread === s.id ? '#F59E0B' : 'rgba(255,255,255,0.05)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-3xl block mb-2">{s.icon}</span>
                <span className={`text-sm font-medium block ${
                  spread === s.id ? 'text-amber-400' : 'text-gray-300'
                }`}>
                  {s.name}
                </span>
                <span className="text-xs text-gray-500">{s.desc}</span>
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={handleNext}
            className="w-full max-w-md mx-auto mt-8 py-4 rounded-2xl font-bold text-lg block"
            style={{
              background: THEME.gradients.gold,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            下一步 →
          </motion.button>
        </motion.div>
      )}

      {/* Question Step */}
      {step === 'question' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 px-6 pb-12"
        >
          <div className="max-w-md mx-auto">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
              placeholder={language === 'zh-TW' ? '請專注於你的問題...\n例如：我的事業發展如何？' : 'Focus on your question...'}
              className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none"
              style={{ background: 'rgba(255,255,255,0.02)' }}
              rows={5}
            />
            <div className="text-right text-xs text-gray-500 mt-2">
              {question.length}/200
            </div>
            <motion.button
              onClick={handleDraw}
              className="w-full mt-8 py-4 rounded-2xl font-bold text-lg"
              style={{
                background: THEME.gradients.gold,
                boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔮 開始抽牌
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Drawing Step */}
      {step === 'drawing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative z-10 flex flex-col items-center justify-center py-16"
        >
          <div className="text-8xl mb-8 animate-pulse">✦</div>
          <p className="text-amber-400 text-lg mb-4">
            {language === 'zh-TW' ? '宇宙能量正在匯聚...' : 'Universe energy is gathering...'}
          </p>
          <div className="flex gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-20 h-32 rounded-xl border-2 border-amber-500/30"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Card Area - Only show in spread/result */}
      {step === 'spread' && (
        <div className="relative z-10 flex justify-center gap-4 px-6 py-4">
          <motion.button
            className="w-40 h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3"
            style={{
              borderColor: 'rgba(139, 92, 246, 0.3)',
              background: 'rgba(139, 92, 246, 0.05)',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-4xl">🔮</span>
            <span className="text-sm text-gray-400">預覽牌陣</span>
          </motion.button>
        </div>
      )}

      {/* Result Step */}
      {step === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Cards */}
          <div className="relative z-10 flex justify-center gap-4 px-6 py-8 flex-wrap">
            {cards.map((card, i) => (
              <TarotCard3D
                key={i}
                card={card.card}
                position={card.positionName}
                isFlipped={true}
                delay={i * 0.3}
              />
            ))}
          </div>
          
          {/* Reading Content */}
          {reading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="relative z-10 px-6 pb-6"
            >
              {/* Question */}
              <div className="text-center mb-6">
                <p className="text-gray-400 text-sm">你的問題</p>
                <p className="text-white text-lg font-medium">{reading.question}</p>
              </div>
              
              {/* Detailed Reading */}
              <div className="max-w-2xl mx-auto space-y-6">
                {reading.cards.map((item: any, i: number) => (
                  <div 
                    key={i}
                    className="rounded-2xl p-5 border"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{item.card.icon}</span>
                      <div>
                        <h3 className="text-amber-400 font-cinzel font-bold">
                          {item.card.name} - {item.positionName}
                        </h3>
                        <p className="text-xs text-gray-500">{item.card.nameEn}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {item.angle}
                    </p>
                    <p className="text-gray-400 text-sm mt-2 italic">
                      💫 {item.meaning}
                    </p>
                  </div>
                ))}
                
                {/* Summary */}
                <div 
                  className="rounded-2xl p-5 border text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <p className="text-amber-400 font-cinzel mb-2">✨ 綜合建議</p>
                  <p className="text-gray-300 text-sm">{reading.summary}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Reset Button */}
          <div className="relative z-10 px-6 pb-12">
            <motion.button
              onClick={() => { setStep('welcome'); setCards([]); setReading(null); }}
              className="w-full max-w-md mx-auto py-4 rounded-2xl font-bold text-lg block"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              whileHover={{ background: 'rgba(255,255,255,0.15)' }}
            >
              🔄 重新占卜
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremium && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setShowPremium(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl p-8"
              style={{
                background: 'linear-gradient(180deg, #1E1E2A 0%, #0A0A0F 100%)',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPremium(false)}
                className="absolute top-4 right-4 text-gray-500"
              >
                ✕
              </button>
              
              <div className="text-center mb-8">
                <span className="text-6xl block mb-4">💎</span>
                <h2 
                  className="text-2xl font-bold"
                  style={{
                    background: THEME.gradients.gold,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  升級 Pro
                </h2>
                <p className="text-gray-500 mt-2">解鎖全部功能</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: '∞', title: '無限占卜', desc: '每日無限次使用' },
                  { icon: '📊', title: '詳細解讀', desc: '更深層次意義' },
                  { icon: '🎯', title: '追問功能', desc: 'AI 深入分析' },
                  { icon: '🔇', title: '無廣告', desc: '純淨體驗' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-2xl">{f.icon}</span>
                    <div>
                      <p className="font-medium text-white">{f.title}</p>
                      <p className="text-xs text-gray-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mb-6">
                <span className="text-2xl text-gray-500 line-through mr-2">$9.99</span>
                <span 
                  className="text-4xl font-bold"
                  style={{
                    background: THEME.gradients.gold,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  $4.99
                </span>
                <span className="text-gray-500">/月</span>
              </div>
              
              <motion.button
                className="w-full py-4 rounded-2xl font-bold text-white"
                style={{ background: THEME.gradients.gold }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                立即訂閱
              </motion.button>
              
              <p className="text-center text-gray-500 text-xs mt-4">隨時取消 • 無風險試用</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TarotApp;
