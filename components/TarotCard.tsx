

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
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
  id: string; 
  gradientColors: string[];
  type: 'major' | 'minor';
  suit?: string;
  iconType: string;
  zhName?: string;
  image?: string;
}

interface TarotCardProps {
  card: CardData | null;
  isRevealed: boolean;
  isDrawing: boolean;
  isReversed?: boolean;
  index?: number;
  isSmall?: boolean; // For deck list view
}

const getIcon = (iconType: string, small: boolean = false) => {
  const props = { className: small ? "w-8 h-8 text-white/90 drop-shadow-lg" : "w-12 h-12 sm:w-16 sm:h-16 text-white/90 drop-shadow-lg" };
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

// Simplified Card Back for the Deck Strip
export const CardBack: React.FC<{ small?: boolean, className?: string }> = ({ small, className = '' }) => {
  return (
    <div className={`relative w-full h-full rounded-lg border border-white/10 bg-card-dark shadow-lg overflow-hidden flex items-center justify-center group ${className}`}>
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #451a03 1px, transparent 1px)`,
          backgroundSize: small ? '10px 10px' : '20px 20px'
        }}
      ></div>

      {small ? (
        <div className="absolute inset-1 border border-amber-900/30 rounded-md"></div>
      ) : (
        <div className="absolute inset-2 border border-amber-900/30 rounded-md"></div>
      )}

      {small ? (
        <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-amber-500/20">
          <SparklesIcon className="w-4 h-4 text-amber-600/80" />
        </div>
      ) : (
        <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm border border-amber-500/20">
          <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-spin-slow-10s"></div>
          <SparklesIcon className="w-10 h-10 text-amber-600/80" />
        </div>
      )}
    </div>
  );
};

export const TarotCard: React.FC<TarotCardProps> = ({ card, isRevealed, isDrawing, isReversed, index = 0 }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Pre-load the image to prevent flickering during animation
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    if (card?.image) {
      const img = new Image();
      img.src = card.image;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    }
  }, [card]);

  const defaultGradient = 'linear-gradient(to bottom right, rgb(39, 39, 42), rgb(24, 24, 27))'; // from-zinc-800 to-zinc-900
  const gradientStyle = {
    backgroundImage: card 
      ? `linear-gradient(to bottom right, ${card.gradientColors.join(', ')})` 
      : defaultGradient
  };

  // If isDrawing is true, it means the card has been dealt. We apply the entrance animation.
  return (
    <div 
      className={`perspective-1000 tarot-card-dimensions ${isDrawing ? 'animate-deal' : 'opacity-0'}`}
    >
      <div 
        className={`relative w-full h-full duration-1500 transform-style-3d transition-transform transition-timing-card-flip ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* === CARD BACK === */}
        <div className="absolute inset-0 backface-hidden">
            <CardBack />
        </div>

        {/* === CARD FRONT === */}
        <div 
            className={`absolute inset-0 backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl shadow-black/60 bg-zinc-900 group`}
        >
           {/* REVEAL FLASH BURST */}
           <div className={`absolute inset-0 z-50 pointer-events-none bg-white mix-blend-overlay transition-opacity duration-1000 ease-out ${isRevealed ? 'opacity-0 delay-500' : 'opacity-0'}`}></div>
           <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300-percent h-300-percent rounded-full bg-reveal-burst pointer-events-none transition-all duration-1000 ${isRevealed ? 'scale-150 opacity-0' : 'scale-0 opacity-100'}`}></div>

           {/* IMAGE LAYER */}
           {card?.image && !imageError && (
               <div className={`relative w-full h-full overflow-hidden ${isReversed ? 'rotate-180' : ''}`}>
                   <img 
                     src={card.image} 
                     alt={card.name}
                     referrerPolicy="no-referrer"
                     className={`w-full h-full object-fill transition-all duration-1000 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                   />
                   {/* Vignette Overlay */}
                   <div className="absolute inset-0 bg-vignette-overlay"></div>
               </div>
           )}

           {/* FALLBACK ART */}
           <div 
              style={gradientStyle}
              className={`absolute inset-0 transition-opacity duration-500 ${!imageLoaded || imageError ? 'opacity-100' : 'opacity-0'}`}
            >
               <div className="absolute inset-3 border border-white/20 rounded-lg flex flex-col items-center justify-between p-6">
                  <div className={`text-2xl font-mystic text-white/90 drop-shadow-md ${isReversed ? 'rotate-180' : ''}`}>{card?.id}</div>
                  <div className={`transform transition-transform duration-1000 hover:scale-110 drop-shadow-2xl ${isReversed ? 'rotate-180' : ''}`}>
                     {card && getIcon(card.iconType)}
                  </div>
                  <div className={`text-xs uppercase tracking-widest text-white/60 text-center ${isReversed ? 'rotate-180' : ''}`}>
                      {card?.type === 'major' ? 'Arcana' : card?.suit}
                  </div>
               </div>
           </div>
           
           {/* GOLD BORDER */}
           <div className="absolute inset-0 rounded-xl border-4 border-yellow-500/80 shadow-lg shadow-yellow-400/50 pointer-events-none"></div>

           {/* HOLOGRAPHIC FOIL OVERLAY */}
           <div className="absolute inset-0 opacity-30 mix-blend-soft-light pointer-events-none foil-gradient"></div>
           
           {/* GLOSSY SHINE ANIMATION */}
           <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 transition-transform duration-1500 delay-500 ${isRevealed ? 'translate-x-pos-full-200' : 'translate-x-neg-full-200'}`}></div>
        </div>
      </div>
    </div>
  );
};

export const MiniCard: React.FC<{ card: CardData; isReversed: boolean }> = ({ card, isReversed }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Pre-load the image to prevent flickering
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    if (card?.image) {
      const img = new Image();
      img.src = card.image;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
    }
  }, [card]);

  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom right, ${card.gradientColors.join(', ')})`,
  };

  return (
    <div className="w-48 h-80 relative rounded-xl overflow-hidden shadow-2xl shadow-black/60 bg-zinc-900 group">
      {/* IMAGE LAYER */}
      {card.image && !imageError && (
        <div className={`relative w-full h-full overflow-hidden transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'} ${isReversed ? 'rotate-180' : ''}`}>
          <img
            src={card.image}
            alt={card.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-fill"
          />
          <div className="absolute inset-0 bg-vignette-overlay"></div>
        </div>
      )}

      {/* FALLBACK ART */}
      <div
        style={gradientStyle}
        className={`absolute inset-0 transition-opacity duration-500 ${!imageLoaded || imageError ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-2 border border-white/20 rounded-lg flex flex-col items-center justify-between p-4">
          <div className={`text-xl font-mystic text-white/90 drop-shadow-md ${isReversed ? 'rotate-180' : ''}`}>{card.id}</div>
          <div className={`transform drop-shadow-2xl ${isReversed ? 'rotate-180' : ''}`}>
            {getIcon(card.iconType, true)}
          </div>
          <div className={`text-9px uppercase tracking-widest text-white/60 text-center ${isReversed ? 'rotate-180' : ''}`}>
            {card.type === 'major' ? 'Arcana' : card.suit}
          </div>
        </div>
      </div>
      
      {/* GOLD BORDER */}
      <div className="absolute inset-0 rounded-xl border-2 border-yellow-500/80 pointer-events-none"></div>

      {/* HOLOGRAPHIC FOIL OVERLAY */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none foil-gradient"></div>
    </div>
  );
};