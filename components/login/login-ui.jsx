'use client';
import { useState } from 'react';
import { Icon } from '../Icon';

export function Logo({ size = 'md', mode = 'light' }) {
  const w = size === 'lg' ? 52 : 40;
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative rounded-xl bg-navy-700 flex items-center justify-center shadow-glow"
           style={{ width: w, height: w }}>
        <Icon name="UtensilsCrossed" size={w * 0.5} className="text-white" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-warn border-2"
              style={{ borderColor: mode === 'dark' ? '#0d1d2e' : '#ffffff' }} />
      </div>
      <div>
        <div className={`font-bold ${size === 'lg' ? 'text-2xl' : 'text-xl'} tracking-tight leading-none ${mode === 'dark' ? 'text-white' : 'text-ink-900'}`}>
          Order<span className="text-accent">i</span>X
        </div>
        <div className={`text-[10.5px] font-medium mt-1 tracking-wide uppercase ${mode === 'dark' ? 'text-ink-300/80' : 'text-ink-400'}`}>Restoran tizimi</div>
      </div>
    </div>
  );
}

export function LoginField({ label, hint, children, error }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-ink-600 mb-1.5">{label}</div>
      {children}
      {error && <div className="text-[11px] text-danger mt-1 flex items-center gap-1"><Icon name="AlertCircle" size={11} /> {error}</div>}
      {!error && hint && <div className="text-[11px] text-ink-400 mt-1">{hint}</div>}
    </label>
  );
}

export function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
        <Icon name="Lock" size={16} />
      </span>
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 pl-9 pr-10 rounded-lg border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition text-sm"
      />
      <button type="button" onClick={() => setShow(s => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 inline-flex items-center justify-center text-ink-400 hover:text-ink-700 rounded-md hover:bg-ink-100">
        <Icon name={show ? 'EyeOff' : 'Eye'} size={15} />
      </button>
    </div>
  );
}

export function PhoneInput({ value, onChange, placeholder, autoFocus }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
        <span className="text-base leading-none">🇺🇿</span>
        <span className="text-sm text-ink-500 font-mono">+998</span>
        <span className="w-px h-4 bg-ink-200 ml-1" />
      </div>
      <input
        autoFocus={autoFocus}
        type="tel"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode="numeric"
        className="w-full h-11 pl-[92px] pr-3 rounded-lg border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition text-sm font-mono"
      />
    </div>
  );
}

export function Btn({ children, onClick, variant = 'primary', icon, iconRight, loading, disabled, type = 'button', fullWidth = true }) {
  const variants = {
    primary:  'bg-navy-700 text-white hover:bg-navy-800 active:bg-navy-900 shadow-sm',
    telegram: 'bg-telegram text-white hover:bg-[#1d8bc0] active:bg-[#197aaa] shadow-sm',
    outline:  'bg-white border border-ink-200 text-ink-700 hover:bg-ink-50',
    ghost:    'bg-transparent text-ink-600 hover:bg-ink-100',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}>
      {loading ? (
        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      ) : icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
      {iconRight && !loading && <Icon name={iconRight} size={16} />}
    </button>
  );
}
