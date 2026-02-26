/**
 * AdMob Banner Component
 * Placeholder for Google AdMob integration
 * To enable:
 * 1. Sign up at https://admob.google.com
 * 2. Create an ad unit
 * 3. Add your ad unit ID below
 */

import React from 'react';

interface AdBannerProps {
  position: 'top' | 'bottom';
}

// TODO: Replace with your actual AdMob ad unit ID
// Get it from: https://admob.google.com
const AD_UNIT_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';

export const AdBanner: React.FC<AdBannerProps> = ({ position }) => {
  // For now, show a placeholder
  // When AdMob is ready, use the real component below
  
  /* 
  // Real AdMob Implementation (uncomment when ready):
  useEffect(() => {
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle as any).push({});
      } catch (e) {
        console.error('AdMob error:', e);
      }
    }
  }, []);
  
  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'block',
        width: '100%',
        maxWidth: '320px',
        height: '50px',
        margin: position === 'bottom' ? '0 auto 1rem' : '1rem auto 0'
      }}
      data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
      data-ad-slot="xxxxxxxxxx"
      data-ad-format="horizontal"
      data-full-width-responsive="true"
    />
  );
  */
 
  // Placeholder - remove when real ads are added
  return (
    <div 
      className={`w-full max-w-md mx-auto py-2 px-4 ${
        position === 'bottom' ? 'mb-4' : 'mt-2'
      }`}
    >
      <div className="bg-white/5 rounded-lg py-3 text-center">
        <span className="text-zinc-600 text-xs">
          Advertisement Space
        </span>
      </div>
    </div>
  );
};

export default AdBanner;
