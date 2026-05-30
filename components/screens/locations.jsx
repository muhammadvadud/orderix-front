'use client';
import { useState } from 'react';
import { Icon } from '../Icon';
import { Card, Button, Badge, Avatar, Drawer, Modal, Field, Input, Select, PageHeader, EmptyState } from '../ui';
import {
  ORDERS,
  TABLE_STATUS_META,
  formatUZS, formatUZSShort, timeAgo,
} from '@/lib/data';

const ZONE_ICONS = [
  'LayoutGrid','Trees','Crown','Sun','Home','Building2','Sofa','Hotel','Mountain',
  'Waves','Music','Dumbbell','Armchair','MapPin','Globe','Star','Users','Umbrella',
  'Ship','Compass','Tent','Coffee','Sunset','Flame','Sparkles','Heart',
];

const ZONE_COLORS = [
  '#1F4E79','#2E75B6','#27AE60','#F39C12','#E74C3C',
  '#8e44ad','#16a085','#2c3e50','#d35400','#c0392b',
  '#0097A7','#558B2F','#6D4C41','#37474F','#F06292',
];

function ZoneForm({ onSave, onCancel }) {
  const [name, setName]   = useState('');
  const [short, setShort] = useState('');
  const [icon, setIcon]   = useState('LayoutGrid');
  const [color, setColor] = useState('#1F4E79');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Zona nomi">
          <Input value={name} onChange={e => { setName(e.target.value); if (!short) setShort(e.target.value.slice(0, 8)); }} placeholder="masalan: Asosiy zal" />
        </Field>
        <Field label="Qisqa nom" hint="Maksimal 8 belgi">
          <Input value={short} onChange={e => setShort(e.target.value.slice(0, 8))} placeholder="masalan: Zal" />
        </Field>
      </div>
      <Field label="Icon tanlang">
        <div className="grid grid-cols-9 gap-1.5 p-1">
          {ZONE_ICONS.map(ic => (
            <button key={ic} type="button" onClick={() => setIcon(ic)} title={ic}
              className={`w-full aspect-square flex items-center justify-center rounded-lg border transition ${
                icon === ic
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'
              }`}
              style={icon === ic ? { background: color } : {}}>
              <Icon name={ic} size={16} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Rang tanlang">
        <div className="flex flex-wrap gap-2 p-1">
          {ZONE_COLORS.map(c => (
            <button key={c} type="button" onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-lg transition border-2 ${color === c ? 'scale-110 border-white ring-2 ring-offset-1' : 'border-transparent hover:scale-105'}`}
              style={{ background: c, ringColor: c }} />
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
               style={{ background: color }}>
            <Icon name={icon} size={16} />
          </div>
          <span className="text-[11px] text-ink-500">Ko'rinishi</span>
        </div>
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        <Button variant="primary" icon="Check"
          onClick={() => onSave({ name, short: short || name.slice(0, 8), icon, color })}
          disabled={!name.trim()}>
          Qoʻshish
        </Button>
      </div>
    </div>
  );
}

function TableForm({ zones, onSave, onCancel }) {
  const [zoneId, setZoneId] = useState(zones[0]?.id || '');
  const [seats, setSeats]   = useState(4);
  const [count, setCount]   = useState(1);

  const clampCount = n => Math.max(1, Math.min(99, n || 1));

  return (
    <div className="space-y-4">
      <Field label="Zona (bo'lim)">
        <Select
          value={zoneId}
          onChange={e => setZoneId(e.target.value)}
          options={zones.map(z => ({ value: z.id, label: z.name }))}
        />
      </Field>
      <Field label="O'rindiqlar soni">
        <div className="flex gap-2">
          {[2, 4, 6, 8, 10, 12].map(n => (
            <button key={n} type="button" onClick={() => setSeats(n)}
              className={`flex-1 h-10 rounded-lg border text-sm font-semibold transition ${
                seats === n
                  ? 'bg-navy-700 text-white border-navy-700'
                  : 'bg-white text-ink-700 border-ink-200 hover:bg-ink-50'
              }`}>
              {n}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-500">
          <Icon name="Users" size={12} />
          {seats} kishilik stol
        </div>
      </Field>
      <Field label="Stollar soni" hint="Bir vaqtda nechta stol qoʻshilsin">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setCount(c => clampCount(c - 1))}
            className="w-10 h-10 shrink-0 rounded-lg border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 inline-flex items-center justify-center transition">
            <Icon name="Minus" size={16} />
          </button>
          <Input type="number" value={count} className="flex-1 text-center"
            onChange={e => setCount(clampCount(parseInt(e.target.value, 10)))} />
          <button type="button" onClick={() => setCount(c => clampCount(c + 1))}
            className="w-10 h-10 shrink-0 rounded-lg border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 inline-flex items-center justify-center transition">
            <Icon name="Plus" size={16} />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[1, 5, 10, 12, 15, 20].map(n => (
            <button key={n} type="button" onClick={() => setCount(n)}
              className={`px-2.5 h-7 rounded-md border text-xs font-medium transition ${
                count === n
                  ? 'bg-navy-700 text-white border-navy-700'
                  : 'bg-white text-ink-600 border-ink-200 hover:bg-ink-50'
              }`}>
              {n} ta
            </button>
          ))}
        </div>
      </Field>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>Bekor qilish</Button>
        <Button variant="primary" icon="Check"
          onClick={() => onSave({ zoneId, seats, count })}
          disabled={!zoneId}>
          {count > 1 ? `${count} ta stol qoʻshish` : 'Qoʻshish'}
        </Button>
      </div>
    </div>
  );
}

function TableCard({ table, zone, info, onClick }) {
  const meta = TABLE_STATUS_META[info.status];
  const order = info.order;
  return (
    <button onClick={onClick}
      className="group relative bg-white rounded-xl border border-ink-100 shadow-card p-3.5 text-left hover:shadow-pop hover:border-accent/40 active:scale-[0.98] transition overflow-hidden w-full">
      <span className="absolute left-0 top-0 bottom-0 w-1" style={{ background: meta.dot }} />
      <div className="flex items-start justify-between pl-1.5 gap-2">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider"
             style={{ color: meta.fg }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.dot }} />
          {meta.label}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-ink-400 font-semibold">{zone?.short || zone?.name}</div>
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

function TableDetail({ table, zone, info, onClose, onMarkClean, onNavigateOrders }) {
  const meta = TABLE_STATUS_META[info.status];
  const order = info.order;

  return (
    <div className="p-4 sm:p-5 space-y-5">
      <div className="rounded-2xl p-5 text-white relative overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${zone?.color || '#1F4E79'} 0%, #1F4E79 100%)` }}>
        <div className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">{zone?.name}</div>
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
            {info.status === 'dirty' && (
              <Button variant="success" icon="Sparkles" fullWidth onClick={onMarkClean}>Tozalash bajarildi</Button>
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

export default function LocationsScreen({ orders, staff, zones, setZones, tables, setTables, onNavigate }) {
  const [zoneFilter, setZoneFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openTableId, setOpenTableId]   = useState(null);
  const [tableOverrides, setTableOverrides] = useState({});
  const [addTableModal, setAddTableModal]   = useState(false);
  const [addZoneModal, setAddZoneModal]     = useState(false);

  function getTableStatus(tableId) {
    const active = orders.find(o => o.tableId === tableId && (o.status === 'open' || o.status === 'in_progress' || o.status === 'ready'));
    if (active) return { status: 'occupied', order: active };
    const override = tableOverrides[tableId];
    if (override) return { status: override };
    const t = tables.find(t => t.id === tableId);
    return { status: t?.initStatus || 'free' };
  }

  const tablesWithInfo = tables.map(t => ({
    table: t,
    zone: zones.find(z => z.id === t.zoneId),
    info: getTableStatus(t.id),
  }));

  const filtered = tablesWithInfo.filter(({ table, info }) => {
    if (zoneFilter !== 'all' && table.zoneId !== zoneFilter) return false;
    if (statusFilter !== 'all' && info.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    all:      tablesWithInfo.length,
    free:     tablesWithInfo.filter(x => x.info.status === 'free').length,
    occupied: tablesWithInfo.filter(x => x.info.status === 'occupied').length,
    dirty:    tablesWithInfo.filter(x => x.info.status === 'dirty').length,
  };

  const openEntry = openTableId ? tablesWithInfo.find(x => x.table.id === openTableId) : null;

  function setStatus(tableId, status) {
    setTableOverrides(s => ({ ...s, [tableId]: status }));
  }

  function handleAddZone(data) {
    const id = `z${Date.now()}`;
    setZones(list => [...list, { id, ...data }]);
    setAddZoneModal(false);
  }

  function handleAddTable({ zoneId, seats, count = 1 }) {
    const inZone = tables.filter(t => t.zoneId === zoneId);
    let nextNumber = inZone.length > 0 ? Math.max(...inZone.map(t => t.number)) + 1 : 1;
    const stamp = Date.now();
    const added = [];
    for (let i = 0; i < count; i++) {
      added.push({ id: `t${stamp}-${i}`, zoneId, number: nextNumber++, seats });
    }
    setTables(list => [...list, ...added]);
    setAddTableModal(false);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Joylar"
        subtitle={`${tables.length} ta stol · ${zones.length} ta zona`}
        actions={
          <>
            <Button variant="outline" icon="Layers" onClick={() => setAddZoneModal(true)}>Zona qoʻshish</Button>
            <Button variant="primary" icon="Plus" onClick={() => setAddTableModal(true)}>Stol qoʻshish</Button>
          </>
        }
      />

      <div className="md:hidden mb-4 flex items-end justify-between gap-2">
        <p className="text-xs text-ink-500">{tables.length} ta stol · {zones.length} ta zona</p>
        <div className="flex gap-2">
          <Button variant="outline" icon="Layers" size="sm" onClick={() => setAddZoneModal(true)}>Zona</Button>
          <Button variant="primary" icon="Plus" size="sm" onClick={() => setAddTableModal(true)}>Stol</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { key: 'free',     label: 'Boʻsh',         color: '#27AE60', n: totals.free },
          { key: 'occupied', label: 'Band',          color: '#2E75B6', n: totals.occupied },
          { key: 'dirty',    label: 'Yigʻish kerak', color: '#8a93a3', n: totals.dirty },
        ].map(s => (
          <Card key={s.key} className="!p-3 sm:!p-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-400 font-semibold">{s.label}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-bold num text-ink-900">{s.n}</span>
              <span className="text-xs text-ink-400">/ {tables.length}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-ink-100 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${tables.length ? (s.n / tables.length) * 100 : 0}%`, background: s.color }} />
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
            Barchasi ({tables.length})
          </button>
          {zones.map(z => {
            const count = tables.filter(t => t.zoneId === z.id).length;
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
        zones.map(z => {
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
                {inZone.map(({ table, zone, info }) => (
                  <TableCard key={table.id} table={table} zone={zone} info={info} onClick={() => setOpenTableId(table.id)} />
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
          ) : filtered.map(({ table, zone, info }) => (
            <TableCard key={table.id} table={table} zone={zone} info={info} onClick={() => setOpenTableId(table.id)} />
          ))}
        </div>
      )}

      {tables.length === 0 && (
        <Card className="text-center py-16">
          <div className="inline-flex flex-col items-center gap-3 text-ink-400">
            <div className="w-12 h-12 rounded-full bg-ink-100 inline-flex items-center justify-center">
              <Icon name="Armchair" size={22} />
            </div>
            <div className="text-sm">Hali stol qoʻshilmagan</div>
            <Button variant="primary" icon="Plus" onClick={() => setAddTableModal(true)}>Birinchi stolni qoʻshing</Button>
          </div>
        </Card>
      )}

      {/* Mobile FAB */}
      <button onClick={() => setAddTableModal(true)}
        className="md:hidden fixed right-4 z-30 w-14 h-14 rounded-full bg-navy-700 text-white shadow-pop hover:bg-navy-800 active:scale-95 inline-flex items-center justify-center transition"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}>
        <Icon name="Plus" size={22} />
      </button>

      <Drawer
        open={!!openEntry}
        onClose={() => setOpenTableId(null)}
        title={openEntry ? `${openEntry.zone?.short || ''} · ${openEntry.table.number}-stol` : ''}
        width={460}
      >
        {openEntry && <TableDetail
          table={openEntry.table}
          zone={openEntry.zone}
          info={openEntry.info}
          onClose={() => setOpenTableId(null)}
          onNavigateOrders={() => onNavigate && onNavigate('orders')}
          onMarkClean={() => { setStatus(openEntry.table.id, 'free'); setOpenTableId(null); }}
        />}
      </Drawer>

      <Modal open={addTableModal} onClose={() => setAddTableModal(false)} title="Stol qoʻshish" width={400}>
        {addTableModal && zones.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-sm text-ink-500 mb-4">Stol qoʻshish uchun avval zona yarating</div>
            <Button variant="primary" icon="Layers" onClick={() => { setAddTableModal(false); setAddZoneModal(true); }}>
              Zona qoʻshish
            </Button>
          </div>
        ) : (
          addTableModal && <TableForm zones={zones} onSave={handleAddTable} onCancel={() => setAddTableModal(false)} />
        )}
      </Modal>

      <Modal open={addZoneModal} onClose={() => setAddZoneModal(false)} title="Zona / boʻlim qoʻshish" width={480}>
        {addZoneModal && <ZoneForm onSave={handleAddZone} onCancel={() => setAddZoneModal(false)} />}
      </Modal>
    </div>
  );
}
