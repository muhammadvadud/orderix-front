'use client';
import { Icon } from './Icon';
import { STATUS_META } from '@/lib/data';

export function Badge({ status, size = 'md' }) {
  const meta = STATUS_META[status] || STATUS_META.closed;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap ${padding}`}
          style={{ background: meta.bg, color: meta.fg }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

export function RoleBadge({ role }) {
  const meta = {
    'Menejer':   { icon: 'ShieldCheck', bg: 'bg-navy-100', fg: 'text-navy-700' },
    'Ofitsiant': { icon: 'UserCircle2', bg: 'bg-ink-100',  fg: 'text-ink-600' },
    'Oshpaz':    { icon: 'ChefHat',     bg: 'bg-warn/15',  fg: 'text-[#8a5a07]' },
    'Kassir':    { icon: 'Calculator',  bg: 'bg-success/15', fg: 'text-[#1d7a44]' },
  }[role] || { icon: 'UserCircle2', bg: 'bg-ink-100', fg: 'text-ink-600' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${meta.bg} ${meta.fg}`}>
      <Icon name={meta.icon} size={12} />
      {role}
    </span>
  );
}

export function Trend({ value, positive }) {
  const up = positive == null ? value > 0 : positive;
  const color = up ? 'text-success' : 'text-danger';
  const bg = up ? 'bg-success/10' : 'bg-danger/10';
  return (
    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${color} ${bg}`}>
      <Icon name={up ? 'ArrowUpRight' : 'ArrowDownRight'} size={12} strokeWidth={2.5} />
      {Math.abs(value)}%
    </span>
  );
}

export function Avatar({ initials, color = '#1F4E79', size = 32, ring = false }) {
  return (
    <div className={`inline-flex items-center justify-center rounded-full font-semibold text-white shrink-0 ${ring ? 'ring-2 ring-white' : ''}`}
         style={{ background: color, width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  );
}

export function Card({ children, className = '', padding = true }) {
  return (
    <div className={`bg-white rounded-xl border border-ink-100 shadow-card ${padding ? 'p-4 sm:p-5' : ''} ${className}`}>
      {children}
    </div>
  );
}

export function Button({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', className = '', disabled = false, fullWidth = false }) {
  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-3.5 text-sm gap-2 sm:h-9',
    lg: 'h-11 px-5 text-sm gap-2',
  };
  const variants = {
    primary: 'bg-navy-700 text-white hover:bg-navy-800 active:bg-navy-900 shadow-sm',
    accent:  'bg-accent text-white hover:bg-accent-600 active:bg-accent-600 shadow-sm',
    ghost:   'bg-transparent text-ink-700 hover:bg-ink-100',
    outline: 'bg-white border border-ink-200 text-ink-700 hover:bg-ink-50',
    danger:  'bg-danger text-white hover:bg-[#d23a2b] shadow-sm',
    success: 'bg-success text-white hover:bg-[#1f9152] shadow-sm',
    soft:    'bg-navy-50 text-navy-700 hover:bg-navy-100',
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}>
      {icon && <Icon name={icon} size={size === 'sm' ? 14 : 16} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}

export function IconButton({ name, onClick, label, variant = 'ghost', size = 36, className = '' }) {
  const variants = {
    ghost:   'text-ink-500 hover:text-ink-800 hover:bg-ink-100',
    outline: 'border border-ink-200 text-ink-600 hover:bg-ink-50',
    danger:  'text-danger hover:bg-danger/10',
    solid:   'bg-navy-700 text-white hover:bg-navy-800',
  };
  return (
    <button onClick={onClick} aria-label={label} title={label}
      className={`inline-flex items-center justify-center rounded-lg transition-colors ${variants[variant]} ${className}`}
      style={{ width: size, height: size }}>
      <Icon name={name} size={Math.round(size * 0.5)} />
    </button>
  );
}

export function Input({ value, onChange, placeholder, icon, type = 'text', className = '', size = 'md' }) {
  const sizes = { sm: 'h-9 text-xs', md: 'h-10 text-sm sm:h-9', lg: 'h-11 text-sm' };
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
          <Icon name={icon} size={16} />
        </span>
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full ${sizes[size]} ${icon ? 'pl-9' : 'pl-3'} pr-3 rounded-lg border border-ink-200 bg-white text-ink-900 placeholder:text-ink-400 focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition`}
      />
    </div>
  );
}

export function Select({ value, onChange, options, className = '', size = 'md', placeholder }) {
  const sizes = { sm: 'h-9 text-xs', md: 'h-10 text-sm sm:h-9', lg: 'h-11 text-sm' };
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className={`w-full ${sizes[size]} appearance-none pl-3 pr-9 rounded-lg border border-ink-200 bg-white text-ink-900 focus:border-accent focus:ring-2 focus:ring-accent/15 outline-none transition`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
        <Icon name="ChevronDown" size={16} />
      </span>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, width = 480 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 anim-fade" onClick={onClose}>
      <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" />
      <div className="hidden sm:flex absolute inset-0 items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-pop anim-pop overflow-hidden flex flex-col max-h-[90vh]"
             style={{ width }} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <h3 className="font-semibold text-ink-900">{title}</h3>
            <IconButton name="X" onClick={onClose} label="Yopish" size={32} />
          </div>
          <div className="p-5 overflow-auto">{children}</div>
          {footer && (
            <div className="px-5 py-3.5 bg-ink-50 border-t border-ink-100 flex justify-end gap-2">{footer}</div>
          )}
        </div>
      </div>
      <div className="sm:hidden absolute inset-x-0 bottom-0">
        <div className="bg-white rounded-t-2xl shadow-pop anim-sheet flex flex-col max-h-[92vh]"
             onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 rounded-full bg-ink-200" />
          </div>
          <div className="flex items-center justify-between px-5 py-2.5 border-b border-ink-100">
            <h3 className="font-semibold text-ink-900">{title}</h3>
            <IconButton name="X" onClick={onClose} label="Yopish" size={32} />
          </div>
          <div className="p-5 overflow-auto" style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>{children}</div>
          {footer && (
            <div className="px-5 py-3.5 bg-white border-t border-ink-100 flex gap-2"
                 style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom))' }}>{footer}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children, footer, width = 480 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 anim-fade">
      <div className="absolute inset-0 bg-ink-900/30" onClick={onClose} />
      <div className="hidden sm:flex absolute top-0 right-0 h-full bg-white shadow-pop anim-slide-right flex-col"
           style={{ width }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
          <h3 className="font-semibold text-ink-900">{title}</h3>
          <IconButton name="X" onClick={onClose} label="Yopish" size={32} />
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3.5 bg-white border-t border-ink-100 flex justify-end gap-2">{footer}</div>
        )}
      </div>
      <div className="sm:hidden absolute inset-0 bg-white anim-slide-up flex flex-col"
           style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-2 px-3 py-3 border-b border-ink-100">
          <IconButton name="ArrowLeft" onClick={onClose} label="Orqaga" size={36} />
          <h3 className="font-semibold text-ink-900 text-base flex-1 truncate">{title}</h3>
        </div>
        <div className="flex-1 overflow-auto">{children}</div>
        {footer && (
          <div className="px-4 py-3 bg-white border-t border-ink-100 flex gap-2"
               style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, children, hint }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-ink-600 mb-1.5">{label}</div>
      {children}
      {hint && <div className="text-[11px] text-ink-400 mt-1">{hint}</div>}
    </label>
  );
}

export function EmptyRow({ colSpan, icon = 'Inbox', text = 'Natijalar yoʻq' }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="inline-flex flex-col items-center gap-2 text-ink-400">
          <div className="w-10 h-10 rounded-full bg-ink-100 inline-flex items-center justify-center">
            <Icon name={icon} size={18} />
          </div>
          <div className="text-sm">{text}</div>
        </div>
      </td>
    </tr>
  );
}

export function EmptyState({ icon = 'Inbox', text = 'Natijalar yoʻq' }) {
  return (
    <div className="py-10 text-center">
      <div className="inline-flex flex-col items-center gap-2 text-ink-400">
        <div className="w-10 h-10 rounded-full bg-ink-100 inline-flex items-center justify-center">
          <Icon name={icon} size={18} />
        </div>
        <div className="text-sm">{text}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="hidden md:flex items-end justify-between mb-6 gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function MobileSubheader({ subtitle, actions }) {
  if (!subtitle && !actions) return null;
  return (
    <div className="md:hidden mb-4 flex items-end justify-between gap-3">
      {subtitle && <p className="text-xs text-ink-500 leading-relaxed">{subtitle}</p>}
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
