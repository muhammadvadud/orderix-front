'use client';
import { Icon } from './Icon';
import { IconButton, Input } from './ui';
import { useState } from 'react';

const SCREEN_LABELS = {
  dashboard: 'Bosh sahifa',
  orders: 'Buyurtmalar',
  menu: 'Menyu',
  locations: 'Filiallar',
  staff: 'Xodimlar',
  reports: 'Hisobotlar',
  settings: 'Sozlamalar',
};

function TopbarSearch() {
  const [q, setQ] = useState('');
  return (
    <div className="relative">
      <Input icon="Search" placeholder="Buyurtma, taom, xodim qidirish…"
             className="w-72" size="md"
             value={q} onChange={e => setQ(e.target.value)} />
      <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-ink-100 border border-ink-200 font-mono text-[10px] text-ink-500">⌘K</kbd>
    </div>
  );
}

export function Topbar({ screen, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-ink-100"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="hidden md:flex items-center justify-between px-8 h-14">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-400">OrderiX</span>
          <Icon name="ChevronRight" size={14} className="text-ink-300" />
          <span className="font-semibold text-ink-800">{SCREEN_LABELS[screen]}</span>
        </div>
        <div className="flex items-center gap-2">
          <TopbarSearch />
          <IconButton name="Bell" label="Bildirishnomalar" size={36} variant="outline" />
          <IconButton name="HelpCircle" label="Yordam" size={36} variant="outline" />
          <div className="w-px h-6 bg-ink-200 mx-1" />
          <button className="flex items-center gap-2 h-9 px-2.5 rounded-lg hover:bg-ink-100 transition-colors">
            <Icon name="Store" size={14} className="text-accent" />
            <span className="text-sm font-medium text-ink-700">OrderiX</span>
            <Icon name="ChevronDown" size={14} className="text-ink-400" />
          </button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-between px-3 h-14">
        <div className="flex items-center gap-2 min-w-0">
          <IconButton name="Menu" onClick={onMenuClick} label="Menyu" size={38} />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold leading-none">OrderiX</div>
            <div className="font-bold text-ink-900 text-base leading-tight truncate">{SCREEN_LABELS[screen]}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconButton name="Search" label="Qidirish" size={38} />
          <button className="relative inline-flex items-center justify-center" aria-label="Bildirishnomalar"
                  style={{ width: 38, height: 38 }}>
            <Icon name="Bell" size={19} className="text-ink-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
