'use client';
import { useState, useMemo } from 'react';
import { Icon } from '../Icon';
import {
  Card, Button, IconButton, Badge, Avatar, Input, Select,
  PageHeader, EmptyRow, EmptyState, Drawer,
} from '../ui';
import {
  STAFF, STATUSES, STATUS_META,
  formatUZS, formatUZSShort, formatTime, formatDate, timeAgo,
} from '@/lib/data';

function OrderDetail({ order, onChangeStatus }) {
  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="flex items-center justify-between">
        <Badge status={order.status} />
        <div className="text-xs text-ink-500">{formatDate(order.time)} · {formatTime(order.time)}</div>
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
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Taomlar ({order.itemCount})</div>
        <div className="rounded-lg border border-ink-100 overflow-hidden">
          {order.items.map((it, i) => (
            <div key={it.id} className={`flex items-center justify-between px-3.5 py-3 ${i > 0 ? 'border-t border-ink-100' : ''}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-md bg-ink-100 text-ink-500 text-xs font-bold inline-flex items-center justify-center num shrink-0">×{it.qty}</div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-ink-900 truncate">{it.name}</div>
                  <div className="text-[11px] text-ink-500 num">{formatUZS(it.price)} / dona</div>
                </div>
              </div>
              <div className="text-sm num font-semibold text-ink-900 whitespace-nowrap">{formatUZSShort(it.price * it.qty)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-navy-50/60 border border-navy-100 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-ink-600">Oraliq summa</span>
          <span className="num text-ink-900">{formatUZS(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-ink-600">Xizmat haqi (10%)</span>
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

export default function OrdersScreen({ orders, setOrders, openOrderId, setOpenOrderId }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [waiterFilter, setWaiterFilter] = useState('');
  const [dateRange,   setDateRange]     = useState('today');
  const [query,       setQuery]         = useState('');
  const [sort,        setSort]          = useState({ key: 'time', dir: 'desc' });
  const [showFilters, setShowFilters]   = useState(false);

  const waiters = STAFF.filter(s => s.role === 'Ofitsiant');

  const filtered = useMemo(() => {
    let list = [...orders];
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
  }, [orders, statusFilter, waiterFilter, query, sort]);

  const open = orders.find(o => o.id === openOrderId);

  function toggleSort(key) {
    setSort(s => s.key === key
      ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
      : { key, dir: 'desc' }
    );
  }

  function updateStatus(id, newStatus) {
    setOrders(list => list.map(o => o.id === id ? { ...o, status: newStatus } : o));
  }
  function cancelOrder(id) {
    setOrders(list => list.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
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
            <Button variant="outline" icon="Download" size="md">CSV eksport</Button>
            <Button variant="primary" icon="Plus" size="md">Yangi buyurtma</Button>
          </>
        }
      />

      <div className="md:hidden mb-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max pb-1">
          <button onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition ${
              !statusFilter ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
            }`}>
            Barchasi <span className="opacity-70">({orders.length})</span>
          </button>
          {STATUSES.map(s => {
            const count = orders.filter(o => o.status === s).length;
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
        <div className="md:hidden p-3 flex gap-2 items-center">
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
          <div className="md:hidden border-t border-ink-100 p-3 grid grid-cols-1 gap-2 anim-fade">
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

        <div className="hidden md:flex p-4 flex-wrap items-center gap-3">
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

      <div className="md:hidden space-y-2">
        {filtered.length === 0 ? (
          <Card><EmptyState icon="SearchX" text="Hech qanday buyurtma topilmadi" /></Card>
        ) : filtered.slice(0, 60).map(o => (
          <button key={o.id} onClick={() => setOpenOrderId(o.id)}
            className="w-full bg-white rounded-xl border border-ink-100 shadow-card p-3.5 flex items-center gap-3 text-left active:bg-ink-50 transition">
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
          </button>
        ))}
      </div>

      <Card padding={false} className="hidden md:block">
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
                  <td className="px-3 py-3 text-right">
                    <Icon name="ChevronRight" size={16} className="text-ink-300 inline" />
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
            {open.status !== 'cancelled' && open.status !== 'closed' && (
              <Button variant="danger" icon="Ban" onClick={() => cancelOrder(open.id)}>Bekor qilish</Button>
            )}
          </>
        )}
      >
        {open && <OrderDetail order={open} onChangeStatus={(s) => updateStatus(open.id, s)} />}
      </Drawer>
    </div>
  );
}
