import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Card back design - Mysterious Totem Pattern
const CardBack = () => (
  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden relative">
    {/* Mystical pattern overlay */}
    <div className="absolute inset-0 opacity-30">
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
    {/* Central mystical symbol */}
    <div className="text-6xl opacity-60">🔮</div>
    {/* Corner decorations */}
    <div className="absolute top-2 left-2 text-amber-400/50 text-xs">⚜</div>
    <div className="absolute top-2 right-2 text-amber-400/50 text-xs">⚜</div>
    <div className="absolute bottom-2 left-2 text-amber-400/50 text-xs">⚜</div>
    <div className="absolute bottom-2 right-2 text-amber-400/50 text-xs">⚜</div>
  </div>
);

// Card front with interpretation
const CardFront = ({ card, position }: { card: any; position: string }) => (
  <div className="w-full h-full rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-amber-400/50 p-4 flex flex-col items-center justify-center text-center">
    {/* Card icon */}
    <div className="text-5xl mb-3">{card.icon}</div>
    {/* Card name */}
    <div className="text-amber-400 font-serif text-lg mb-2">{card.name}</div>
    {/* Position */}
    <div className="text-zinc-500 text-xs uppercase tracking-widest">{position}</div>
    {/* Decorative line */}
    <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-2" />
  </div>
);

// Main Tarot Card Component with 3D flip
interface TarotCardProps {
  card: any;
  position: string;
  isFlipped: boolean;
  delay: number;
}

export const TarotCard: React.FC<TarotCardProps> = ({ card, position, isFlipped, delay }) => {
  return (
    <div className="relative w-32 h-48 md:w-40 md:h-56 perspective-1000">
      <motion.div
        className="w-full h-full relative preserve-3d"
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
        {/* Card Back - Front side when not flipped */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ transform: 'rotateY(0deg)' }}
        >
          <CardBack />
        </div>
        
        {/* Card Front - Back side when flipped */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <CardFront card={card} position={position} />
        </div>
      </motion.div>
    </div>
  );
};

// Card Spread Display
interface CardSpreadProps {
  cards: any[];
  isDrawing: boolean;
}

export const CardSpread: React.FC<CardSpreadProps> = ({ cards, isDrawing }) => {
  if (cards.length === 0) {
    return (
      <div className="flex justify-center py-12">
        {/* Hidden card backs waiting to be drawn */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-32 h-48 md:w-40 md:h-56 mx-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 border-2 border-amber-500/30 flex items-center justify-center">
              <div className="text-amber-400/50 text-4xl">?</div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 md:gap-4 py-8">
      <AnimatePresence>
        {cards.map((card, index) => (
          <TarotCard
            key={index}
            card={card}
            position={card.position}
            isFlipped={true}
            delay={index * 0.3}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TarotCard;
