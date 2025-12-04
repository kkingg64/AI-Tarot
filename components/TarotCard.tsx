
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
  SparklesIcon, 
  SunIcon, 
  MoonIcon, 
  StarIcon, 
  HeartIcon, 
  FireIcon, 
  BeakerIcon, 
  ScaleIcon, 
  BoltIcon, 
  GlobeAsiaAustraliaIcon 
} from '@heroicons/react/24/solid';

export interface CardData {
  name: string;
  id: string; // "0", "I", "II" or "1", "2"...
  colors: string;
  type: 'major' | 'minor';
  suit?: string;
  iconType: string;
  zhName?: string;
}

interface TarotCardProps {
  card: CardData | null;
  isRevealed: boolean;
  isDrawing: boolean;
  isReversed?: boolean;
}

const getIcon = (iconType: string) => {
  const props = { className: "w-16 h-16 sm:w-24 sm:h-24 text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" };
  switch(iconType) {
    case 'sun': return <SunIcon {...props} className={props.className + " text-yellow-200"} />;
    case 'moon': return <MoonIcon {...props} className={props.className + " text-cyan-200"} />;
    case 'star': return <StarIcon {...props} className={props.className + " text-purple-200"} />;
    case 'heart': return <HeartIcon {...props} className={props.className + " text-rose-300"} />;
    case 'fire': return <FireIcon {...props} className={props.className + " text-orange-400"} />;
    case 'water': return <BeakerIcon {...props} className={props.className + " text-blue-400"} />;
    case 'air': return <SparklesIcon {...props} className={props.className + " text-sky-200"} />;
    case 'earth': return <GlobeAsiaAustraliaIcon {...props} className={props.className + " text-emerald-400"} />;
    case 'balance': return <ScaleIcon {...props} className={props.className + " text-zinc-200"} />;
    case 'flash': return <BoltIcon {...props} className={props.className + " text-yellow-400"} />;
    default: return <SparklesIcon {...props} />;
  }
};

export const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed, isDrawing, isReversed }) => {
  return (
    <div className={`perspective-1000 w-64 h-96 sm:w-80 sm:h-[28rem] transition-all duration-[1500ms] ${isDrawing ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <div 
        className={`relative w-full h-full duration-[1500ms] transform-style-3d transition-transform ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* CARD BACK */}
        <div className="absolute inset-0 backface-hidden rounded-2xl border border-yellow-600/30 bg-zinc-950 shadow-2xl overflow-hidden flex items-center justify-center group">
          <div className="absolute inset-3 border-2 border-dashed border-yellow-600/20 rounded-xl"></div>
          {/* Intricate Pattern (CSS) */}
          <div className="absolute inset-0 opacity-30" 
            style={{
               backgroundImage: 'radial-gradient(circle, #fbbf24 1px, transparent 1px)', 
               backgroundSize: '24px 24px'
            }}
          ></div>
          {/* Center Seal */}
          <div className="relative w-32 h-32 border border-yellow-600/40 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
             <div className="absolute inset-0 rounded-full border border-yellow-600/20 animate-spin-slow"></div>
             <SparklesIcon className="w-12 h-12 text-yellow-600/50" />
          </div>
        </div>

        {/* CARD FRONT */}
        <div 
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.1)] bg-gradient-to-br ${card ? card.colors : 'from-zinc-800 to-zinc-900'} border border-white/10`}
        >
           {/* Card Frame */}
           <div className="absolute inset-3 border border-white/20 rounded-xl flex flex-col items-center justify-between p-6">
              {/* Top Number */}
              <div className={`text-2xl font-mystic text-white/80 ${isReversed ? 'rotate-180' : ''}`}>
                 {card?.id}
              </div>

              {/* Center Art */}
              <div className={`transform transition-transform duration-1000 ${isReversed ? 'rotate-180' : ''}`}>
                 {card && getIcon(card.iconType)}
              </div>

              {/* Bottom Suit/Name (Abstract) */}
              <div className={`text-xs uppercase tracking-[0.3em] text-white/50 ${isReversed ? 'rotate-180' : ''}`}>
                  {card?.type === 'major' ? 'Arcana' : card?.suit}
              </div>
           </div>

           {/* Finish Effects */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
