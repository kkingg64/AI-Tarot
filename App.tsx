/**
 * AI Tarot - 全新現代化設計
 * 使用：layout-automation + palette-master + ui-designer + apple-hig
 */

import React, { useState } from 'react';
import { SparklesIcon, GlobeAltIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';

// === 設計系統 (Design Tokens) ===

// 調色板 - Deep Purple & Gold Theme
const COLORS = {
  primary: '#8B5CF6',      // Violet
  primaryDark: '#7C3AED',  // Violet Dark
  accent: '#F59E0B',       // Amber/Gold
  accentPink: '#EC4899',   // Pink
  background: '#0A0A0F',   // Deep Black
  surface: '#121218',      // Card Background
  surfaceLight: '#1A1A24', // Elevated Surface
  text: '#FAFAFA',         // White
  textSecondary: '#A1A1AA', // Gray
  gradient: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  goldGradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
};

// 字體
const FONTS = {
  heading: "'Cinzel', serif",
  body: "'Inter', sans-serif",
};

// === 組件 ===

// 星星背景
const StarBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0F] via-[#121218] to-[#0A0A0F]" />
    {/* 星星效果 - CSS animation handled in index.css */}
    {[...Array(50)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.8 + 0.2,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${Math.random() * 2 + 2}s`,
        }}
      />
    ))}
    {/* Gradient Orbs */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-[128px]" />
  </div>
);

// Premium Badge
const PremiumBadge = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-4 left-4 z-50 flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full text-sm font-bold text-white shadow-lg hover:shadow-amber-500/30 transition-all hover:scale-105 animate-glow"
  >
    <span>💎</span>
    <span>Pro</span>
  </button>
);

// Language Selector
const LanguageSelector = ({ 
  language, 
  setLanguage, 
  showMenu, 
  setShowMenu 
}: { 
  language: string; 
  setLanguage: (lang: string) => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}) => {
  const languages = [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <div className="absolute top-4 right-4 z-50">
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 hover:border-amber-400/50 transition-all"
      >
        <GlobeAltIcon className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-medium text-zinc-300">
          {languages.find(l => l.code === language)?.label}
        </span>
      </button>
      
      {showMenu && (
        <div className="absolute top-full right-0 mt-3 w-36 bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-fade-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { setLanguage(lang.code); setShowMenu(false); }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                language === lang.code 
                  ? 'text-amber-400 bg-white/5' 
                  : 'text-zinc-400 hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hero Section
const HeroSection = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="relative z-10 text-center px-6 pt-16 pb-8">
    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-b from-white via-amber-100 to-amber-400 bg-clip-text text-transparent mb-4 animate-fade-in">
      {title}
      <span className="text-xs md:text-sm text-amber-400/60 ml-2 block md:inline">v3.0</span>
    </h1>
    <p className="text-zinc-400 text-sm tracking-widest uppercase animate-fade-in delay-100">
      {subtitle}
    </p>
  </section>
);

// Spread Selection
const SpreadSelector = ({ 
  selected, 
  onSelect,
  t 
}: { 
  selected: string;
  onSelect: (spread: string) => void;
  t: any;
}) => {
  const spreads = [
    { id: 'single', name: '單牌', icon: '🃏', desc: '快速指引' },
    { id: 'three', name: '三牌', icon: '🔮', desc: '過去·現在·未來' },
    { id: 'celtic', name: '凱爾特', icon: '⚜️', desc: '深入解讀' },
    { id: 'horseshoe', name: '馬蹄鐵', icon: '🧲', desc: '運勢大全' },
  ];

  return (
    <div className="relative z-10 px-6 mb-8 animate-fade-in delay-200">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {spreads.map((spread) => (
          <button
            key={spread.id}
            onClick={() => onSelect(spread.id)}
            className={`flex-shrink-0 p-4 rounded-2xl border-2 transition-all ${
              selected === spread.id
                ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/20'
                : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <span className="text-2xl block mb-1">{spread.icon}</span>
            <span className={`text-sm font-medium block ${
              selected === spread.id ? 'text-amber-400' : 'text-zinc-300'
            }`}>
              {spread.name}
            </span>
            <span className="text-xs text-zinc-500">{spread.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Card Display Area - With Mystery Card Design
const CardArea = ({ 
  onDraw, 
  isDrawing,
  cards
}: { 
  onDraw: () => void; 
  isDrawing: boolean;
  cards: any[];
}) => {
  // Card Back Design - Mysterious Totem
  const CardBack = () => (
    <div className="w-32 h-48 md:w-40 md:h-56 rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20 flex items-center justify-center relative overflow-hidden">
      {/* Mystical pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="mystic" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="rgba(251, 191, 36, 0.3)" />
              <path d="M10 0 L10 20 M0 10 L20 10" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#mystic)" />
        </svg>
      </div>
      {/* Central symbol */}
      <div className="text-5xl opacity-60 z-10">🔮</div>
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 text-amber-400/50 text-xs">⚜</div>
      <div className="absolute top-2 right-2 text-amber-400/50 text-xs rotate-90">⚜</div>
      <div className="absolute bottom-2 left-2 text-amber-400/50 text-xs rotate-180">⚜</div>
      <div className="absolute bottom-2 right-2 text-amber-400/50 text-xs -rotate-90">⚜</div>
    </div>
  );

  // Card Front Design
  const CardFront = ({ card, position }: { card: any; position: string }) => (
    <div className="w-32 h-48 md:w-40 md:h-56 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-amber-400/50 shadow-2xl shadow-amber-500/20 p-4 flex flex-col items-center justify-center">
      <div className="text-5xl mb-3">{card.icon}</div>
      <div className="text-amber-400 font-serif text-lg mb-1">{card.name}</div>
      <div className="text-zinc-500 text-xs uppercase tracking-widest">{position}</div>
      <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-2" />
    </div>
  );

  if (cards.length > 0) {
    return (
      <div className="relative z-10 flex justify-center gap-2 md:gap-4 px-6 py-8">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ rotateY: 0, scale: 0.8, opacity: 0 }}
            animate={{ rotateY: 180, scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.3, type: "spring", stiffness: 100, damping: 20 }}
            style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
          >
            {/* Card Back (shown first) */}
            <motion.div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <CardBack />
            </motion.div>
            {/* Card Front (shown after flip) */}
            <motion.div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <CardFront card={card} position={card.position} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center py-12">
      <button
        onClick={onDraw}
        disabled={isDrawing}
        className={`w-40 h-56 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-dashed border-purple-500/30 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 hover:border-purple-400/50 ${
          isDrawing ? 'animate-pulse' : ''
        }`}
      >
        <SparklesIcon className={`w-12 h-12 text-purple-400 ${isDrawing ? 'animate-spin' : ''}`} />
        <span className="text-sm text-zinc-400">
          {isDrawing ? '宇宙能量聚集中...' : '🔮 開始占卜'}
        </span>
      </button>
    </div>
  );
};

// Question Input
const QuestionInput = ({ 
  value, 
  onChange,
  t 
}: { 
  value: string; 
  onChange: (v: string) => void;
  t: any;
}) => (
  <div className="relative z-10 px-6 py-4 animate-fade-in delay-300">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={t.placeholder || '請專注於你的問題...'}
      className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-zinc-500 focus:border-amber-400/50 focus:outline-none transition-colors resize-none"
      rows={3}
    />
    <div className="flex justify-between items-center mt-2 px-2">
      <span className="text-xs text-zinc-500">{value.length}/200</span>
    </div>
  </div>
);

// Action Button
const ActionButton = ({ 
  onClick, 
  disabled,
  children,
  primary = false
}: { 
  onClick: () => void; 
  disabled?: boolean;
  children: React.ReactNode;
  primary?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all ${
      primary
        ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02]'
        : 'bg-white/10 text-zinc-300 border border-white/10 hover:bg-white/20'
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

// Premium Modal
const PremiumModal = ({ show, onClose }: { show: boolean; onClose: () => void }) => {
  if (!show) return null;

  const features = [
    { icon: '∞', title: '無限占卜', desc: '每日無限次使用' },
    { icon: '📊', title: '詳細解讀', desc: '更深層次意義' },
    { icon: '🎯', title: '追問功能', desc: 'AI 深入分析' },
    { icon: '🔇', title: '無廣告', desc: '純淨體驗' },
  ];

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-black rounded-3xl p-8 border border-amber-500/30 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">💎</span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">
            升級 Pro
          </h2>
          <p className="text-zinc-400 mt-2">解鎖全部功能</p>
        </div>
        
        <div className="space-y-4 mb-8">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-medium text-white">{f.title}</p>
                <p className="text-xs text-zinc-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-zinc-500 line-through mr-2">$9.99</span>
          <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-pink-400 bg-clip-text text-transparent">$4.99</span>
          <span className="text-zinc-500">/月</span>
        </div>
        
        <ActionButton onClick={() => {}} primary>
          立即訂閱
        </ActionButton>
        
        <p className="text-center text-zinc-500 text-xs mt-4">隨時取消 • 無風險試用</p>
      </div>
    </div>
  );
};

// Loading State
const LoadingOverlay = ({ show, message }: { show: boolean; message: string }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-amber-400 animate-pulse">{message}</p>
      </div>
    </div>
  );
};

// Main App Component
const TarotApp = () => {
  const [step, setStep] = useState<'intro' | 'drawing' | 'result'>('intro');
  const [spread, setSpread] = useState('three');
  const [question, setQuestion] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [showPremium, setShowPremium] = useState(false);
  const [language, setLanguage] = useState('zh-TW');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const t = {
    'zh-TW': {
      title: '🔮 智能塔羅牌',
      subtitle: '未來之鏡',
      placeholder: '請專注於你的問題...',
      draw: '開始占卜',
      reading: '解讀中...',
    },
    'en': {
      title: '🔮 AI Tarot',
      subtitle: 'Mirror of Destiny',
      placeholder: 'Focus on your question...',
      draw: 'Start Reading',
      reading: 'Reading...',
    },
    'ja': {
      title: '🔮 AI タロット',
      subtitle: '運命の鏡',
      placeholder: '質問に集中してください...',
      draw: '占う',
      reading: '解釈中...',
    },
  }[language] || t['zh-TW'];

  const handleDraw = () => {
    console.log('Drawing cards...');
    setIsDrawing(true);
    
    // Use setTimeout to simulate reading
    setTimeout(() => {
      const newCards = [
        { icon: '🌟', name: '愚者 (The Fool)', position: '過去' },
        { icon: '💕', name: '戀人 (The Lovers)', position: '現在' },
        { icon: '🌙', name: '月亮 (The Moon)', position: '未來' },
      ];
      
      console.log('Setting cards:', newCards);
      setCards(newCards);
      setIsDrawing(false);
      setStep('result');
      console.log('Done - cards:', newCards.length);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <StarBackground />
      
      <PremiumBadge onClick={() => setShowPremium(true)} />
      
      <LanguageSelector 
        language={language} 
        setLanguage={setLanguage}
        showMenu={showLangMenu}
        setShowMenu={setShowLangMenu}
      />
      
      <HeroSection title={t.title} subtitle={t.subtitle} />
      
      {step === 'intro' && (
        <>
          <SpreadSelector 
            selected={spread} 
            onSelect={setSpread}
            t={t}
          />
          
          <CardArea 
            onDraw={handleDraw} 
            isDrawing={isDrawing}
            cards={cards}
          />
          
          <QuestionInput 
            value={question}
            onChange={setQuestion}
            t={t}
          />
          
          <div className="relative z-10 px-6 pb-8">
            <ActionButton onClick={handleDraw} primary disabled={isDrawing}>
              {isDrawing ? t.reading : t.draw}
            </ActionButton>
          </div>
        </>
      )}
      
      {step === 'result' && (
        <div className="relative z-10 px-6 py-8 animate-fade-in">
          <CardArea onDraw={() => {}} isDrawing={false} cards={cards} />
          
          <div className="mt-8 space-y-4">
            <ActionButton onClick={() => setStep('intro')} primary>
              🔄 重新占卜
            </ActionButton>
          </div>
        </div>
      )}
      
      <PremiumModal show={showPremium} onClose={() => setShowPremium(false)} />
      <LoadingOverlay show={isDrawing} message={t.reading} />
    </div>
  );
};

export default TarotApp;
