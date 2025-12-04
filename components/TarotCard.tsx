
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SparklesIcon } from '@heroicons/react/24/solid';

export interface CardData {
  name: string;
  image: string;
  colors: string;
  desc: string;
  zhName?: string;
}

interface TarotCardProps {
  card: CardData | null;
  isRevealed: boolean;
  isDrawing: boolean;
  isReversed?: boolean;
  displayName?: string;
}

export const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed, isDrawing, isReversed, displayName }) => {
  return (
    <div className={`perspective-1000 w-64 h-96 sm:w-80 sm:h-[28rem] transition-all duration-[1500ms] ${isDrawing ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div 
        className={`relative w-full h-full duration-[1500ms] transform-style-3d transition-transform ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* CARD BACK */}
        <div className="absolute inset-0 backface-hidden rounded-xl border-2 border-yellow-600/50 bg-zinc-950 shadow-2xl overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-2 border border-yellow-600/30 rounded-lg"></div>
          {/* Intricate Back Pattern */}
          <div className="absolute inset-0 opacity-10" 
            style={{
               backgroundImage: 'repeating-linear-gradient(45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 50%)', 
               backgroundSize: '20px 20px'
            }}
          ></div>
           <div className="absolute inset-0 opacity-10" 
            style={{
               backgroundImage: 'repeating-linear-gradient(-45deg, #fbbf24 0, #fbbf24 1px, transparent 0, transparent 50%)', 
               backgroundSize: '20px 20px'
            }}
          ></div>
          <div className="w-24 h-24 border border-yellow-600/60 rounded-full flex items-center justify-center bg-zinc-900 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
            <SparklesIcon className="w-12 h-12 text-yellow-500/80 animate-pulse" />
          </div>
        </div>

        {/* CARD FRONT */}
        <div 
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] bg-zinc-900 border-4 border-zinc-800`}
        >
          {card?.image ? (
               <div className={`w-full h-full relative ${isReversed ? 'rotate-180' : ''}`}>
                 <img 
                    src={card.image} 
                    alt={card.name} 
                    className="w-full h-full object-fill"
                    onError={(e) => {
                        // Fallback if image fails
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x600/18181b/fbbf24?text=" + encodeURIComponent(card.name);
                    }}
                 />
               </div>
           ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-yellow-500">
                  <span className="animate-pulse">Loading...</span>
              </div>
           )}
          
          {/* Gloss/Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};
