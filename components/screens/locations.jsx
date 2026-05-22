'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Card, Button, Badge, Avatar, Drawer, PageHeader, EmptyState } from '../ui';
import {
  TABLES, ZONES, ORDERS,
  getZoneById, tablesInZone, getTableStatus, TABLE_STATUS_META,
  formatUZS, formatUZSShort, timeAgo,
} from '@/lib/data';

function TableCard({ table, info, onClick }) {
  const meta = TABLE_STATUS_META[info.status];
  const order = info.order;
  return (
    <button onClick={onClick}
      className="group relative bg-white rounded-xl border border-ink-100 shadow-card p-3.5 text-left hover:shadow-pop hover:border-accent/40 active:scale-[0.98] transition overflow-hidden">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: meta.dot }} />
      <div className="flex items-start justify-between pl-1.5 gap-2">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
             style={{ color: meta.fg }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
          {meta.label}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">{getZoneById(table.zoneId).short}</div>
      </div>

      <div className="pl-1.5 mt-3 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-ink-900 num leading-none">{table.number}</span>
        <span className="text-sm text-ink-400 font-medium">stol</span>
      </div>

      <div className="pl-1.5 mt-2 flex items-center gap-1.5 text-[11px] text-ink-500">
        <Icon name="Users" size={11} /> {table.seats} kishi
      </div>

      {order ? (
        <div className="mt-3 pt-3 border-t border-ink-100 pl-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-semibold text-ink-800">{order.number}</span>
            <span className="num font-bold text-navy-700">{formatUZSShort(order.total)}</span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-500">
            <Avatar initials={order.waiterAvatar} color={order.waiterColor} size={16} />
            <span className="truncate">{order.waiter.split(' ')[0]}</span>
            <span className="text-ink-300">·</span>
            <span className="shrink-0">{timeAgo(order.time).replace(' oldin', '')}</span>
          </div>
        </div>
      ) : info.status === 'reserved' ? (
        <div className="mt-3 pt-3 border-t border-ink-100 pl-1.5 text-[11px] text-warn font-medium">
          19:30 ga bron qilingan
        </div>
      ) : info.status === 'dirty' ? (
        <div className="mt-3 pt-3 border-t border-ink-100 pl-1.5 text-[11px] text-ink-500">
          Mijozlar ketdi · tozalash kerak
        </div>
      ) : (
        <div className="mt-3 pt-3 border-t border-ink-100 pl-1.5 text-[11px] text-success font-medium">
          Buyurtma qabul qilishga tayyor
        </div>
      )}
    </button>
  );
}

function TableDetail({ table, info, onClose, onMarkClean, onMarkReserved, onMarkFree, onNavigateOrders }) {
  const zone = getZoneById(table.zoneId);
  const meta = TABLE_STATUS_META[info.status];
  const order = info.order;

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="rounded-2xl p-5 text-white relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${zone.color} 0%, #1F4E79 100%)` }}>
        <div className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">{zone.name}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-5xl font-bold num leading-none">{table.number}</span>
          <span className="text-lg opacity-80">stol</span>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/15 backdrop-blur">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
            {meta.label}
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-90">
            <Icon name="Users" size={12} /> {table.seats} kishilik
          </span>
        </div>
      </div>

      {order ? (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Faol buyurtma</div>
          <div className="rounded-xl border border-ink-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-ink-900">{order.number}</span>
              <Badge status={order.status} size="sm" />
            </div>
            <div className="flex items-center gap-2">
              <Avatar initials={order.waiterAvatar} color={order.waiterColor} size={28} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink-800 truncate">{order.waiter}</div>
                <div className="text-[11px] text-ink-500">{order.itemCount} ta taom · {timeAgo(order.time)}</div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold num text-navy-700">{formatUZS(order.total)}</div>
              </div>
            </div>
            <Button variant="outline" fullWidth icon="ExternalLink" onClick={() => { onNavigateOrders(); onClose(); }}>
              Buyurtmani ochish
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Tezkor amallar</div>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="primary" icon="Plus" fullWidth>Yangi buyurtma qabul qilish</Button>
            {info.status !== 'reserved' && (
              <Button variant="outline" icon="CalendarClock" fullWidth onClick={onMarkReserved}>Bron qilish</Button>
            )}
            {info.status === 'dirty' && (
              <Button variant="success" icon="Sparkles" fullWidth onClick={onMarkClean}>Tozalash bajarildi</Button>
            )}
            {info.status === 'reserved' && (
              <Button variant="outline" icon="X" fullWidth onClick={onMarkFree}>Bronni bekor qilish</Button>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Bugungi statistika</div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-ink-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">Buyurtma</div>
            <div className="mt-1 text-xl font-bold num text-ink-900">{ORDERS.filter(o => o.tableId === table.id).length}</div>
          </div>
          <div className="rounded-lg bg-ink-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">Tushum</div>
            <div className="mt-1 text-xl font-bold num text-ink-900">{formatUZSShort(ORDERS.filter(o => o.tableId === table.id && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0))}</div>
          </div>
          <div className="rounded-lg bg-ink-50 p-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">Mijoz</div>
            <div className="mt-1 text-xl font-bold num text-ink-900">{ORDERS.filter(o => o.tableId === table.id).reduce((s, o) => s + Math.min(table.seats, 1 + Math.floor(o.itemCount / 2)), 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocationsScreen({ orders, staff, onNavigate }) {
  const [zoneFilter, setZoneFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openTableId, setOpenTableId]   = useState(null);
  const [tableOverrides, setTableOverrides] = useState({});

  const tablesWithInfo = TABLES.map(t => {
    const override = tableOverrides[t.id];
    if (override) return { table: t, info: { status: override } };
    return { table: t, info: getTableStatus(t.id, orders) };
  });

  const filtered = tablesWithInfo.filter(({ table, info }) => {
    if (zoneFilter !== 'all' && table.zoneId !== zoneFilter) return false;
    if (statusFilter !== 'all' && info.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    all:      tablesWithInfo.length,
    free:     tablesWithInfo.filter(x => x.info.status === 'free').length,
    occupied: tablesWithInfo.filter(x => x.info.status === 'occupied').length,
    reserved: tablesWithInfo.filter(x => x.info.status === 'reserved').length,
    dirty:    tablesWithInfo.filter(x => x.info.status === 'dirty').length,
  };

  const openEntry = openTableId ? tablesWithInfo.find(x => x.table.id === openTableId) : null;

  function setStatus(tableId, status) {
    setTableOverrides(s => ({ ...s, [tableId]: status }));
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Joylar"
        subtitle={`${TABLES.length} ta stol · ${ZONES.length} ta zona`}
        actions={
          <>
            <Button variant="outline" icon="LayoutGrid">Plan koʻrinishi</Button>
            <Button variant="primary" icon="Plus">Stol qoʻshish</Button>
          </>
        }
      />

      <div className="md:hidden mb-4 flex items-end justify-between gap-2">
        <p className="text-xs text-ink-500">{TABLES.length} ta stol · {ZONES.length} ta zona</p>
        <Button variant="primary" icon="Plus" size="sm">Qoʻshish</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { key: 'free',     label: 'Boʻsh',         color: '#27AE60', n: totals.free },
          { key: 'occupied', label: 'Band',          color: '#2E75B6', n: totals.occupied },
          { key: 'reserved', label: 'Bron qilingan', color: '#F39C12', n: totals.reserved },
          { key: 'dirty',    label: 'Yigʻish kerak', color: '#8a93a3', n: totals.dirty },
        ].map(s => (
          <Card key={s.key} className="!p-3 sm:!p-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">{s.label}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold num text-ink-900">{s.n}</span>
              <span className="text-xs text-ink-400">/ {TABLES.length}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(s.n / TABLES.length) * 100}%`, background: s.color }} />
            </div>
          </Card>
        ))}
      </div>

      <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto scrollbar-hide mb-3">
        <div className="flex gap-2 w-max sm:w-auto sm:flex-wrap">
          <button onClick={() => setZoneFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
              zoneFilter === 'all' ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
            }`}>
            <Icon name="LayoutGrid" size={12} />
            Barchasi ({TABLES.length})
          </button>
          {ZONES.map(z => {
            const count = tablesInZone(z.id).length;
            const active = zoneFilter === z.id;
            return (
              <button key={z.id} onClick={() => setZoneFilter(z.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
                  active ? 'text-white border-transparent' : 'bg-white text-ink-600 border-ink-200'
                }`}
                style={active ? { background: z.color } : null}>
                <Icon name={z.icon} size={12} />
                {z.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {[
          { v: 'all', label: 'Hammasi', dot: '#8a93a3' },
          { v: 'free', label: 'Boʻsh', dot: '#27AE60' },
          { v: 'occupied', label: 'Band', dot: '#2E75B6' },
          { v: 'reserved', label: 'Bron qilingan', dot: '#F39C12' },
          { v: 'dirty', label: 'Yigʻish kerak', dot: '#8a93a3' },
        ].map(s => {
          const active = statusFilter === s.v;
          return (
            <button key={s.v} onClick={() => setStatusFilter(s.v)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium border transition ${
                active ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'
              }`}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
              {s.label}
            </button>
          );
        })}
      </div>

      {zoneFilter === 'all' ? (
        ZONES.map(z => {
          const inZone = filtered.filter(x => x.table.zoneId === z.id);
          if (inZone.length === 0) return null;
          return (
            <div key={z.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                     style={{ background: z.color }}>
                  <Icon name={z.icon} size={14} />
                </div>
                <h3 className="font-semibold text-ink-900">{z.name}</h3>
                <span className="text-xs text-ink-400">· {inZone.length} ta stol</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {inZone.map(({ table, info }) => (
                  <TableCard key={table.id} table={table} info={info} onClick={() => setOpenTableId(table.id)} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full">
              <Card><EmptyState icon="SearchX" text="Bu filtr boʻyicha stol topilmadi" /></Card>
            </div>
          ) : filtered.map(({ table, info }) => (
            <TableCard key={table.id} table={table} info={info} onClick={() => setOpenTableId(table.id)} />
          ))}
        </div>
      )}

      <Drawer
        open={!!openEntry}
        onClose={() => setOpenTableId(null)}
        title={openEntry ? `${getZoneById(openEntry.table.zoneId).short} · ${openEntry.table.number}-stol` : ''}
        width={460}
      >
        {openEntry && <TableDetail
          table={openEntry.table}
          info={openEntry.info}
          onClose={() => setOpenTableId(null)}
          onNavigateOrders={() => onNavigate && onNavigate('orders')}
          onMarkClean={() => { setStatus(openEntry.table.id, 'free'); setOpenTableId(null); }}
          onMarkReserved={() => { setStatus(openEntry.table.id, 'reserved'); setOpenTableId(null); }}
          onMarkFree={() => { setStatus(openEntry.table.id, 'free'); setOpenTableId(null); }}
        />}
      </Drawer>
    </div>
  );
}
