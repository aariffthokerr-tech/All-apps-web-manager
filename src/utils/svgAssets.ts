// High-resolution vector SVG Data URIs for default PocketBawal creations
// Guarantees zero broken images, instant paint, and studio-grade dark cyber-glass aesthetics.

function toSvgDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

export const DEFAULT_ICONS = {
  wallpaper3d: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#131124"/>
          <stop offset="100%" stop-color="#090A12"/>
        </linearGradient>
        <linearGradient id="prismA" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7C3AED"/>
          <stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient>
        <linearGradient id="prismB" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#4C1D95"/>
          <stop offset="100%" stop-color="#22D3EE"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg1)"/>
      <circle cx="128" cy="128" r="86" fill="none" stroke="url(#prismA)" stroke-opacity="0.22" stroke-width="2"/>
      <polygon points="128,44 202,88 202,168 128,212 54,168 54,88" fill="url(#prismA)" fill-opacity="0.18" stroke="url(#prismA)" stroke-width="3"/>
      <polygon points="128,44 202,88 128,132 54,88" fill="url(#prismB)" fill-opacity="0.65"/>
      <polygon points="128,132 202,88 202,168 128,212" fill="#7C3AED" fill-opacity="0.55"/>
      <polygon points="128,132 54,88 54,168 128,212" fill="#06B6D4" fill-opacity="0.4"/>
      <circle cx="128" cy="132" r="10" fill="#F8FAFC"/>
    </svg>
  `),
  bawalSynth: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0C1622"/>
          <stop offset="100%" stop-color="#07070B"/>
        </linearGradient>
        <linearGradient id="ring2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06B6D4"/>
          <stop offset="100%" stop-color="#10B981"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg2)"/>
      <circle cx="128" cy="128" r="82" fill="none" stroke="#1E293B" stroke-width="10" stroke-dasharray="14 8"/>
      <circle cx="128" cy="128" r="64" fill="#111827" stroke="url(#ring2)" stroke-width="4"/>
      <circle cx="128" cy="128" r="42" fill="#0F172A" stroke="#334155" stroke-width="2"/>
      <line x1="128" y1="128" x2="162" y2="94" stroke="#22D3EE" stroke-width="6" stroke-linecap="round"/>
      <circle cx="128" cy="128" r="8" fill="#10B981"/>
    </svg>
  `),
  neuralLens: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#161229"/>
          <stop offset="100%" stop-color="#090D16"/>
        </linearGradient>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10B981"/>
          <stop offset="50%" stop-color="#06B6D4"/>
          <stop offset="100%" stop-color="#7C3AED"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg3)"/>
      <circle cx="128" cy="128" r="84" fill="#0B0F19" stroke="url(#lensGrad)" stroke-width="4"/>
      <circle cx="128" cy="128" r="62" fill="#111827" stroke="#334155" stroke-width="2"/>
      <circle cx="128" cy="128" r="38" fill="url(#lensGrad)" fill-opacity="0.25" stroke="#22D3EE" stroke-width="3"/>
      <circle cx="112" cy="112" r="10" fill="#F8FAFC" fill-opacity="0.75"/>
      <circle cx="144" cy="144" r="5" fill="#10B981" fill-opacity="0.9"/>
    </svg>
  `),
  orbitDrifter: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0F1021"/>
          <stop offset="100%" stop-color="#06070B"/>
        </linearGradient>
        <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F8FAFC"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg4)"/>
      <ellipse cx="128" cy="142" rx="88" ry="34" fill="none" stroke="#7C3AED" stroke-opacity="0.45" stroke-width="4" transform="rotate(-18 128 142)"/>
      <polygon points="128,50 176,174 128,148 80,174" fill="url(#shipGrad)"/>
      <polygon points="128,50 128,148 80,174" fill="#CBD5E1"/>
      <circle cx="128" cy="172" r="14" fill="#06B6D4" fill-opacity="0.8"/>
    </svg>
  `),
  apkForge: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#091E1A"/>
          <stop offset="100%" stop-color="#07070B"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg5)"/>
      <rect x="52" y="56" width="152" height="144" rx="22" fill="#0F172A" stroke="#10B981" stroke-width="4"/>
      <path d="M86 112 L112 136 L86 160" fill="none" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="126" y1="160" x2="168" y2="160" stroke="#06B6D4" stroke-width="8" stroke-linecap="round"/>
      <circle cx="80" cy="80" r="5" fill="#10B981"/>
      <circle cx="100" cy="80" r="5" fill="#06B6D4"/>
    </svg>
  `),
  promptCraft: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
      <defs>
        <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E1035"/>
          <stop offset="100%" stop-color="#080811"/>
        </linearGradient>
      </defs>
      <rect width="256" height="256" rx="56" fill="url(#bg6)"/>
      <rect x="56" y="56" width="144" height="144" rx="28" fill="#131629" stroke="#7C3AED" stroke-width="4"/>
      <circle cx="100" cy="106" r="12" fill="#06B6D4"/>
      <circle cx="156" cy="106" r="12" fill="#7C3AED"/>
      <circle cx="128" cy="156" r="12" fill="#10B981"/>
      <line x1="100" y1="106" x2="156" y2="106" stroke="#475569" stroke-width="4"/>
      <line x1="100" y1="106" x2="128" y2="156" stroke="#475569" stroke-width="4"/>
      <line x1="156" y1="106" x2="128" y2="156" stroke="#475569" stroke-width="4"/>
    </svg>
  `),
};

export const DEFAULT_SCREENSHOTS = {
  wallpaperHero1: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <defs>
        <linearGradient id="hbg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#090714"/>
          <stop offset="50%" stop-color="#120E29"/>
          <stop offset="100%" stop-color="#06161E"/>
        </linearGradient>
        <radialGradient id="glowV" cx="35%" cy="45%" r="50%">
          <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.45"/>
          <stop offset="100%" stop-color="#7C3AED" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="glowC" cx="72%" cy="55%" r="45%">
          <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#06B6D4" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="crystal1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7"/>
          <stop offset="50%" stop-color="#6366F1"/>
          <stop offset="100%" stop-color="#06B6D4"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#hbg)"/>
      <rect width="1280" height="720" fill="url(#glowV)"/>
      <rect width="1280" height="720" fill="url(#glowC)"/>
      <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
        <line x1="0" y1="180" x2="1280" y2="180"/>
        <line x1="0" y1="360" x2="1280" y2="360"/>
        <line x1="0" y1="540" x2="1280" y2="540"/>
        <line x1="320" y1="0" x2="320" y2="720"/>
        <line x1="640" y1="0" x2="640" y2="720"/>
        <line x1="960" y1="0" x2="960" y2="720"/>
      </g>
      <polygon points="640,110 860,240 860,480 640,610 420,480 420,240" fill="url(#crystal1)" fill-opacity="0.18" stroke="url(#crystal1)" stroke-width="3"/>
      <polygon points="640,110 860,240 640,360 420,240" fill="#8B5CF6" fill-opacity="0.42"/>
      <polygon points="640,360 860,240 860,480 640,610" fill="#06B6D4" fill-opacity="0.34"/>
      <polygon points="640,360 420,240 420,480 640,610" fill="#4C1D95" fill-opacity="0.5"/>
      <circle cx="640" cy="360" r="190" fill="none" stroke="#22D3EE" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="10 12"/>
      <circle cx="640" cy="360" r="250" fill="none" stroke="#A855F7" stroke-opacity="0.25" stroke-width="1.5"/>
    </svg>
  `),
  wallpaperHero2: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <defs>
        <linearGradient id="hbg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#050811"/>
          <stop offset="100%" stop-color="#0E1726"/>
        </linearGradient>
      </defs>
      <rect width="1280" height="720" fill="url(#hbg2)"/>
      <circle cx="400" cy="360" r="180" fill="#7C3AED" fill-opacity="0.22" stroke="#7C3AED" stroke-width="3"/>
      <circle cx="640" cy="360" r="180" fill="#06B6D4" fill-opacity="0.22" stroke="#06B6D4" stroke-width="3"/>
      <circle cx="880" cy="360" r="180" fill="#10B981" fill-opacity="0.22" stroke="#10B981" stroke-width="3"/>
      <text x="400" y="366" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="22" font-weight="700">Crystal Prism</text>
      <text x="640" y="366" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="22" font-weight="700">Cyber Wave</text>
      <text x="880" y="366" text-anchor="middle" fill="#F8FAFC" font-family="sans-serif" font-size="22" font-weight="700">AMOLED Zero-Drain</text>
    </svg>
  `),
  synthScreen1: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="1280" height="720" fill="#080B12"/>
      <rect x="90" y="80" width="1100" height="560" rx="24" fill="#0F172A" stroke="#1E293B" stroke-width="3"/>
      <path d="M 140 360 Q 260 160, 380 360 T 620 360 T 860 360 T 1100 360" fill="none" stroke="#06B6D4" stroke-width="6"/>
      <path d="M 140 360 Q 260 240, 380 360 T 620 360 T 860 360 T 1100 360" fill="none" stroke="#7C3AED" stroke-width="4" stroke-opacity="0.7"/>
      <circle cx="320" cy="520" r="48" fill="#1E293B" stroke="#06B6D4" stroke-width="4"/>
      <circle cx="640" cy="520" r="48" fill="#1E293B" stroke="#7C3AED" stroke-width="4"/>
      <circle cx="960" cy="520" r="48" fill="#1E293B" stroke="#10B981" stroke-width="4"/>
    </svg>
  `),
  neuralScreen1: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="1280" height="720" fill="#07090F"/>
      <rect x="140" y="70" width="1000" height="580" rx="28" fill="#0D131F" stroke="#10B981" stroke-opacity="0.4" stroke-width="2"/>
      <circle cx="640" cy="360" r="160" fill="none" stroke="#10B981" stroke-width="3" stroke-dasharray="18 10"/>
      <circle cx="640" cy="360" r="90" fill="#06B6D4" fill-opacity="0.15" stroke="#06B6D4" stroke-width="2"/>
      <line x1="420" y1="360" x2="860" y2="360" stroke="#10B981" stroke-opacity="0.5" stroke-width="1.5"/>
      <line x1="640" y1="140" x2="640" y2="580" stroke="#10B981" stroke-opacity="0.5" stroke-width="1.5"/>
    </svg>
  `),
  orbitScreen1: toSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <rect width="1280" height="720" fill="#06070B"/>
      <ellipse cx="640" cy="380" rx="420" ry="150" fill="none" stroke="#7C3AED" stroke-opacity="0.4" stroke-width="4" transform="rotate(-12 640 380)"/>
      <ellipse cx="640" cy="380" rx="280" ry="95" fill="none" stroke="#06B6D4" stroke-opacity="0.5" stroke-width="3" transform="rotate(-12 640 380)"/>
      <polygon points="640,210 710,410 640,370 570,410" fill="#F8FAFC"/>
      <circle cx="640" cy="405" r="18" fill="#06B6D4"/>
    </svg>
  `),
};
