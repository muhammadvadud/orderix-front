'use client';

function makeIcon(paths) {
  return function Icon({ size = 20, className = '', strokeWidth = 2, fill = 'none', style }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
        fill={fill} stroke="currentColor" strokeWidth={strokeWidth}
        strokeLinecap="round" strokeLinejoin="round"
        className={className} style={style}>
        {paths}
      </svg>
    );
  };
}

export const ClipboardList = makeIcon(<>
  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
  <path d="M12 11h4"/><path d="M12 16h4"/>
  <path d="M8 11h.01"/><path d="M8 16h.01"/>
</>);

export const PlusCircle = makeIcon(<>
  <circle cx="12" cy="12" r="10"/>
  <path d="M8 12h8"/><path d="M12 8v8"/>
</>);

export const Grid = makeIcon(<>
  <rect x="3" y="3" width="7" height="7" rx="1"/>
  <rect x="14" y="3" width="7" height="7" rx="1"/>
  <rect x="3" y="14" width="7" height="7" rx="1"/>
  <rect x="14" y="14" width="7" height="7" rx="1"/>
</>);

export const User = makeIcon(<>
  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
  <circle cx="12" cy="7" r="4"/>
</>);

export const Clock = makeIcon(<>
  <circle cx="12" cy="12" r="10"/>
  <path d="M12 6v6l4 2"/>
</>);

export const ChevronRight = makeIcon(<path d="M9 18l6-6-6-6"/>);
export const ChevronLeft  = makeIcon(<path d="M15 18l-6-6 6-6"/>);
export const ChevronDown  = makeIcon(<path d="M6 9l6 6 6-6"/>);

export const Check = makeIcon(<path d="M20 6 9 17l-5-5"/>);
export const CheckCircle = makeIcon(<>
  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
  <path d="m9 11 3 3L22 4"/>
</>);

export const Plus  = makeIcon(<><path d="M12 5v14"/><path d="M5 12h14"/></>);
export const Minus = makeIcon(<path d="M5 12h14"/>);

export const Search = makeIcon(<>
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.3-4.3"/>
</>);

export const Bell = makeIcon(<>
  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
</>);

export const LogOut = makeIcon(<>
  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
  <polyline points="16 17 21 12 16 7"/>
  <line x1="21" y1="12" x2="9" y2="12"/>
</>);

export const ChefHat = makeIcon(<>
  <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
  <line x1="6" y1="17" x2="18" y2="17"/>
</>);

export const X = makeIcon(<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>);

export const Utensils = makeIcon(<>
  <path d="M3 2v7c0 1.1.9 2 2 2h2v11"/>
  <path d="M7 2v20"/>
  <path d="M21 15V2c-1.66 0-3 2.69-3 6s1.34 6 3 6Zm-3 0v7"/>
</>);

export const Flame = makeIcon(<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>);

export const Salad = makeIcon(<>
  <path d="M7 21h10"/>
  <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z"/>
  <path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"/>
  <path d="m13 12 4-4"/>
  <path d="M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2"/>
</>);

export const CupSoda = makeIcon(<>
  <path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/>
  <path d="M5 8h14"/>
  <path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/>
  <path d="m12 8 1-6h2"/>
</>);

export const IceCream = makeIcon(<>
  <path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/>
  <path d="M17 7A5 5 0 0 0 7 7"/>
  <path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>
</>);

export const Wheat = makeIcon(<>
  <path d="M2 22 16 8"/>
  <path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>
  <path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>
  <path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/>
  <path d="M20 9V2h-7"/>
</>);

export const Receipt = makeIcon(<>
  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
  <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
  <path d="M12 17.5v-11"/>
</>);

export const MapPin = makeIcon(<>
  <path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0Z"/>
  <circle cx="12" cy="10" r="3"/>
</>);

export const Inbox = makeIcon(<>
  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
</>);

export const Settings = makeIcon(<>
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  <circle cx="12" cy="12" r="3"/>
</>);

export const Award = makeIcon(<>
  <circle cx="12" cy="8" r="6"/>
  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
</>);

export const TrendingUp = makeIcon(<>
  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
  <polyline points="16 7 22 7 22 13"/>
</>);

export const Phone = makeIcon(<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>);

export const ArrowRight = makeIcon(<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>);
