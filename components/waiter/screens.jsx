'use client';
import { useState, useEffect } from 'react';
import {
  ClipboardList, Clock, Bell, Inbox, ChefHat, CheckCircle, ArrowRight,
  Plus, Minus, X, ChevronLeft, Check, Wheat, Flame, Salad, Utensils,
  CupSoda, IceCream, Receipt, MapPin, Settings, Phone, Award, TrendingUp,
  LogOut, ChevronRight,
} from './icons';
import { formatPhone } from '../../lib/phone';
import {
  WAITER, TABLES, CATEGORIES, MENU, SERVICE_RATE,
  findItem, orderSubtotal, orderTotal, orderItemCount,
  formatSoum, minutesAgo, STATUS_META, ITEM_STATUS_META, nextAction, WAITER_COLORS,
} from '../../lib/waiter-data';

const { NAVY, ACCENT } = WAITER_COLORS;

const CATEGORY_ICON_MAP = { Wheat, Flame, Salad, Utensils, CupSoda, IceCream };

// Narxni "112 000" ko'rinishida formatlash
function fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

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
  const category = CATEGORIES.find(c => c.id === cat);
  if (category?.icon && CATEGORY_ICON_MAP[category.icon]) {
    const I = CATEGORY_ICON_MAP[category.icon];
    return <I size={34} style={{ color: NAVY }} strokeWidth={1.6} />;
  }
  const map = { plov: Wheat, shashlik: Flame, salads: Salad, soups: Utensils, drinks: CupSoda, desserts: IceCream };
  const I = map[cat] || Utensils;
  return <I size={34} style={{ color: NAVY }} strokeWidth={1.6} />;
}

// ─── MY ORDERS ───────────────────────────────────

export function MyOrdersScreen({ orders, onAdvance, onOpen, onGoNew }) {
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const activeCount = orders.filter(o => o.status !== 'closed').length;
  const counts = {
    all:       activeCount,
    preparing: orders.filter(o => o.status === 'preparing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    closed:    orders.filter(o => o.status === 'closed').length,
  };
  const [filter, setFilter] = useState('all');
  const list = filter === 'all'
    ? orders.filter(o => o.status !== 'closed')
    : orders.filter(o => o.status === filter);

  async function handleAdvance(id) {
    if (pendingOrderId) return;
    setPendingOrderId(id);
    try {
      await onAdvance(id);
    } finally {
      setPendingOrderId(cur => (String(cur) === String(id) ? null : cur));
    }
  }

  return (
    <div className="pb-6">
      <SectionHeader
        title="Buyurtmalarim"
        sub={`${WAITER.name} · ${activeCount} ta faol`}
        right={<IconBtn className="md:hidden"><Bell size={18} /></IconBtn>}
      />

      <div className="px-5 md:px-8 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'all',       label: 'Barchasi',       c: counts.all },
          { id: 'preparing', label: 'Tayyorlanmoqda', c: counts.preparing },
          { id: 'delivered', label: 'Yetkazildi',     c: counts.delivered },
          { id: 'closed',    label: 'Tugatildi',      c: counts.closed },
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
        filter === 'closed'
          ? <div className="px-6 mt-10 text-center text-[14px] text-slate-500">Tugatilgan buyurtmalar yo'q</div>
          : <EmptyOrders onGoNew={onGoNew} />
      ) : (
        <div className="px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {list.map(o => (
            <OrderCard
              key={o.id}
              order={o}
              pending={String(pendingOrderId) === String(o.id)}
              onAdvance={handleAdvance}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, pending = false, onAdvance, onOpen }) {
  const action = nextAction(order.status);
  // List'da items bo'lmaydi — backend bergan son/summadan foydalanamiz.
  const itemCount = order.items.length ? orderItemCount(order) : (order.itemCount ?? 0);
  const total = order.items.length ? orderTotal(order) : (order.total ?? 0);
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
            <div className="text-[16px] font-extrabold text-slate-900 leading-none tabular-nums">
              {fmt(total)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 tabular-nums">UZS</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[12px] text-slate-500">
          <span className="inline-flex items-center gap-1"><Inbox size={13} /> {itemCount} ta taom</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span suppressHydrationWarning className="inline-flex items-center gap-1"><Clock size={13} /> {minutesAgo(order.createdAt)}</span>
        </div>
      </button>

      {order.items.length > 0 && (
        <div className="px-4 pb-3">
          <div className="rounded-xl bg-slate-50/80 px-3 py-2.5 text-[12.5px] text-slate-600 leading-snug">
            {order.items.slice(0, 2).map((it, i) => {
              const m = findItem(it.menuId);
              return (
                <div key={i} className="flex justify-between">
                  <span className="truncate pr-2"><span className="font-semibold text-slate-700">{it.qty}×</span> {it.name || m?.name || ''}</span>
                </div>
              );
            })}
            {order.items.length > 2 && (
              <div className="text-slate-400 mt-0.5">+ {order.items.length - 2} ta yana</div>
            )}
          </div>
        </div>
      )}

      {action && (
        <div className="flex gap-2 px-3 pb-3">
          <button
            disabled={pending}
            onClick={() => onAdvance(order.id)}
            className="tap flex-1 h-11 rounded-xl font-semibold text-[13px] inline-flex items-center justify-center gap-2 text-white disabled:opacity-75 disabled:cursor-wait"
            style={{
              background: order.status === 'preparing' ? '#27AE60' : NAVY,
              boxShadow: order.status === 'preparing'
                ? '0 2px 8px rgba(39,174,96,.4)'
                : `0 2px 8px ${NAVY}66`,
            }}>
            {pending ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
            ) : (
              <CheckCircle size={15}/>
            )}
            {order.status === 'preparing'
              ? 'Yetkazildi'
              : 'Tugatish'
            }
          </button>
        </div>
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
      <h3 className="mt-2 text-[18px] font-bold text-slate-900">Hammasi bajarildi</h3>
      <p className="mt-1 text-[13px] text-slate-500 max-w-[260px]">
        Ushbu koʻrinishda faol buyurtmalar yoʻq. Mehmon tayyor boʻlganda yangi buyurtma qabul qiling.
      </p>
      <button onClick={onGoNew}
        className="tap mt-5 h-12 px-5 rounded-2xl text-white font-semibold inline-flex items-center gap-2"
        style={{ background: NAVY }}>
        <Plus size={18} /> Yangi buyurtma
      </button>
    </div>
  );
}

// ─── ORDER DETAIL SHEET ──────────────────────────

export function OrderDetailSheet({ order, onClose, onAdvance, onEdit, onChangeItemStatus, readOnly = false }) {
  const [editMode, setEditMode] = useState(false);
  const [editItems, setEditItems] = useState([]);
  const [addCat, setAddCat] = useState(CATEGORIES[0]?.id);
  const [advancePending, setAdvancePending] = useState(false);

  if (!order) return null;

  const canEdit = !readOnly && order.status !== 'closed' && order.status !== 'cancelled';
  const action  = readOnly ? null : nextAction(order.status);

  function startEdit() {
    setEditItems(order.items.map(it => ({ ...it })));
    setAddCat(CATEGORIES[0]?.id);
    setEditMode(true);
  }
  function cancelEdit() { setEditMode(false); setEditItems([]); }

  function changeQty(menuId, delta) {
    setEditItems(prev => {
      const idx = prev.findIndex(it => it.menuId === menuId);
      if (idx === -1 && delta > 0) return [...prev, { menuId, qty: 1 }];
      if (idx === -1) return prev;
      const arr = [...prev];
      const nq = arr[idx].qty + delta;
      if (nq <= 0) arr.splice(idx, 1);
      else arr[idx] = { ...arr[idx], qty: nq };
      return arr;
    });
  }

  function saveEdit() {
    if (editItems.length === 0) return;
    onEdit(order.id, editItems);
    setEditMode(false);
  }
  async function handleAdvance() {
    if (advancePending) return;
    setAdvancePending(true);
    try {
      await onAdvance(order.id);
      onClose();
    } finally {
      setAdvancePending(false);
    }
  }

  const sub     = orderSubtotal(order);
  const tot     = orderTotal(order);
  const svc     = (typeof order.serviceFee === 'number') ? order.serviceFee : Math.max(0, tot - sub);
  // Tahrirlashda buyurtmaning o'z xizmat haqi (backend recalc ham shuni ishlatadi); bo'lmasa joriy sozlama
  const editRate = (order.serviceRate != null ? order.serviceRate / 100 : SERVICE_RATE);
  const editSub = editItems.reduce((s, it) => {
    if (it.status === 'cancelled') return s;
    return s + ((it.price ?? findItem(it.menuId)?.price ?? 0) * it.qty);
  }, 0);
  const editSvc = Math.round(editSub * editRate);
  const editTot = editSub + editSvc;

  return (
    <div className="fixed inset-0 z-40 flex items-end md:items-center md:justify-center md:p-6"
      onClick={editMode ? undefined : onClose}>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"
        onClick={editMode ? undefined : onClose} />
      <div className="relative w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-3xl max-h-[92vh] md:max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}>

        <div className="pt-2.5 pb-1 grid place-items-center md:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="px-5 md:px-6 pt-2 md:pt-5 pb-3 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="text-[20px] font-extrabold text-slate-900 leading-none">
              {editMode ? 'Buyurtmani tahrirlash' : order.tableLabel}
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              {!editMode && <StatusBadge status={order.status} />}
              <span suppressHydrationWarning className="text-[12px] text-slate-500 inline-flex items-center gap-1">
                <Clock size={12}/> {minutesAgo(order.createdAt)}
              </span>
            </div>
          </div>
          <button onClick={editMode ? cancelEdit : onClose}
            className="tap h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-600">
            <X size={16}/>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-5 md:px-6 overflow-y-auto flex-1 py-4 space-y-4">
          {editMode ? (
            <>
              {/* Current items with +/- controls */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Tarkibdagi taomlar
                </div>
                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">
                  {editItems.length === 0 && (
                    <div className="px-4 py-5 text-center text-[13px] text-slate-400">
                      Hech qanday taom qoʻshilmagan
                    </div>
                  )}
                  {editItems.map((it) => {
                    const m = findItem(it.menuId);
                    const nm = it.name || m?.name || '';
                    const pr = it.price ?? m?.price ?? 0;
                    return (
                      <div key={it.menuId} className="px-3.5 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold text-slate-800 truncate">{nm}</div>
                          <div className="text-[12px] text-slate-500 tabular-nums">
                            {formatSoum(pr * it.qty)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => changeQty(it.menuId, -1)}
                            className="tap h-8 w-8 rounded-full bg-slate-100 grid place-items-center text-slate-700">
                            <Minus size={14}/>
                          </button>
                          <div className="min-w-[20px] text-center text-[14px] font-bold tabular-nums">{it.qty}</div>
                          <button onClick={() => changeQty(it.menuId, +1)}
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

              {/* Add items from menu */}
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Taom qoʻshish
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
                  {CATEGORIES.map(c => {
                    const on = addCat === c.id;
                    const Ico = CATEGORY_ICON_MAP[c.icon];
                    return (
                      <button key={c.id} onClick={() => setAddCat(c.id)}
                        className="tap shrink-0 h-9 px-3 rounded-full text-[12px] font-semibold inline-flex items-center gap-1.5 border transition"
                        style={{
                          background:  on ? NAVY : '#fff',
                          color:       on ? '#fff' : '#334155',
                          borderColor: on ? NAVY : '#e2e8f0',
                        }}>
                        {Ico && <Ico size={12}/>}
                        {c.name}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  {MENU.filter(m => m.cat === addCat).map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-white">
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-800 truncate">{m.name}</div>
                        <div className="text-[11px] text-slate-500 tabular-nums">
                          {fmt(m.price)} soʻm
                        </div>
                      </div>
                      <button onClick={() => changeQty(m.id, +1)}
                        className="tap h-8 w-8 rounded-full text-white grid place-items-center shrink-0"
                        style={{ background: NAVY }}>
                        <Plus size={14}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Updated total */}
              <div className="rounded-2xl p-4 space-y-2" style={{ background: `${NAVY}0d` }}>
                <Row k="Oraliq summa" v={formatSoum(editSub)} />
                <Row k={`Xizmat haqi (${Math.round(editRate * 100)}%)`} v={formatSoum(editSvc)} />
                <div className="h-px bg-slate-200 my-1" />
                <Row k="Jami" v={formatSoum(editTot)} bold />
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100">
                {order.items.map((it, i) => {
                  const m = findItem(it.menuId);
                  // O'chirilgan menyu mahsuloti uchun ham nom/narx ko'rinishi uchun backend qiymatini ishlatamiz
                  const name = it.name || m?.name || '';
                  const price = it.price ?? m?.price ?? 0;
                  return (
                    <div key={i} className="px-3.5 py-3">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <div className={`text-[15px] font-semibold truncate ${it.status === 'cancelled' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                            {name}
                          </div>
                          <div className="text-[12px] text-slate-500">{formatSoum(price)} / dona</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[13px] font-bold text-slate-900">×{it.qty}</div>
                          <div className="text-[12px] text-slate-500 tabular-nums">
                            {formatSoum(price * it.qty)}
                          </div>
                        </div>
                      </div>
                      {/* Per-item status buttons — yopilgan/bekor qilingan yoki readOnly'da yashiriladi */}
                      {canEdit && (
                        <div className="flex gap-1.5 mt-2">
                          {Object.entries(ITEM_STATUS_META).map(([key, meta]) => (
                            <button key={key}
                              onClick={() => onChangeItemStatus(order.id, it.itemId, key)}
                              className="flex-1 py-1 rounded-lg text-[11px] font-semibold border transition inline-flex items-center justify-center gap-1"
                              style={it.status === key
                                ? { background: meta.dot, color: '#fff', borderColor: meta.dot }
                                : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }
                              }>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: it.status === key ? '#fff' : meta.dot }} />
                              {meta.short}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-2">
                <Row k="Oraliq summa" v={formatSoum(sub)} />
                <Row k={`Xizmat haqi (${Math.round(editRate * 100)}%)`} v={formatSoum(svc)} />
                <div className="h-px bg-slate-200 my-1" />
                <Row k="Jami" v={formatSoum(tot)} bold />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 pt-3 border-t border-slate-100 flex gap-2">
          {editMode ? (
            <>
              <button onClick={cancelEdit}
                className="tap h-12 flex-1 rounded-2xl border border-slate-200 text-slate-700 font-semibold">
                Bekor qilish
              </button>
              <button onClick={saveEdit} disabled={editItems.length === 0}
                className="tap h-12 flex-[1.4] rounded-2xl text-white font-semibold disabled:opacity-40 inline-flex items-center justify-center gap-2"
                style={{ background: NAVY }}>
                <Check size={16}/> Saqlash
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose}
                className="tap h-12 flex-1 rounded-2xl border border-slate-200 text-slate-700 font-semibold">
                Yopish
              </button>
              {canEdit && (
                <button onClick={startEdit}
                  className="tap h-12 flex-1 rounded-2xl border font-semibold inline-flex items-center justify-center gap-1.5"
                  style={{ borderColor: `${NAVY}55`, color: NAVY, background: `${NAVY}0d` }}>
                  <ChevronRight size={15}/> Tahrirlash
                </button>
              )}
              {action && (
                <button onClick={handleAdvance} disabled={advancePending}
                  className="tap h-12 flex-[1.4] rounded-2xl text-white font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-wait"
                  style={{ background: NAVY }}>
                  {advancePending && (
                    <span className="w-4 h-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin" />
                  )}
                  {action.label}
                </button>
              )}
            </>
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
        title="Yangi buyurtma"
        sub={`${step}-qadam 3 dan · ${step === 1 ? 'Stol tanlang' : step === 2 ? "Taomlar qo'shing" : "Ko'rib chiqing va tasdiqlang"}`}
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
                    <div className="text-[11px] mt-1.5 font-medium opacity-80">{t.seats} oʻrin</div>
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
          Davom etish {draft.tableId ? `· ${TABLES.find(t => t.id === draft.tableId)?.label}` : ''}
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
            <div key={m.id} className="rounded-2xl bg-white border border-slate-200/70 p-3 flex flex-col min-w-0">
              <div className="h-20 rounded-xl mb-2 grid place-items-center"
                style={{ background: `linear-gradient(135deg, ${ACCENT}1a, ${NAVY}14)` }}>
                <CategoryGlyph cat={m.cat} />
              </div>
              <div className="text-[13.5px] font-bold text-slate-900 leading-tight line-clamp-2 min-h-[34px]">{m.name}</div>
              <div className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">{m.desc}</div>
              <div className="mt-auto pt-2">
                <div className="text-[12px] leading-none font-extrabold tabular-nums truncate" style={{ color: NAVY }}>
                  {fmt(m.price)}
                </div>
                {q === 0 ? (
                  <button onClick={() => change(m.id, +1)}
                    className="tap mt-2 h-9 w-full rounded-full text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1"
                    style={{ background: NAVY }}>
                    <Plus size={13}/> Qoʻshish
                  </button>
                ) : (
                  <div className="mt-2 h-9 w-full rounded-full bg-slate-100 grid grid-cols-[36px_1fr_36px] items-center overflow-hidden">
                    <button onClick={() => change(m.id, -1)}
                      className="tap h-9 w-9 grid place-items-center text-slate-700">
                      <Minus size={14}/>
                    </button>
                    <div className="min-w-0 text-center text-[14px] font-bold tabular-nums text-slate-900">{q}</div>
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
            className="tap h-12 min-w-0 flex-1 rounded-2xl text-white disabled:opacity-40 inline-flex items-center gap-3 px-3.5"
            style={{ background: NAVY }}>
            <span className="min-w-0 flex-1 inline-flex items-center gap-2">
              <span className="shrink-0 bg-white/20 min-w-7 h-7 px-2 rounded-lg text-[12px] font-extrabold grid place-items-center tabular-nums">{totalItems}</span>
              <span className="min-w-0 text-left leading-tight">
                <span className="block text-[13px] font-bold truncate">Koʻrib chiqish</span>
                <span className="block text-[10.5px] font-semibold text-white/70 truncate">Buyurtmani tasdiqlash</span>
              </span>
            </span>
            <span className="shrink-0 max-w-[45%] px-2.5 py-1.5 rounded-xl bg-white/15 text-[12px] font-extrabold tabular-nums truncate">
              {fmt(totalAmt)}
            </span>
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
          <div className="min-w-[56px] h-11 px-2 rounded-xl grid place-items-center shrink-0" style={{ background: NAVY }}>
            <span className="text-white font-extrabold text-[12px] leading-none tabular-nums whitespace-nowrap">{table?.label}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-bold text-slate-900 truncate">{table?.zone} · {table?.label}</div>
            <div className="text-[12px] text-slate-500">{table?.seats} oʻrin · {draft.items.reduce((s, i) => s + i.qty, 0)} ta taom</div>
          </div>
          <button onClick={onBack} className="tap h-9 px-3 rounded-full bg-slate-100 text-[12px] font-semibold text-slate-700">Tahrirlash</button>
        </div>
      </div>

      <div className="px-5 md:px-8 mt-4">
        <div className="rounded-2xl bg-white border border-slate-200/70 divide-y divide-slate-100 max-w-2xl">
          {draft.items.length === 0 && (
            <div className="px-4 py-8 text-center text-[13px] text-slate-500">Taomlar yoʻq — ortga qayting va qoʻshing.</div>
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
          <Row k="Oraliq summa" v={formatSoum(sub)} />
          <Row k={`Xizmat haqi (${Math.round(SERVICE_RATE * 100)}%)`} v={formatSoum(svc)} />
          <div className="h-px bg-slate-200 my-1" />
          <Row k="Jami" v={formatSoum(tot)} bold />
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
            <Check size={18}/> Buyurtma berish
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
      <SectionHeader title="Stollar" sub={`${counts.free} boʻsh · ${counts.occupied} band · ${counts.unavailable} yopiq`} />

      <div className="px-5 md:px-8 pb-2 flex items-center gap-3 text-[12px]">
        <Legend color="#10b981" label="Boʻsh"/>
        <Legend color="#f59e0b" label="Band"/>
        <Legend color="#94a3b8" label="Yopiq"/>
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
      <div className="text-[11px] font-medium mt-1.5 opacity-80">{t.seats} oʻrin</div>
      <div className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-90">
        {t.status === 'free' ? 'Boʻsh' : t.status === 'occupied' ? 'Band' : 'Yopiq'}
      </div>
    </button>
  );
}

function TableSheet({ table, order, onClose, onOpenOrder }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-md max-h-[calc(100svh-2rem)] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="px-5 md:px-6 pt-5 pb-4 md:pb-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[22px] font-extrabold text-slate-900 leading-none">{table.label}</div>
              <div className="mt-1.5 text-[12px] text-slate-500">{table.zone} · {table.seats} oʻrin</div>
            </div>
            <button onClick={onClose} className="tap h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-slate-600">
              <X size={16}/>
            </button>
          </div>

          {table.status === 'free' && (
            <div className="mt-4 rounded-2xl p-4 text-center" style={{ background: '#ECFDF5' }}>
              <div className="text-[13px] font-semibold" style={{ color: '#047857' }}>Stol boʻsh</div>
              <div className="text-[12px] text-emerald-700/80 mt-1">Yangi mehmonlarni qabul qilishga tayyor.</div>
            </div>
          )}

          {table.status === 'unavailable' && (
            <div className="mt-4 rounded-2xl p-4 text-center bg-slate-100">
              <div className="text-[13px] font-semibold text-slate-700">Stol yopiq</div>
              <div className="text-[12px] text-slate-500 mt-1">Hozir xizmat uchun mavjud emas.</div>
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
                      <div className="text-[13.5px] text-slate-700"><span className="font-bold">{it.qty}×</span> {it.name || m?.name || ''}</div>
                      <div className="text-[12px] text-slate-500 tabular-nums">{formatSoum((it.price ?? m?.price ?? 0) * it.qty)}</div>
                    </div>
                  );
                })}
                {order.items.length > 4 && (
                  <div className="px-3.5 py-2 text-[12px] text-slate-500">+ {order.items.length - 4} ta yana</div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between px-1">
                <span className="text-[13px] text-slate-500">Jami</span>
                <span className="text-[16px] font-extrabold text-slate-900 tabular-nums">{formatSoum(orderTotal(order))}</span>
              </div>
              <button onClick={() => onOpenOrder(order)}
                className="tap mt-4 h-12 w-full rounded-2xl text-white font-semibold inline-flex items-center justify-center gap-2"
                style={{ background: NAVY }}>
                Buyurtmani ochish <ArrowRight size={16}/>
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
  const [copied, setCopied] = useState(false);
  const phoneRaw = String(WAITER.phone || '').replace(/\D/g, '');
  const phoneCopy = phoneRaw.startsWith('998') ? `+${phoneRaw}` : `+998${phoneRaw.replace(/^998/, '')}`;
  const phoneDisplay = formatPhone(phoneRaw);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(phoneCopy);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="pb-6">
      <SectionHeader title="Profil" sub="Bugungi smenangiz" />

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
            <StatCard icon={ClipboardList} label="Bugungi buyurtmalar" value={WAITER.ordersToday} />
            <StatCard icon={TrendingUp}    label="Bu hafta"            value={WAITER.ordersWeek} />
            <StatCard icon={Receipt}       label="Bugungi ish haqi"    value={fmt(WAITER.serviceFeeToday || 0)} unit="UZS" small />
            <StatCard icon={Clock}         label="Smena"               value={WAITER.shift} small />
          </div>

          <div className="rounded-2xl bg-white border border-slate-200/70 divide-y divide-slate-100">
            <button onClick={copyPhone}
              className="tap w-full px-4 py-3.5 flex items-center gap-3 text-left relative">
              <div className="h-8 w-8 rounded-lg bg-slate-100 grid place-items-center text-slate-600 shrink-0">
                <Phone size={15}/>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-slate-800">Telefon</div>
                <div className="mt-0.5 inline-flex max-w-full items-center gap-2 rounded-full bg-slate-100 px-2.5 py-1">
                  <span className="max-w-[170px] sm:max-w-none truncate text-[13px] font-mono font-semibold text-slate-700 tabular-nums">{phoneDisplay}</span>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Nusxalash</span>
                </div>
              </div>
              <span className={`hidden sm:inline text-[11px] font-semibold transition-colors ${copied ? 'text-emerald-600' : 'text-slate-400'}`}>
                {copied ? 'Nusxalandi' : 'Nusxalash'}
              </span>
              <ChevronRight size={14} className={`shrink-0 transition-colors ${copied ? 'text-emerald-500' : 'text-slate-400'}`} />
            </button>
            <ProfileRow icon={Bell}     label="Bildirishnomalar" value="Yoqilgan"/>
            <ProfileRow icon={Settings} label="Sozlamalar"       value="O'zbek"/>
          </div>

          <button onClick={onLogout}
            className="tap w-full h-12 rounded-2xl bg-white border border-slate-200 text-[14px] font-semibold inline-flex items-center justify-center gap-2"
            style={{ color: '#dc2626' }}>
            <LogOut size={16}/> Chiqish
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

// ─── HISTORY ─────────────────────────────────────

const PAGE_SIZE = 8;

function paginate(cur, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 3)           return [1, 2, 3, 4, '…', total];
  if (cur >= total - 2)   return [1, '…', total - 3, total - 2, total - 1, total];
  return [1, '…', cur - 1, cur, cur + 1, '…', total];
}

export function HistoryScreen({ orders, onOpen }) {
  const [page, setPage] = useState(1);

  // Faqat tugatilgan (closed) orderlar
  const closed = orders
    .filter(o => o.status === 'closed')
    .sort((a, b) => b.createdAt - a.createdAt);

  const totalPages = Math.max(1, Math.ceil(closed.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const paged      = closed.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalRevenue = closed.reduce((s, o) => s + orderTotal(o), 0);

  return (
    <div className="pb-8">
      <SectionHeader
        title="Tarix"
        sub={`Bugungi tugatilgan buyurtmalar`}
      />

      {/* Stats */}
      <div className="px-5 md:px-8 grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-2xl bg-white border border-slate-200/70 p-4 text-center">
          <div className="text-[12px] text-slate-500 mb-1">Tugatilgan</div>
          <div className="text-[28px] font-extrabold text-slate-900 leading-none tabular-nums">{closed.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">ta buyurtma</div>
        </div>
        <div className="rounded-2xl bg-white border border-slate-200/70 p-4 text-center">
          <div className="text-[12px] text-slate-500 mb-1">Jami daromad</div>
          <div className="text-[20px] font-extrabold leading-none tabular-nums" style={{ color: NAVY }}>
            {fmt(totalRevenue)}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">UZS</div>
        </div>
      </div>

      {/* List */}
      <div className="px-4 md:px-8 space-y-2">
        {paged.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-[40px] mb-3">📋</div>
            <div className="text-[15px] font-semibold text-slate-700">Tugatilgan buyurtmalar yo'q</div>
            <div className="text-[13px] text-slate-500 mt-1">Buyurtmalar tugatilgach shu yerda ko'rinadi</div>
          </div>
        ) : paged.map(o => (
          <HistoryRow key={o.id} order={o} onOpen={onOpen} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 md:px-8 mt-5 flex items-center justify-between gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1}
            className="tap h-10 px-4 rounded-xl border text-[13px] font-semibold disabled:opacity-30 flex items-center gap-1"
            style={{ borderColor: '#e2e8f0', color: '#475569' }}>
            <ChevronLeft size={15}/> Oldingi
          </button>

          <div className="flex items-center gap-1">
            {paginate(safePage, totalPages).map((p, i) =>
              p === '…' ? (
                <span key={`d${i}`} className="w-8 text-center text-[13px] text-slate-400">…</span>
              ) : (
                <button key={p} onClick={() => setPage(p)}
                  className="tap h-9 w-9 rounded-xl text-[13px] font-bold"
                  style={{
                    background: p === safePage ? NAVY : '#f1f5f9',
                    color:      p === safePage ? '#fff' : '#64748b',
                  }}>
                  {p}
                </button>
              )
            )}
          </div>

          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}
            className="tap h-10 px-4 rounded-xl border text-[13px] font-semibold disabled:opacity-30 flex items-center gap-1"
            style={{ borderColor: '#e2e8f0', color: '#475569' }}>
            Keyingi <ChevronRight size={15}/>
          </button>
        </div>
      )}

      {closed.length > 0 && (
        <div className="mt-2 text-center text-[12px] text-slate-400">
          {Math.min(safePage * PAGE_SIZE, closed.length)} / {closed.length} ko'rsatilmoqda
        </div>
      )}
    </div>
  );
}

function HistoryRow({ order, onOpen }) {
  const total   = orderTotal(order);
  const itemCnt = orderItemCount(order);
  const sub     = orderSubtotal(order);

  return (
    <button onClick={() => onOpen(order)}
      className="tap w-full rounded-2xl bg-white border border-slate-200/60 text-left overflow-hidden"
      style={{ boxShadow: '0 1px 4px rgba(15,23,42,.06)' }}>
      <div className="flex items-stretch">
        {/* Left accent bar */}
        <div className="w-1 shrink-0 rounded-l-2xl" style={{ background: NAVY }} />

        <div className="flex-1 min-w-0 px-4 py-3.5 flex items-center gap-3">
          {/* Table avatar */}
          <div className="h-11 w-11 rounded-xl grid place-items-center font-extrabold text-[12px] text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${ACCENT})` }}>
            {order.tableLabel.split(' · ')[0].replace(/\s/g, '')}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-extrabold text-slate-900 leading-none">
                {order.tableLabel.split(' · ')[0]}
              </span>
              <span className="text-[12px] text-slate-500">
                · {order.tableLabel.split(' · ')[1]}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[11.5px] text-slate-500 inline-flex items-center gap-1">
                <Inbox size={12}/> {itemCnt} ta taom
              </span>
              <span suppressHydrationWarning className="text-[11.5px] text-slate-400 inline-flex items-center gap-1">
                <Clock size={12}/> {minutesAgo(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right shrink-0">
            <div className="text-[15px] font-extrabold tabular-nums leading-none" style={{ color: NAVY }}>
              {fmt(total)}
            </div>
            <div className="text-[10.5px] text-slate-400 mt-0.5">UZS</div>
          </div>
        </div>

        {/* Right chevron */}
        <div className="flex items-center pr-3 text-slate-300">
          <ChevronRight size={16}/>
        </div>
      </div>
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
