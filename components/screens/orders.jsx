'use client';
import { useState, useMemo } from 'react';
import { Icon } from '../Icon';
import {
  Card, Button, IconButton, Badge, Avatar, Input, Select,
  PageHeader, EmptyRow, EmptyState, Drawer,
} from '../ui';
import {
  STATUSES, STATUS_META, ITEM_STATUS_META,
  formatUZS, formatUZSShort, formatTime, formatDate, timeAgo,
} from '@/lib/data';
import { exportXLSX, ordersToRows, dateStamp } from '@/lib/export';

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function withinRange(time, range, now) {
  const t = time instanceof Date ? time : (time ? new Date(time) : null);
  if (!t) return false;
  if (range === 'today') return isSameDay(t, now);
  if (range === 'yesterday') {
    const y = new Date(now); y.setDate(now.getDate() - 1);
    return isSameDay(t, y);
  }
  if (range === '7d') {
    const c = new Date(now); c.setDate(now.getDate() - 6); c.setHours(0, 0, 0, 0);
    return t >= c;
  }
  if (range === '30d') {
    const c = new Date(now); c.setDate(now.getDate() - 29); c.setHours(0, 0, 0, 0);
    return t >= c;
  }
  return true;
}

function OrderDetail({ order, menu = [], categories = [], serviceRate = 0.1, onChangeStatus, onEdit, onChangeItemStatus }) {
  const [editMode, setEditMode] = useState(false);
  const [editItems, setEditItems] = useState([]);
  const [activeCat, setActiveCat] = useState(categories[0]?.id || '');

  const canEdit = order.status !== 'cancelled' && order.status !== 'closed';

  function startEdit() {
    setEditItems(order.items.map(it => ({ ...it })));
    setActiveCat(categories[0]?.id || '');
    setEditMode(true);
  }
  function cancelEdit() { setEditMode(false); setEditItems([]); }

  function changeQty(menuId, menuName, menuPrice, delta) {
    setEditItems(prev => {
      const idx = prev.findIndex(it => it.menuId === menuId);
      if (idx === -1 && delta > 0) {
        return [...prev, { id: `${menuId}-new`, menuId, name: menuName, qty: 1, price: menuPrice }];
      }
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

  // Tahrirlashda buyurtmaning o'z xizmat haqidan foydalanamiz (backend recalc ham shuni ishlatadi)
  const orderRate      = order.serviceRate != null ? order.serviceRate / 100 : serviceRate;
  const editSubtotal   = editItems.reduce((s, it) => s + it.price * it.qty, 0);
  const editServiceFee = Math.round(editSubtotal * orderRate);
  const editTotal      = editSubtotal + editServiceFee;

  if (editMode) {
    return (
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-ink-800">Buyurtmani tahrirlash</div>
          <button onClick={cancelEdit} className="text-xs font-medium text-ink-500 hover:text-ink-700 flex items-center gap-1">
            <Icon name="X" size={12} /> Bekor qilish
          </button>
        </div>

        {/* Current items with qty controls */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Tarkibdagi taomlar
          </div>
          <div className="rounded-lg border border-ink-100 overflow-hidden">
            {editItems.length === 0 && (
              <div className="px-4 py-5 text-center text-sm text-ink-400">
                Hech qanday taom qoʻshilmagan
              </div>
            )}
            {editItems.map((it, i) => (
              <div key={it.menuId} className={`flex items-center gap-3 px-3.5 py-2.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink-900 truncate">{it.name}</div>
                  <div className="text-[11px] text-ink-500 num">{formatUZSShort(it.price * it.qty)} soʻm</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <IconButton name="Minus" label="−" size={28} variant="outline" onClick={() => changeQty(it.menuId, it.name, it.price, -1)} />
                  <span className="text-sm font-bold num w-6 text-center">{it.qty}</span>
                  <IconButton name="Plus"  label="+" size={28} variant="outline" onClick={() => changeQty(it.menuId, it.name, it.price, +1)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add from menu */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
            Taom qoʻshish
          </div>
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-2.5 pb-0.5">
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)}
                className={`shrink-0 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition whitespace-nowrap flex items-center gap-1 ${
                  activeCat === c.id
                    ? 'bg-navy-700 text-white border-navy-700'
                    : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'
                }`}>
                <Icon name={c.icon} size={10} />
                {c.short}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            {menu.filter(m => m.category === activeCat).map(m => (
              <div key={m.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-ink-100 bg-white">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink-800 truncate">{m.name}</div>
                  <div className="text-[11px] num text-ink-500">{formatUZSShort(m.price)} soʻm</div>
                </div>
                <Button variant="soft" size="sm" icon="Plus"
                  onClick={() => changeQty(m.id, m.name, m.price, +1)}>
                  Qoʻshish
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Updated total */}
        <div className="rounded-lg bg-navy-50/60 border border-navy-100 p-3.5 space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Oraliq summa</span>
            <span className="num text-ink-900">{formatUZS(editSubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-ink-600">Xizmat haqi ({Math.round(orderRate * 100)}%)</span>
            <span className="num text-ink-900">{formatUZS(editServiceFee)}</span>
          </div>
          <div className="h-px bg-navy-100" />
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-ink-700">Jami</span>
            <span className="num text-lg font-bold text-navy-800">{formatUZS(editTotal)}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="outline" fullWidth onClick={cancelEdit}>Bekor qilish</Button>
          <Button variant="primary" icon="Check" fullWidth onClick={saveEdit} disabled={editItems.length === 0}>
            Saqlash
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Badge status={order.status} />
        <div className="flex items-center gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" icon="Pencil" onClick={startEdit}>
              Tahrirlash
            </Button>
          )}
          <div className="text-xs text-ink-500">{formatDate(order.time)} · {formatTime(order.time)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-ink-50 p-3">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Joy</div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: order.zoneColor }} />
            <div className="text-sm font-medium text-ink-900">{order.zone}</div>
          </div>
          <div className="text-xs text-ink-500 num mt-0.5">{order.tableNumber}-stol · {order.tableSeats} kishilik</div>
        </div>
        <div className="rounded-lg bg-ink-50 p-3">
          <div className="text-[10.5px] uppercase tracking-wider text-ink-400 font-semibold">Ofitsiant</div>
          <div className="flex items-center gap-2 mt-1">
            <Avatar initials={order.waiterAvatar} color={order.waiterColor} size={24} />
            <div className="text-sm font-medium text-ink-900 truncate">{order.waiter}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Holatni oʻzgartirish</div>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => {
            const meta = STATUS_META[s];
            const active = order.status === s;
            return (
              <button key={s} onClick={() => onChangeStatus(s)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  active ? 'border-transparent text-white shadow-sm' : 'border-ink-200 text-ink-600 hover:border-ink-300 bg-white'
                }`}
                style={active ? { background: meta.dot } : null}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? '#ffffff' : meta.dot }} />
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">
          Taomlar ({order.itemCount})
        </div>
        <div className="rounded-lg border border-ink-100 overflow-hidden">
          {order.items.map((it, i) => {
            const itemMeta = ITEM_STATUS_META[it.status || 'preparing'];
            return (
              <div key={it.id} className={`px-3.5 py-2.5 ${i > 0 ? 'border-t border-ink-100' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-ink-100 text-ink-500 text-xs font-bold inline-flex items-center justify-center num shrink-0">×{it.qty}</div>
                    <div className="min-w-0">
                      <div className={`text-sm font-medium truncate ${it.status === 'cancelled' ? 'line-through text-ink-400' : 'text-ink-900'}`}>{it.name}</div>
                      <div className="text-[11px] text-ink-500 num">{formatUZS(it.price)} / dona</div>
                    </div>
                  </div>
                  <div className="text-sm num font-semibold text-ink-900 whitespace-nowrap shrink-0">{formatUZSShort(it.price * it.qty)}</div>
                </div>
                {/* Per-item status buttons — yopilgan/bekor qilingan buyurtmada yashiriladi */}
                {canEdit && (
                <div className="flex gap-1 mt-2">
                  {Object.entries(ITEM_STATUS_META).map(([key, meta]) => (
                    <button key={key}
                      onClick={() => onChangeItemStatus(order.id, it.id, key)}
                      className="flex-1 py-1 rounded-md text-[10.5px] font-semibold border transition inline-flex items-center justify-center gap-1"
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
      </div>

      <div className="rounded-lg bg-navy-50/60 border border-navy-100 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-ink-600">Oraliq summa</span>
          <span className="num text-ink-900">{formatUZS(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-600">Xizmat haqi ({Math.round(orderRate * 100)}%)</span>
          <span className="num text-ink-900">{formatUZS(order.serviceFee)}</span>
        </div>
        <div className="h-px bg-navy-100 my-1" />
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-ink-700">Jami</span>
          <span className="num text-xl font-bold text-navy-800">{formatUZS(order.total)}</span>
        </div>
      </div>
    </div>
  );
}

export default function OrdersScreen({ orders, staff = [], menu = [], categories = [], openOrderId, setOpenOrderId, orderDetail, serviceRate = 0.1, onUpdateStatus, onChangeItemStatus, onEditOrder }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [waiterFilter, setWaiterFilter] = useState('');
  const [dateRange,   setDateRange]     = useState('today');
  const [query,       setQuery]         = useState('');
  const [sort,        setSort]          = useState({ key: 'time', dir: 'desc' });
  const [showFilters, setShowFilters]   = useState(false);

  const waiters = staff.filter(s => s.roleRaw === 'waiter');

  const dateFiltered = useMemo(() => {
    const now = new Date();
    return orders.filter(o => withinRange(o.time, dateRange, now));
  }, [orders, dateRange]);

  const filtered = useMemo(() => {
    let list = [...dateFiltered];
    if (statusFilter) list = list.filter(o => o.status === statusFilter);
    if (waiterFilter) list = list.filter(o => o.waiterId === waiterFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(o =>
        o.number.toLowerCase().includes(q) ||
        o.waiter.toLowerCase().includes(q) ||
        String(o.tableNumber).includes(q) ||
        o.zone.toLowerCase().includes(q) ||
        o.zoneShort.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1;
      if (sort.key === 'time')   return (a.time - b.time) * dir;
      if (sort.key === 'total')  return (a.total - b.total) * dir;
      if (sort.key === 'items')  return (a.itemCount - b.itemCount) * dir;
      if (sort.key === 'number') return a.number.localeCompare(b.number) * dir;
      if (sort.key === 'waiter') return a.waiter.localeCompare(b.waiter) * dir;
      if (sort.key === 'status') return a.status.localeCompare(b.status) * dir;
      return 0;
    });
    return list;
  }, [dateFiltered, statusFilter, waiterFilter, query, sort]);

  function exportExcel() {
    exportXLSX(`buyurtmalar-${dateStamp()}.xlsx`, ordersToRows(filtered), 'Buyurtmalar');
  }

  // Detail API'dan kelgan to'liq buyurtma (taomlar bilan); kelguncha list'dagi qisqa nusxa.
  const open = (orderDetail && orderDetail.id === openOrderId)
    ? orderDetail
    : orders.find(o => o.id === openOrderId);

  function toggleSort(key) {
    setSort(s => s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'desc' }
    );
  }

  function updateStatus(id, newStatus) {
    onUpdateStatus(id, newStatus);
  }
  function closeOrder(id) {
    onUpdateStatus(id, 'closed');
  }
  function changeItemStatus(orderId, itemId, newStatus) {
    onChangeItemStatus(orderId, itemId, newStatus);
  }
  function editOrder(id, newItems) {
    onEditOrder(id, newItems);
  }

  function SortHeader({ k, children, align = 'left' }) {
    const active = sort.key === k;
    return (
      <th className={`font-semibold px-3 py-2.5 text-${align}`}>
        <button onClick={() => toggleSort(k)} className={`inline-flex items-center gap-1 hover:text-ink-700 ${active ? 'text-ink-700' : ''}`}>
          {children}
          <Icon name={active ? (sort.dir === 'asc' ? 'ArrowUp' : 'ArrowDown') : 'ChevronsUpDown'} size={12} />
        </button>
      </th>
    );
  }

  const activeFilterCount = (statusFilter ? 1 : 0) + (waiterFilter ? 1 : 0);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Buyurtmalar"
        subtitle={`Jami ${orders.length} dan ${filtered.length} ta koʻrsatilmoqda`}
        actions={
          <>
            <Button variant="outline" icon="Download" size="md" onClick={exportExcel} disabled={filtered.length === 0}>Excel eksport</Button>
            <Button variant="primary" icon="Plus" size="md">Yangi buyurtma</Button>
          </>
        }
      />

      <div className="lg:hidden mb-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max pb-1">
          <button onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
              !statusFilter ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
            }`}>
            Barchasi <span className="opacity-70">({dateFiltered.length})</span>
          </button>
          {STATUSES.map(s => {
            const count = dateFiltered.filter(o => o.status === s).length;
            const active = statusFilter === s;
            const meta = STATUS_META[s];
            return (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
                  active ? 'text-white border-transparent' : 'bg-white text-ink-600 border-ink-200'
                }`}
                style={active ? { background: meta.dot } : null}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: active ? 'white' : meta.dot }} />
                {meta.label} <span className="opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <Card className="mb-4" padding={false}>
        <div className="lg:hidden p-3 flex gap-2 items-center">
          <Input icon="Search" placeholder="Qidirish…"
                 value={query} onChange={e => setQuery(e.target.value)} className="flex-1" />
          <button onClick={() => setShowFilters(s => !s)}
            className="relative h-10 px-3 rounded-lg border border-ink-200 bg-white flex items-center gap-1.5 text-sm font-medium text-ink-700">
            <Icon name="SlidersHorizontal" size={16} />
            {activeFilterCount > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-bold inline-flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>
        {showFilters && (
          <div className="lg:hidden border-t border-ink-100 p-3 grid grid-cols-1 gap-2 anim-fade">
            <Select value={waiterFilter} onChange={e => setWaiterFilter(e.target.value)}
                    placeholder="Barcha ofitsiantlar"
                    options={waiters.map(w => ({ value: w.id, label: w.name }))} />
            <Select value={dateRange} onChange={e => setDateRange(e.target.value)}
                    options={[
                      { value: 'today', label: 'Bugun' },
                      { value: 'yesterday', label: 'Kecha' },
                      { value: '7d', label: 'Soʻnggi 7 kun' },
                      { value: '30d', label: 'Soʻnggi 30 kun' },
                    ]} />
            {(statusFilter || waiterFilter || query) && (
              <Button variant="ghost" icon="X" fullWidth
                onClick={() => { setStatusFilter(''); setWaiterFilter(''); setQuery(''); }}>
                Filtrlarni tozalash
              </Button>
            )}
          </div>
        )}

        <div className="hidden lg:flex p-4 flex-wrap items-center gap-3">
          <Input icon="Search" placeholder="№, ofitsiant yoki stol boʻyicha qidirish…"
                 value={query} onChange={e => setQuery(e.target.value)} className="flex-1 min-w-[240px]" />
          <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  placeholder="Barcha holatlar"
                  options={STATUSES.map(s => ({ value: s, label: STATUS_META[s].label }))}
                  className="w-44" />
          <Select value={waiterFilter} onChange={e => setWaiterFilter(e.target.value)}
                  placeholder="Barcha ofitsiantlar"
                  options={waiters.map(w => ({ value: w.id, label: w.name }))}
                  className="w-52" />
          <Select value={dateRange} onChange={e => setDateRange(e.target.value)}
                  options={[
                    { value: 'today', label: 'Bugun' },
                    { value: 'yesterday', label: 'Kecha' },
                    { value: '7d', label: 'Soʻnggi 7 kun' },
                    { value: '30d', label: 'Soʻnggi 30 kun' },
                  ]} className="w-44" />
          {(statusFilter || waiterFilter || query) && (
            <Button variant="ghost" icon="X" size="md"
              onClick={() => { setStatusFilter(''); setWaiterFilter(''); setQuery(''); }}>
              Tozalash
            </Button>
          )}
        </div>
      </Card>

      <div className="lg:hidden space-y-2">
        {filtered.length === 0 ? (
          <Card><EmptyState icon="SearchX" text="Hech qanday buyurtma topilmadi" /></Card>
        ) : filtered.slice(0, 60).map(o => (
          <div key={o.id}
            className="w-full bg-white rounded-xl border border-ink-100 shadow-card text-left active:bg-ink-50/50 transition overflow-hidden">
            <div className="p-3.5 flex items-center gap-3 cursor-pointer" onClick={() => setOpenOrderId(o.id)}>
              <Avatar initials={o.waiterAvatar} color={o.waiterColor} size={40} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-ink-900 text-sm">{o.number}</span>
                  <span className="text-[11px] text-ink-500 truncate">{o.zoneShort} · {o.tableNumber}-stol</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge status={o.status} size="sm" />
                  <span className="text-[11px] text-ink-500">{o.itemCount} ta</span>
                  <span className="text-[11px] text-ink-300">·</span>
                  <span className="text-[11px] text-ink-500">{o.waiter.split(' ')[0]}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="num font-bold text-ink-900 text-sm whitespace-nowrap">{formatUZSShort(o.total)}</div>
                <div className="text-[10.5px] text-ink-400 mt-0.5">{formatTime(o.time)}</div>
              </div>
            </div>
            {o.status !== 'closed' && (
              <div className="flex gap-2 px-3.5 pb-3 pt-1">
                {o.status !== 'delivered' && (
                  <button
                    onClick={() => updateStatus(o.id, 'delivered')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition active:scale-[.97]"
                    style={{ background: '#27AE60', boxShadow: '0 1px 3px rgba(39,174,96,.35)' }}>
                    <Icon name="CheckCircle" size={14} />
                    Yetkazildi
                  </button>
                )}
                <button
                  onClick={() => updateStatus(o.id, 'closed')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition active:scale-[.97]"
                  style={{ background: '#64748b', boxShadow: '0 1px 3px rgba(100,116,139,.35)' }}>
                  <Icon name="CheckSquare" size={14} />
                  Tugatildi
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <Card padding={false} className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/50 border-b border-ink-100">
                <SortHeader k="number">№</SortHeader>
                <th className="font-semibold px-3 py-2.5">Joy / Stol</th>
                <SortHeader k="waiter">Ofitsiant</SortHeader>
                <SortHeader k="items" align="center">Taomlar</SortHeader>
                <SortHeader k="status">Holat</SortHeader>
                <SortHeader k="total" align="right">Jami</SortHeader>
                <SortHeader k="time" align="right">Vaqt</SortHeader>
                <th className="font-semibold px-3 py-2.5 text-right">‎</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.length === 0 ? (
                <EmptyRow colSpan={8} icon="SearchX" text="Hech qanday buyurtma topilmadi" />
              ) : filtered.slice(0, 60).map(o => (
                <tr key={o.id} className={`hover:bg-ink-50/60 cursor-pointer transition-colors ${o.id === openOrderId ? 'bg-accent-50' : ''}`}
                    onClick={() => setOpenOrderId(o.id)}>
                  <td className="px-5 py-3 font-mono font-semibold text-ink-900">{o.number}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: o.zoneColor }} />
                      <span className="text-ink-800 font-medium">{o.zoneShort}</span>
                    </div>
                    <div className="text-[11px] text-ink-500 num mt-0.5">{o.tableNumber}-stol · {o.tableSeats} kishi</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={o.waiterAvatar} color={o.waiterColor} size={26} />
                      <span className="text-ink-700">{o.waiter}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center num text-ink-700">{o.itemCount}</td>
                  <td className="px-3 py-3"><Badge status={o.status} size="sm" /></td>
                  <td className="px-3 py-3 text-right num font-semibold text-ink-900">{formatUZSShort(o.total)}</td>
                  <td className="px-3 py-3 text-right text-ink-500 text-xs">
                    {formatTime(o.time)}
                    <div className="text-[10px] text-ink-400">{timeAgo(o.time)}</div>
                  </td>
                  <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {o.status !== 'delivered' && o.status !== 'closed' && (
                        <button
                          onClick={() => updateStatus(o.id, 'delivered')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white transition hover:opacity-90 whitespace-nowrap"
                          style={{ background: '#27AE60', boxShadow: '0 1px 3px rgba(39,174,96,.4)' }}>
                          <Icon name="CheckCircle" size={12} />
                          Yetkazildi
                        </button>
                      )}
                      {o.status !== 'closed' && (
                        <button
                          onClick={() => updateStatus(o.id, 'closed')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white transition hover:opacity-90 whitespace-nowrap"
                          style={{ background: '#64748b', boxShadow: '0 1px 3px rgba(100,116,139,.4)' }}>
                          <Icon name="CheckSquare" size={12} />
                          Tugatildi
                        </button>
                      )}
                      <Icon name="ChevronRight" size={14} className="text-ink-300 inline ml-0.5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
          <div>{Math.min(60, filtered.length)} / {filtered.length} koʻrsatilmoqda</div>
          <div className="flex items-center gap-1">
            <IconButton name="ChevronLeft" label="Oldingi" variant="outline" size={28} />
            <span className="px-2">1 / {Math.max(1, Math.ceil(filtered.length / 60))}</span>
            <IconButton name="ChevronRight" label="Keyingi" variant="outline" size={28} />
          </div>
        </div>
      </Card>

      <Drawer
        open={!!open}
        onClose={() => setOpenOrderId(null)}
        title={open ? `Buyurtma ${open.number}` : ''}
        width={520}
        footer={open && (
          <>
            <Button variant="outline" icon="Printer">Chop etish</Button>
            {open.status !== 'closed' && (
              <Button variant="primary" icon="CheckSquare" onClick={() => closeOrder(open.id)}>Yopish</Button>
            )}
          </>
        )}
      >
        {open && <OrderDetail order={open} menu={menu} categories={categories} serviceRate={serviceRate} onChangeStatus={(s) => updateStatus(open.id, s)} onEdit={editOrder} onChangeItemStatus={changeItemStatus} />}
      </Drawer>
    </div>
  );
}
