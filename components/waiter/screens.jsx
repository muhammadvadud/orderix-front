'use client';
import { useState, useEffect } from 'react';
import {
  ClipboardList, Clock, Bell, Inbox, ChefHat, CheckCircle, ArrowRight,
  Plus, Minus, X, ChevronLeft, Check, Wheat, Flame, Salad, Utensils,
  CupSoda, IceCream, Receipt, MapPin, Settings, Phone, Award, TrendingUp,
  LogOut, ChevronRight,
} from './icons';
import {
  WAITER, TABLES, CATEGORIES, MENU, SERVICE_RATE,
  findItem, orderSubtotal, orderTotal, orderItemCount,
  formatSoum, minutesAgo, STATUS_META, nextAction, WAITER_COLORS,
} from '../../lib/waiter-data';

const { NAVY, ACCENT } = WAITER_COLORS;

const CATEGORY_ICON_MAP = { Wheat, Flame, Salad, Utensils, CupSoda, IceCream };

// ─── Shared bits ─────────────────────────────────

export function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: m.bg, color: m.text }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.dot }} />
      {m.label}
    </span>
  );
}

function SectionHeader({ title, sub, right }) {
  return (
    <div className="flex items-end justify-between px-5 md:px-8 pt-5 md:pt-8 pb-3 md:pb-5">
      <div>
        <h1 className="text-[26px] md:text-[32px] font-extrabold tracking-tight text-slate-900 leading-none">{title}</h1>
        {sub && <p className="text-[13px] md:text-[14px] text-slate-500 mt-1.5 md:mt-2">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function IconBtn({ children, onClick, className = '' }) {
  return (
    <button onClick={onClick}
      className={`tap h-11 w-11 rounded-full bg-white grid place-items-center text-slate-700 border border-slate-200/70 shadow-sm ${className}`}>
      {children}
    </button>
  );
}

function Row({ k, v, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[13px] ${bold ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>{k}</span>
      <span className={`tabular-nums text-[13px] ${bold ? 'text-slate-900 font-extrabold text-[15px]' : 'text-slate-700 font-semibold'}`}>{v}</span>
    </div>
  );
}

function StickyFooter({ children }) {
  return (
    <div className="sticky-footer px-5 md:px-8 mt-6">
      <div className="max-w-2xl rounded-2xl p-2 shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] bg-white/90 backdrop-blur-md border border-white/60">
        {children}
      </div>
    </div>
  );
}

function CategoryGlyph({ cat }) {
  const map = { plov: Wheat, shashlik: Flame, salads: Salad, soups: Utensils, drinks: CupSoda, desserts: IceCream };
  const I = map[cat] || Utensils;
  return <I size={34} style={{ color: NAVY }} strokeWidth={1.6} />;
}

// ─── MY ORDERS ───────────────────────────────────

export function MyOrdersScreen({ orders, onAdvance, onOpen, onGoNew }) {
  const active = orders.filter(o => o.status !== 'closed');
  const counts = {
    all:       active.length,
    preparing: active.filter(o => o.status === 'preparing').length,
    ready:     active.filter(o => o.status === 'ready').length,
    served:    active.filter(o => o.status === 'served').length,
  };
  const [filter, setFilter] = useState('all');
  const list = active.filter(o => filter === 'all' ? true : o.status === filter);

  return (
    <div className="pb-6">
      <SectionHeader
        title="My Orders"
        sub={`${WAITER.name} · ${counts.all} active`}
        right={<IconBtn className="md:hidden"><Bell size={18} /></IconBtn>}
      />

      <div className="px-5 md:px-8 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all',       label: 'All',       c: counts.all },
          { id: 'preparing', label: 'Preparing', c: counts.preparing },
          { id: 'ready',     label: 'Ready',     c: counts.ready },
          { id: 'served',    label: 'Served',    c: counts.served },
        ].map(f => {
          const on = filter === f.id;
          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className="tap shrink-0 h-9 px-3.5 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 border"
              style={{
                background: on ? NAVY : '#fff',
                color: on ? '#fff' : '#475569',
                borderColor: on ? NAVY : '#e2e8f0',
              }}>
              {f.label}
              <span className="rounded-full px-1.5 text-[11px]"
                style={{ background: on ? 'rgba(255,255,255,0.18)' : '#f1f5f9', color: on ? '#fff' : '#64748b' }}>
                {f.c}
              </span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyOrders onGoNew={onGoNew} />
      ) : (
        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {list.map(o => <OrderCard key={o.id} order={o} onAdvance={onAdvance} onOpen={onOpen} />)}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onAdvance, onOpen }) {
  const action = nextAction(order.status);
  const itemCount = orderItemCount(order);
  const total = orderTotal(order);
  return (
    <div className="rounded-2xl bg-white border border-slate-200/70 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.12)] overflow-hidden">
      <button onClick={() => onOpen(order)} className="tap w-full text-left px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-extrabold text-slate-900 leading-none">{order.tableLabel.split(' · ')[0]}</span>
              <span className="text-[12px] font-medium text-slate-500">· {order.tableLabel.split(' · ')[1]}</span>
            </div>
            <div className="mt-2"><StatusBadge status={order.status} /></div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-extrabold text-slate-900 leading-none tabular-nums">
              {(total / 1000).toFixed(0)}<span className="text-[11px] font-semibold text-slate-500 ml-0.5">k</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-1 tabular-nums">UZS</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1"><Inbox size={13} /> {itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1"><Clock size={13} /> {minutesAgo(order.createdAt)}</span>
        </div>
      </button>

      <div className="px-4 pb-3">
        <div className="rounded-xl bg-slate-50/80 px-3 py-2.5 text-[12.5px] text-slate-600 leading-snug">
          {order.items.slice(0, 2).map((it, i) => {
            const m = findItem(it.menuId);
            return (
              <div key={i} className="flex justify-between">
                <span className="truncate pr-2"><span className="font-semibold text-slate-700">{it.qty}×</span> {m?.name}</span>
              </div>
            );
          })}
          {order.items.length > 2 && (
            <div className="text-slate-400 mt-0.5">+ {order.items.length - 2} more</div>
          )}
        </div>
      </div>

      {action && (
        <button
          onClick={() => onAdvance(order.id)}
          className="tap w-full h-12 grid place-items-center font-semibold text-[14px] border-t"
          style={{
            color: order.status === 'ready' ? '#fff' : (order.status === 'served' ? '#fff' : NAVY),
            background:
              order.status === 'ready' ? '#10b981' :
              order.status === 'served' ? NAVY : '#fff',
            borderColor: '#eef2f7',
          }}>
          <span className="inline-flex items-center gap-2">
            {order.status === 'ready'  ? <ChefHat size={16}/> :
             order.status === 'served' ? <CheckCircle size={16}/> :
             <ArrowRight size={16}/>}
            {action.label}
          </span>
        </button>
      )}
    </div>
  );
}

function EmptyOrders({ onGoNew }) {
  return (
    <div className="px-6 mt-8 flex flex-col items-center text-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#E7F0FA"/>
              <stop offset="1" stopColor="#F4F6FA"/>
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="86" fill="url(#g1)"/>
          <rect x="56" y="46" width="88" height="112" rx="14" fill="#fff" stroke="#cfd8e3" strokeWidth="1.5"/>
          <rect x="80" y="38" width="40" height="18" rx="6" fill={NAVY}/>
          <rect x="70" y="78"  width="60" height="6" rx="3" fill="#e2e8f0"/>
          <rect x="70" y="96"  width="44" height="6" rx="3" fill="#e2e8f0"/>
          <rect x="70" y="114" width="52" height="6" rx="3" fill="#e2e8f0"/>
          <circle cx="148" cy="138" r="22" fill={ACCENT}/>
          <path d="M138 138 l8 8 l14 -16" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="mt-2 text-[18px] font-bold text-slate-900">All caught up</h3>
      <p className="mt-1 text-[13px] text-slate-500 max-w-[260px]">
        You have no active orders in this view. Take a new order whenever a guest is ready.
      </p>
      <button onClick={onGoNew}
        className="tap mt-5 h-12 px-5 rounded-2xl text-white font-semibold inline-flex items-center gap-2"
        style={{ background: NAVY }}>
        <Plus size={18} /> New order
      </button>
    </div>
  );
}

// ─── ORDER DETAIL SHEET ──────────────────────────

export function OrderDetailSheet({ order, onClose, onAdvance }) {
  if (!order) return null;
  const sub = orderSubtotal(order);
  const svc = Math.round(sub * SERVICE_RATE);
  const tot = sub + svc;
  const action = nextAction(order.status);
  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
      <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl max-h-[88vh] md:max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="pt-2.5 pb-1 grid place-items-center md:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
        <div className="px-5 md:px-6 pt-2 md:pt-5 pb-3 flex items-start justify-between">
          <div>
            <div className="text-[22px] font-extrabold text-slate-900 leading-none">{order.tableLabel}</div>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={order.status} />
              <span className="text-[12px] text-slate-500 inline-flex items-center gap-1">
                <Clock size={12}/> {minutesAgo(order.createdAt)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="tap h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-600">
            <X size={16}/>
          </button>
        </div>

        <div className="px-5 md:px-6 overflow-y-auto flex-1">
          <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {order.items.map((it, i) => {
              const m = findItem(it.menuId);
              return (
                <div key={i} className="px-3.5 py-3 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <div className="text-[15px] font-semibold text-slate-800 truncate">{m?.name}</div>
                    <div className="text-[12px] text-slate-500">{formatSoum(m?.price || 0)} each</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-bold text-slate-900">×{it.qty}</div>
                    <div className="text-[12px] text-slate-500 tabular-nums">{formatSoum((m?.price || 0) * it.qty)}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4 space-y-2">
            <Row k="Subtotal" v={formatSoum(sub)} />
            <Row k={`Service (${Math.round(SERVICE_RATE * 100)}%)`} v={formatSoum(svc)} />
            <div className="h-px bg-slate-200 my-1" />
            <Row k="Total" v={formatSoum(tot)} bold />
          </div>
        </div>

        <div className="p-4 pt-3 border-t border-slate-100 flex gap-2">
          <button onClick={onClose}
            className="tap h-12 flex-1 rounded-2xl border border-slate-200 text-slate-700 font-semibold">
            Close
          </button>
          {action && (
            <button onClick={() => { onAdvance(order.id); onClose(); }}
              className="tap h-12 flex-[1.4] rounded-2xl text-white font-semibold"
              style={{ background: NAVY }}>
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── NEW ORDER (3 steps) ─────────────────────────

export function NewOrderScreen({ draft, setDraft, onSubmit, occupiedIds }) {
  const step = draft.step;
  const goto = (s) => setDraft(d => ({ ...d, step: s }));

  return (
    <div className="pb-6">
      <SectionHeader
        title="New Order"
        sub={`Step ${step} of 3 · ${step === 1 ? 'Select a table' : step === 2 ? 'Add items' : 'Review & confirm'}`}
      />

      <div className="px-5 md:px-8 pb-2">
        <div className="flex gap-1.5 max-w-2xl">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-1.5 flex-1 rounded-full"
              style={{ background: n <= step ? NAVY : '#e2e8f0' }} />
          ))}
        </div>
      </div>

      {step === 1 && <StepTable draft={draft} setDraft={setDraft} occupiedIds={occupiedIds} onNext={() => goto(2)} />}
      {step === 2 && <StepMenu  draft={draft} setDraft={setDraft} onBack={() => goto(1)} onNext={() => goto(3)} />}
      {step === 3 && <StepReview draft={draft} setDraft={setDraft} onBack={() => goto(2)} onSubmit={onSubmit} />}
    </div>
  );
}

function StepTable({ draft, setDraft, occupiedIds, onNext }) {
  const zones = [...new Set(TABLES.map(t => t.zone))];
  return (
    <>
      <div className="px-5 md:px-8 pt-2 space-y-5">
        {zones.map(z => (
          <div key={z}>
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">{z}</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
              {TABLES.filter(t => t.zone === z).map(t => {
                const occupied = occupiedIds.has(t.id) || t.status === 'occupied';
                const disabled = t.status === 'unavailable' || occupied;
                const selected = draft.tableId === t.id;
                return (
                  <button key={t.id} disabled={disabled}
                    onClick={() => setDraft(d => ({ ...d, tableId: t.id }))}
                    className="tap relative h-[78px] md:h-[88px] rounded-2xl border flex flex-col items-center justify-center font-semibold"
                    style={{
                      background: selected ? NAVY : (disabled ? '#f1f5f9' : '#fff'),
                      borderColor: selected ? NAVY : '#e2e8f0',
                      color: selected ? '#fff' : (disabled ? '#94a3b8' : '#1e293b'),
                      opacity: disabled ? 0.7 : 1,
                    }}>
                    <div className="text-[17px] leading-none">{t.label}</div>
                    <div className="text-[11px] mt-1.5 font-medium opacity-80">{t.seats} seats</div>
                    {disabled && !selected && (
                      <div className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full"
                        style={{ background: occupied ? '#f59e0b' : '#94a3b8' }}/>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <StickyFooter>
        <button onClick={onNext} disabled={!draft.tableId}
          className="tap h-12 w-full rounded-2xl text-white font-semibold disabled:opacity-40"
          style={{ background: NAVY }}>
          Continue {draft.tableId ? `· ${TABLES.find(t => t.id === draft.tableId)?.label}` : ''}
        </button>
      </StickyFooter>
    </>
  );
}

function StepMenu({ draft, setDraft, onBack, onNext }) {
  const [cat, setCat] = useState(CATEGORIES[0].id);
  const items = MENU.filter(m => m.cat === cat);
  const inCart = (id) => draft.items.find(i => i.menuId === id)?.qty || 0;
  const change = (id, delta) => setDraft(d => {
    const items = [...d.items];
    const i = items.findIndex(x => x.menuId === id);
    if (i === -1 && delta > 0) items.push({ menuId: id, qty: 1 });
    else if (i !== -1) {
      const nq = items[i].qty + delta;
      if (nq <= 0) items.splice(i, 1);
      else items[i] = { ...items[i], qty: nq };
    }
    return { ...d, items };
  });
  const totalItems = draft.items.reduce((s, i) => s + i.qty, 0);
  const totalAmt   = draft.items.reduce((s, i) => s + (findItem(i.menuId)?.price || 0) * i.qty, 0);

  return (
    <>
      <div className="px-5 md:px-8 sticky top-0 md:top-16 z-10 bg-[#F4F6FA]/85 backdrop-blur-md pt-2 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => {
            const on = c.id === cat;
            const Ico = CATEGORY_ICON_MAP[c.icon];
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="tap shrink-0 h-10 px-3.5 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5 border"
                style={{
                  background: on ? NAVY : '#fff',
                  color: on ? '#fff' : '#334155',
                  borderColor: on ? NAVY : '#e2e8f0',
                }}>
                {Ico && <Ico size={14}/>}
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 md:px-8 pt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 md:gap-3">
        {items.map(m => {
          const q = inCart(m.id);
          return (
            <div key={m.id} className="rounded-2xl bg-white border border-slate-200/70 p-3 flex flex-col">
              <div className="h-20 rounded-xl mb-2 grid place-items-center"
                style={{ background: `linear-gradient(135deg, ${ACCENT}1a, ${NAVY}14)` }}>
                <CategoryGlyph cat={m.cat} />
              </div>
              <div className="text-[13.5px] font-bold text-slate-900 leading-tight">{m.name}</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{m.desc}</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-[13px] font-extrabold tabular-nums" style={{ color: NAVY }}>
                  {(m.price / 1000).toFixed(0)}k
                </div>
                {q === 0 ? (
                  <button onClick={() => change(m.id, +1)}
                    className="tap h-9 px-3 rounded-full text-white text-[12px] font-semibold inline-flex items-center gap-1"
                    style={{ background: NAVY }}>
                    <Plus size={13}/> Add
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => change(m.id, -1)}
                      className="tap h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-700">
                      <Minus size={14}/>
                    </button>
                    <div className="min-w-[20px] text-center text-[14px] font-bold tabular-nums">{q}</div>
                    <button onClick={() => change(m.id, +1)}
                      className="tap h-9 w-9 rounded-full text-white grid place-items-center"
                      style={{ background: NAVY }}>
                      <Plus size={14}/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <StickyFooter>
        <div className="flex gap-2 items-center">
          <button onClick={onBack}
            className="tap h-12 w-12 rounded-2xl border border-slate-200 grid place-items-center text-slate-700">
            <ChevronLeft size={18}/>
          </button>
          <button onClick={onNext} disabled={totalItems === 0}
            className="tap h-12 flex-1 rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center justify-between px-4"
            style={{ background: NAVY }}>
            <span className="inline-flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-md text-[12px] font-bold">{totalItems}</span>
              Review order
            </span>
            <span className="tabular-nums">{(totalAmt / 1000).toFixed(0)}k UZS</span>
          </button>
        </div>
      </StickyFooter>
    </>
  );
}

function StepReview({ draft, setDraft, onBack, onSubmit }) {
  const table = TABLES.find(t => t.id === draft.tableId);
  const change = (id, delta) => setDraft(d => {
    const items = [...d.items];
    const i = items.findIndex(x => x.menuId === id);
    if (i !== -1) {
      const nq = items[i].qty + delta;
      if (nq <= 0) items.splice(i, 1);
      else items[i] = { ...items[i], qty: nq };
    }
    return { ...d, items };
  });
  const sub = draft.items.reduce((s, i) => s + (findItem(i.menuId)?.price || 0) * i.qty, 0);
  const svc = Math.round(sub * SERVICE_RATE);
  const tot = sub + svc;

  return (
    <>
      <div className="px-5 md:px-8 pt-2">
        <div className="rounded-2xl bg-white border border-slate-200/70 p-4 flex items-center gap-3 max-w-2xl">
          <div className="h-11 w-11 rounded-xl grid place-items-center" style={{ background: NAVY }}>
            <span className="text-white font-extrabold text-[15px]">{table?.label.replace(/\s/g, '')}</span>
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-slate-900">{table?.zone} · {table?.label}</div>
            <div className="text-[12px] text-slate-500">{table?.seats} seats · {draft.items.reduce((s, i) => s + i.qty, 0)} items</div>
          </div>
          <button onClick={onBack} className="tap h-9 px-3 rounded-full bg-slate-100 text-[12px] font-semibold text-slate-700">Edit</button>
        </div>
      </div>

      <div className="px-5 md:px-8 mt-4">
        <div className="rounded-2xl bg-white border border-slate-200/70 divide-y divide-slate-100 max-w-2xl">
          {draft.items.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-slate-500">No items yet — go back and add some.</div>
          )}
          {draft.items.map((it, i) => {
            const m = findItem(it.menuId);
            return (
              <div key={i} className="px-4 py-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg grid place-items-center"
                  style={{ background: `${ACCENT}18` }}>
                  <CategoryGlyph cat={m.cat} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold text-slate-900 truncate">{m.name}</div>
                  <div className="text-[12px] text-slate-500 tabular-nums">{formatSoum(m.price)} · {formatSoum(m.price * it.qty)}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => change(m.id, -1)}
                    className="tap h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-slate-700">
                    <Minus size={14}/>
                  </button>
                  <div className="min-w-[18px] text-center text-[14px] font-bold tabular-nums">{it.qty}</div>
                  <button onClick={() => change(m.id, +1)}
                    className="tap h-8 w-8 rounded-full text-white grid place-items-center"
                    style={{ background: NAVY }}>
                    <Plus size={14}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 md:px-8 mt-4">
        <div className="rounded-2xl p-4 space-y-2 max-w-2xl" style={{ background: `${NAVY}0d` }}>
          <Row k="Subtotal" v={formatSoum(sub)} />
          <Row k={`Service fee (${Math.round(SERVICE_RATE * 100)}%)`} v={formatSoum(svc)} />
          <div className="h-px bg-slate-200 my-1" />
          <Row k="Total" v={formatSoum(tot)} bold />
        </div>
      </div>

      <StickyFooter>
        <div className="flex gap-2">
          <button onClick={onBack}
            className="tap h-12 w-12 rounded-2xl border border-slate-200 grid place-items-center text-slate-700">
            <ChevronLeft size={18}/>
          </button>
          <button onClick={onSubmit} disabled={draft.items.length === 0}
            className="tap h-12 flex-1 rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center justify-center gap-2"
            style={{ background: NAVY }}>
            <Check size={18}/> Place Order
          </button>
        </div>
      </StickyFooter>
    </>
  );
}

// ─── TABLES ──────────────────────────────────────

export function TablesScreen({ orders, onOpenOrder, occupiedIds }) {
  const [selected, setSelected] = useState(null);
  const tablesWith = TABLES.map(t => {
    let status = t.status;
    if (occupiedIds.has(t.id)) status = 'occupied';
    return { ...t, status };
  });
  const counts = {
    free:        tablesWith.filter(t => t.status === 'free').length,
    occupied:    tablesWith.filter(t => t.status === 'occupied').length,
    unavailable: tablesWith.filter(t => t.status === 'unavailable').length,
  };
  const zones = [...new Set(TABLES.map(t => t.zone))];
  const selectedTable = tablesWith.find(t => t.id === selected);
  const orderForSelected = orders.find(o => o.tableId === selected && o.status !== 'closed');

  return (
    <div className="pb-6">
      <SectionHeader title="Tables" sub={`${counts.free} free · ${counts.occupied} occupied · ${counts.unavailable} closed`} />

      <div className="px-5 md:px-8 pb-2 flex items-center gap-3 text-[12px]">
        <Legend color="#10b981" label="Free"/>
        <Legend color="#f59e0b" label="Occupied"/>
        <Legend color="#94a3b8" label="Closed"/>
      </div>

      <div className="px-5 md:px-8 pt-2 space-y-5 md:space-y-6">
        {zones.map(z => (
          <div key={z}>
            <div className="text-[12px] font-bold text-slate-500 uppercase tracking-wider mb-2">{z}</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 md:gap-3">
              {tablesWith.filter(t => t.zone === z).map(t => (
                <TableTile key={t.id} t={t} onClick={() => setSelected(t.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedTable && (
        <TableSheet
          table={selectedTable}
          order={orderForSelected}
          onClose={() => setSelected(null)}
          onOpenOrder={(o) => { setSelected(null); onOpenOrder(o); }}
        />
      )}
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-slate-600">
      <span className="h-2 w-2 rounded-full" style={{ background: color }}/> {label}
    </span>
  );
}

function TableTile({ t, onClick }) {
  const meta = {
    free:        { bg: '#ECFDF5', br: '#A7F3D0', tx: '#047857', dot: '#10b981' },
    occupied:    { bg: '#FFF7ED', br: '#FED7AA', tx: '#B45309', dot: '#f59e0b' },
    unavailable: { bg: '#F1F5F9', br: '#E2E8F0', tx: '#64748B', dot: '#94a3b8' },
  }[t.status];
  return (
    <button onClick={onClick}
      className="tap relative h-[90px] md:h-[110px] rounded-2xl border flex flex-col items-center justify-center"
      style={{ background: meta.bg, borderColor: meta.br, color: meta.tx }}>
      <span className="absolute top-2 right-2 h-2 w-2 rounded-full" style={{ background: meta.dot }}/>
      <div className="text-[18px] font-extrabold leading-none">{t.label}</div>
      <div className="text-[11px] font-medium mt-1.5 opacity-80">{t.seats} seats</div>
      <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">
        {t.status === 'free' ? 'Free' : t.status === 'occupied' ? 'In use' : 'Closed'}
      </div>
    </button>
  );
}

function TableSheet({ table, order, onClose, onOpenOrder }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center md:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
      <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="pt-2.5 pb-1 grid place-items-center md:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
        <div className="px-5 md:px-6 pt-2 md:pt-5 pb-4 md:pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-slate-900 leading-none">{table.label}</div>
              <div className="mt-1.5 text-[12px] text-slate-500">{table.zone} · {table.seats} seats</div>
            </div>
            <button onClick={onClose} className="tap h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-600">
              <X size={16}/>
            </button>
          </div>

          {table.status === 'free' && (
            <div className="mt-4 rounded-2xl p-4 text-center" style={{ background: '#ECFDF5' }}>
              <div className="text-[13px] font-semibold" style={{ color: '#047857' }}>Table is free</div>
              <div className="text-[12px] text-emerald-700/80 mt-1">Ready to seat new guests.</div>
            </div>
          )}

          {table.status === 'unavailable' && (
            <div className="mt-4 rounded-2xl p-4 text-center bg-slate-100">
              <div className="text-[13px] font-semibold text-slate-700">Table closed</div>
              <div className="text-[12px] text-slate-500 mt-1">Currently unavailable for service.</div>
            </div>
          )}

          {table.status === 'occupied' && order && (
            <>
              <div className="mt-4 flex items-center justify-between">
                <StatusBadge status={order.status} />
                <span className="text-[12px] text-slate-500 inline-flex items-center gap-1">
                  <Clock size={12}/> {minutesAgo(order.createdAt)}
                </span>
              </div>
              <div className="mt-3 rounded-2xl border border-slate-200 divide-y divide-slate-100">
                {order.items.slice(0, 4).map((it, i) => {
                  const m = findItem(it.menuId);
                  return (
                    <div key={i} className="px-3.5 py-2.5 flex items-center justify-between">
                      <div className="text-[13.5px] text-slate-700"><span className="font-bold">{it.qty}×</span> {m?.name}</div>
                      <div className="text-[12px] text-slate-500 tabular-nums">{formatSoum((m?.price || 0) * it.qty)}</div>
                    </div>
                  );
                })}
                {order.items.length > 4 && (
                  <div className="px-3.5 py-2 text-[12px] text-slate-500">+ {order.items.length - 4} more</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[13px] text-slate-500">Total</span>
                <span className="text-[16px] font-extrabold text-slate-900 tabular-nums">{formatSoum(orderTotal(order))}</span>
              </div>
              <button onClick={() => onOpenOrder(order)}
                className="tap mt-4 h-12 w-full rounded-2xl text-white font-semibold inline-flex items-center justify-center gap-2"
                style={{ background: NAVY }}>
                Open order <ArrowRight size={16}/>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE ─────────────────────────────────────

export function ProfileScreen({ onLogout }) {
  return (
    <div className="pb-6">
      <SectionHeader title="Profile" sub="Your shift today" />

      <div className="px-5 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-3xl p-5 md:p-6 text-white relative overflow-hidden lg:col-span-1"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${ACCENT} 100%)` }}>
          <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full opacity-20" style={{ background: '#fff' }}/>
          <div className="absolute -right-2 -top-10 h-28 w-28 rounded-full opacity-10" style={{ background: '#fff' }}/>
          <div className="relative flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur grid place-items-center border border-white/25">
              <span className="text-[22px] font-extrabold tracking-tight">{WAITER.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[20px] font-extrabold leading-tight">{WAITER.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">{WAITER.role}</span>
                <span className="text-[12px] opacity-80 inline-flex items-center gap-1"><Award size={12}/> {WAITER.rating}</span>
              </div>
            </div>
          </div>
          <div className="relative mt-4 text-[12px] opacity-90 flex items-center gap-1.5">
            <MapPin size={13}/> {WAITER.restaurant}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
            <StatCard icon={ClipboardList} label="Orders today"  value={WAITER.ordersToday} />
            <StatCard icon={TrendingUp}    label="This week"     value={WAITER.ordersWeek} />
            <StatCard icon={Receipt}       label="Revenue today" value={`${(WAITER.revenueToday / 1000).toFixed(0)}k`} unit="UZS" />
            <StatCard icon={Clock}         label="Shift"         value={WAITER.shift} small />
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/70 divide-y divide-slate-100">
            <ProfileRow icon={Phone}    label="Phone"         value={WAITER.phone}/>
            <ProfileRow icon={Bell}     label="Notifications" value="On"/>
            <ProfileRow icon={Settings} label="Preferences"   value="English"/>
          </div>

          <button onClick={onLogout}
            className="tap w-full h-12 rounded-2xl bg-white border border-slate-200 text-[14px] font-semibold inline-flex items-center justify-center gap-2"
            style={{ color: '#dc2626' }}>
            <LogOut size={16}/> Log out
          </button>
          <div className="text-center text-[11px] text-slate-400">OrderiX · v2.4.1</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Ico, label, value, unit, small }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/70 p-3.5">
      <div className="h-9 w-9 rounded-xl grid place-items-center" style={{ background: `${ACCENT}18`, color: NAVY }}>
        <Ico size={18}/>
      </div>
      <div className={`mt-2 ${small ? 'text-[15px]' : 'text-[20px]'} font-extrabold text-slate-900 leading-none tabular-nums`}>
        {value}{unit && <span className="text-[11px] font-semibold text-slate-500 ml-1">{unit}</span>}
      </div>
      <div className="text-[12px] text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function ProfileRow({ icon: Ico, label, value }) {
  return (
    <button className="tap w-full px-4 h-12 flex items-center gap-3 text-left">
      <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center text-slate-600">
        <Ico size={15}/>
      </div>
      <div className="flex-1 text-[14px] font-semibold text-slate-800">{label}</div>
      <span className="text-[13px] text-slate-500">{value}</span>
      <ChevronRight size={14} className="text-slate-400"/>
    </button>
  );
}

// ─── TOAST ───────────────────────────────────────

export function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onDone, 2200);
    return () => clearTimeout(id);
  }, [message, onDone]);
  if (!message) return null;
  return (
    <div className="fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none" style={{ top: 24 }}>
      <div className="bg-slate-900 text-white text-[13px] font-semibold rounded-full px-4 py-2.5 shadow-lg inline-flex items-center gap-2">
        <CheckCircle size={14}/> {message}
      </div>
    </div>
  );
}
