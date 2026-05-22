'use client';
import * as LucideIcons from 'lucide-react';

export function Icon({ name, size = 20, strokeWidth = 2, className = '', style }) {
  const LucideIcon = LucideIcons[name];
  if (!LucideIcon) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={className}
        style={style}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="2 3"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
      </svg>
    );
  }
  return <LucideIcon size={size} strokeWidth={strokeWidth} className={className} style={style} />;
}
