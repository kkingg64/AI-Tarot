
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
        <div className="absolute inset-0 backface-hidden rounded-xl border-4 border-yellow-600/30 bg-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-2 border border-yellow-600/20 rounded-lg"></div>
          {/* Intricate Pattern (CSS) */}
          <div className="absolute inset-0 opacity-20" 
            style={{
               backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', 
               backgroundSize: '20px 20px'
            }}
          ></div>
          <div className="w-32 h-32 border-2 border-yellow-600/40 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-16 h-16 text-yellow-600/50 animate-pulse" />
          </div>
        </div>

        {/* CARD FRONT */}
        <div 
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] bg-gradient-to-br ${card ? card.colors : 'from-zinc-800 to-zinc-900'}`}
        >
          {/* We remove the heavy overlay text if we have a real image, but keep a subtle border */}
          <div className="absolute inset-2 border border-white/30 rounded-lg overflow-hidden flex items-center justify-center bg-black/20">
             {card?.image ? (
                 <img 
                    src={card.image} 
                    alt={card.name} 
                    className={`w-full h-full object-cover transition-transform duration-1000 ${isReversed ? 'rotate-180' : ''}`}
                    onError={(e) => {
                        // Fallback if image fails
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                 />
             ) : (
                <div className="text-6xl animate-pulse">?</div>
             )}
          </div>
          
          {/* Subtle Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};
