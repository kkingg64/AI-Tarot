/**
 * AI Tarot - Local Tarot Reading API
 * 使用本地牌義數據庫 + 真實 Rider-Waite Smith 卡牌圖片
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TAROT_DECK, POSITIONS, drawCards, generateReading } from './tarotData';

// ===========================
// 設計系統 (Design Tokens)
// ===========================
const THEME = {
  colors: {
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    accent: '#F59E0B',
    accentGlow: '#FBBF24',
    pink: '#EC4899',
    background: '#0A0A0F',
    surface: '#121218',
    surfaceLight: '#1E1E2A',
    text: '#FAFAFA',
    textMuted: '#A1A1AA',
  },
  gradients: {
    gold: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
  },
  shadows: {
    card: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 92, 246, 0.2)',
    glow: '0 0 40px rgba(245, 158, 11, 0.3)',
  }
};

// ===========================
// 星星背景
// ===========================
const StarField = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#121218] to-[#0A0A0F]" />
    {[...Array(40)].map((_, i) => (
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
    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px]" />
  </div>
);

// ===========================
// Step Indicator
// ===========================
const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
    {steps.map((step, i) => (
      <React.Fragment key={i}>
        <div className="flex items-center gap-2">
          <div 
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i + 1 < currentStep 
                ? 'bg-green-500 text-white' 
                : i + 1 === currentStep 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/10 text-gray-500'
            }`}
          >
            {i + 1 < currentStep ? '✓' : i + 1}
          </div>
          <span className={`text-xs ${i + 1 === currentStep ? 'text-white' : 'text-gray-500'}`}>
            {step}
          </span>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-6 h-px ${i + 1 < currentStep ? 'bg-green-500' : 'bg-white/10'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ===========================
// 3D 翻轉卡牌 - 使用真實圖片
// ===========================
const TarotCard3D = ({ card, position, isFlipped, delay }: { 
  card: any; 
  position: string; 
  isFlipped: boolean;
  delay: number;
}) => (
  <div className="relative w-28 h-40 md:w-32 md:h-48 flex-shrink-0" style={{ perspective: '1000px' }}>
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
        className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
        style={{ transform: 'rotateY(0deg)' }}
      >
        <div 
          className="w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #1E1E2A 0%, #0A0A0F 100%)',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: THEME.shadows.card,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-30">✦</span>
          </div>
        </div>
      </div>
      
      {/* 正面 - 真實卡牌圖片 */}
      <div 
        className="absolute inset-0 rounded-xl overflow-hidden backface-hidden"
        style={{ transform: 'rotateY(180deg)' }}
      >
        <img 
          src={card.image} 
          alt={card.name}
          className="w-full h-full object-cover"
          style={{
            border: '2px solid rgba(245, 158, 11, 0.6)',
            boxShadow: THEME.shadows.card,
          }}
        />
      </div>
    </motion.div>
  </div>
);

// ===========================
// Premium Badge
// ===========================
const PremiumBadge = ({ onClick }: { onClick: () => void }) => (
  <motion.button
    onClick={onClick}
    className="fixed top-4 left-4 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
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
  ];

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderColor: 'rgba(255,255,255,0.1)',
        }}
        whileHover={{ borderColor: 'rgba(245,158,11,0.5)' }}
      >
        <span className="text-amber-400">🌐</span>
        <span className="text-gray-300">
          {languages.find(l => l.code === language)?.label}
        </span>
      </motion.button>
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
    'en': ['Welcome', 'Select Spread', 'Focus', 'Draw', 'Reading'],
  };

  const titles = {
    'zh-TW': { title: '智能塔羅牌', subtitle: '未來之鏡' },
    'en': { title: 'AI Tarot', subtitle: 'Mirror of Destiny' },
  };

  const spreads = [
    { id: 'single', name: '單牌', icon: '🃏', desc: '快速指引' },
    { id: 'three', name: '三牌', icon: '🔮', desc: '過去·現在·未來' },
  ];

  const stepTitles = {
    'zh-TW': ['歡迎使用', '選擇牌陣', '專注你的問題', '宇宙能量匯聚', '解讀結果'],
    'en': ['Welcome', 'Choose Spread', 'Focus Question', 'Energy Gathering', 'Your Reading'],
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
    
    setTimeout(() => {
      const drawnCards = drawCards(3);
      const reading = generateReading(drawnCards, question || '你的命運', language);
      
      setCards(reading.cards);
      setReading(reading);
      setIsDrawing(false);
      setStep('result');
    }, 3000);
  };

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden" style={{ background: '#0A0A0F', minHeight: '100vh' }}>
      <StarField />
      
      <PremiumBadge onClick={() => setShowPremium(true)} />
      <LanguageSelector 
        language={language} 
        setLanguage={setLanguage}
        isOpen={showLangMenu}
        setIsOpen={setShowLangMenu}
      />
      
      {/* Fixed Header Space */}
      <div className="h-16" />
      
      {/* Step Indicator */}
      <StepIndicator currentStep={currentStepNum} steps={currentSteps} />

      {/* Step Title */}
      <motion.h2
        key={step}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl md:text-2xl font-bold text-center mb-4"
        style={{ fontFamily: 'Cinzel, serif', color: '#F59E0B' }}
      >
        {currentStepTitles[stepIndex[step]]}
      </motion.h2>

      {/* Welcome Step */}
      {step === 'welcome' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-8 text-center"
        >
          {/* Main Title */}
          <h1 
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ fontFamily: 'Cinzel, serif', background: 'linear-gradient(180deg, #FAFAFA 0%, #FBBF24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {t.title}
            <span className="text-xs ml-2 text-amber-400/60 align-top">v3.0</span>
          </h1>
          <p className="text-gray-500 text-xs mb-6 tracking-widest">{t.subtitle}</p>
          
          <div className="text-6xl mb-4 animate-pulse">🔮</div>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
            {language === 'zh-TW' 
              ? '歡迎來到未來之鏡。準備好探索你的命運了嗎？'
              : 'Welcome to the Mirror of Destiny.'}
          </p>
          <button
            onClick={handleNext}
            className="px-8 py-3 rounded-xl font-bold text-sm"
            style={{
              background: THEME.gradients.gold,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            }}
          >
            開始占卜 →
          </button>
        </motion.div>
      )}

      {/* Spread Selection */}
      {step === 'spread' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-8"
        >
          <div className="flex justify-center gap-3 mb-6">
            {spreads.map((s) => (
              <button
                key={s.id}
                onClick={() => setSpread(s.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  spread === s.id ? 'border-2' : 'border border-white/5'
                }`}
                style={{
                  background: spread === s.id ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.02)',
                  borderColor: spread === s.id ? '#F59E0B' : 'rgba(255,255,255,0.05)',
                  minWidth: '120px',
                }}
              >
                <span className="text-2xl block mb-1">{s.icon}</span>
                <span className={`text-sm font-medium block ${
                  spread === s.id ? 'text-amber-400' : 'text-gray-300'
                }`}>
                  {s.name}
                </span>
                <span className="text-xs text-gray-500">{s.desc}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="w-full max-w-sm mx-auto py-3 rounded-xl font-bold text-sm block"
            style={{
              background: THEME.gradients.gold,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            }}
          >
            下一步 →
          </button>
        </motion.div>
      )}

      {/* Question Step */}
      {step === 'question' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-8"
        >
          <div className="max-w-sm mx-auto mb-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 200))}
              placeholder={language === 'zh-TW' ? '請專注於你的問題...' : 'Focus on your question...'}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 resize-none text-sm"
              rows={4}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {question.length}/200
            </div>
          </div>
          <button
            onClick={handleDraw}
            className="w-full max-w-sm mx-auto py-3 rounded-xl font-bold text-sm"
            style={{
              background: THEME.gradients.gold,
              boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
            }}
          >
            🔮 開始抽牌
          </button>
        </motion.div>
      )}

      {/* Drawing Step */}
      {step === 'drawing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <div className="text-6xl mb-6 animate-pulse">✦</div>
          <p className="text-amber-400 text-sm mb-4">
            {language === 'zh-TW' ? '宇宙能量正在匯聚...' : 'Universe energy is gathering...'}
          </p>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-12 h-20 rounded-lg border border-amber-500/30"
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

      {/* Result Step */}
      {step === 'result' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Cards */}
          <div className="flex justify-center gap-2 px-4 py-4 flex-wrap">
            {cards.map((item: any, i: number) => (
              <TarotCard3D
                key={i}
                card={item.card}
                position={item.positionName}
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
              className="px-4 pb-6"
            >
              {/* Question */}
              <div className="text-center mb-4">
                <p className="text-gray-500 text-xs">你的問題</p>
                <p className="text-white text-sm">{reading.question}</p>
              </div>
              
              {/* Detailed Reading */}
              <div className="max-w-md mx-auto space-y-3">
                {reading.cards.map((item: any, i: number) => (
                  <div 
                    key={i}
                    className="rounded-xl p-3 border"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      borderColor: 'rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img 
                        src={item.card.image} 
                        alt={item.card.name}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div>
                        <h3 className="text-amber-400 text-sm font-bold">
                          {item.card.name}
                        </h3>
                        <p className="text-gray-500 text-xs">{item.positionName}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                ))}
                
                {/* Summary */}
                <div 
                  className="rounded-xl p-3 border text-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(139,92,246,0.1) 100%)',
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <p className="text-amber-400 text-xs mb-1">✨ 綜合建議</p>
                  <p className="text-gray-300 text-xs">{reading.summary}</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Reset Button */}
          <div className="px-4 pb-8">
            <button
              onClick={() => { setStep('welcome'); setCards([]); setReading(null); }}
              className="w-full max-w-sm mx-auto py-3 rounded-xl font-bold text-sm block"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              🔄 重新占卜
            </button>
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
              className="w-full max-w-xs rounded-2xl p-6"
              style={{
                background: 'linear-gradient(180deg, #1E1E2A 0%, #0A0A0F 100%)',
                border: '1px solid rgba(245,158,11,0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPremium(false)}
                className="absolute top-3 right-3 text-gray-500 text-lg"
              >
                ✕
              </button>
              
              <div className="text-center mb-6">
                <span className="text-5xl block mb-2">💎</span>
                <h2 className="text-xl font-bold gold-gradient bg-clip-text text-transparent">
                  升級 Pro
                </h2>
              </div>
              
              <button
                className="w-full py-3 rounded-xl font-bold text-white text-sm"
                style={{ background: THEME.gradients.gold }}
              >
                立即訂閱
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Bottom padding for mobile */}
      <div className="h-8" />
    </div>
  );
};

export default TarotApp;
