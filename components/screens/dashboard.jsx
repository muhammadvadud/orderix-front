'use client';
import { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { Card, Button, Badge, Avatar, PageHeader, EmptyState, EmptyRow, Modal } from '../ui';
import {
  STATUSES, STATUS_META,
  formatUZSShort, formatTime, timeAgo,
} from '@/lib/data';
import { topItems } from '@/lib/services';
import { exportXLSX, ordersToRows, dateStamp } from '@/lib/export';

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function StatCard({ icon, iconBg, iconFg, label, value, sub }) {
  return (
    <Card className="!p-3.5 sm:!p-5">
      {/* Mobile: horizontal compact layout */}
      <div className="flex sm:hidden items-center gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
             style={{ background: iconBg, color: iconFg }}>
          <Icon name={icon} size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-ink-500 font-medium leading-tight">{label}</div>
          <div className="text-2xl font-bold text-ink-900 num leading-tight mt-0.5">{value}</div>
          {sub && <div className="text-[10.5px] text-ink-400 truncate mt-0.5">{sub}</div>}
        </div>
      </div>
      {/* Desktop: vertical layout */}
      <div className="hidden sm:block">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
               style={{ background: iconBg, color: iconFg }}>
            <Icon name={icon} size={18} />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-xs font-medium uppercase tracking-wider text-ink-400">{label}</div>
          <div className="mt-1 text-3xl font-bold text-ink-900 num tracking-tight leading-tight">{value}</div>
          {sub && <div className="mt-1 text-xs text-ink-500 truncate">{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

const TOP_ITEMS_PAGE_SIZE = 10;

function TopItemsWidget({ items, onOpenAll }) {
  const max = items.length ? Math.max(...items.map(i => i.qty)) : 0;
  const palette = ['#1F4E79', '#2E75B6', '#5786b3', '#8badcd', '#bcd0e4'];
  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-ink-900">Eng koʻp sotilgan</h3>
          <p className="text-xs text-ink-500 mt-0.5">Bugun eng koʻp buyurtma qilingan</p>
        </div>
        <button className="text-xs text-accent font-medium hover:underline" onClick={onOpenAll}>Barchasi</button>
      </div>
      {items.length === 0 ? (
        <EmptyState icon="TrendingUp" text="Hali sotuvlar yoʻq" />
      ) : (
      <div className="mt-4 space-y-3">
        {items.map((it, i) => {
          const pct = (it.qty / max) * 100;
          return (
            <div key={it.menuId}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-ink-100 text-ink-600 text-[10px] font-bold inline-flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium text-ink-800 truncate">{it.name}</span>
                </div>
                <span className="text-sm font-semibold num text-ink-900">{it.qty}</span>
              </div>
              <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: palette[i % palette.length] }} />
              </div>
            </div>
          );
        })}
      </div>
      )}
    </Card>
  );
}

function TopItemsModal({ open, onClose, items, loading, page, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(items.length / TOP_ITEMS_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * TOP_ITEMS_PAGE_SIZE;
  const paged = items.slice(start, start + TOP_ITEMS_PAGE_SIZE);

  return (
    <Modal open={open} onClose={onClose} title="Eng ko'p sotilganlar" width={720}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-500">Bugun yopilgan buyurtmalar bo'yicha</p>
          <span className="text-xs num text-ink-500">{items.length} ta mahsulot</span>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center text-ink-500">
            <span className="w-4 h-4 rounded-full border-2 border-ink-200 border-t-navy-700 animate-spin mr-2" />
            Yuklanmoqda...
          </div>
        ) : paged.length === 0 ? (
          <EmptyState icon="TrendingUp" text="Hali sotuvlar yo'q" />
        ) : (
          <div className="overflow-x-auto border border-ink-100 rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/50">
                  <th className="font-semibold px-4 py-2.5 w-14">№</th>
                  <th className="font-semibold px-3 py-2.5">Mahsulot</th>
                  <th className="font-semibold px-3 py-2.5 text-right">Soni</th>
                  <th className="font-semibold px-4 py-2.5 text-right">Tushum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {paged.map((it, i) => (
                  <tr key={`${it.menuId}-${start + i}`} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3 num text-ink-500">{start + i + 1}</td>
                    <td className="px-3 py-3 font-medium text-ink-800 min-w-[180px]">{it.name}</td>
                    <td className="px-3 py-3 text-right num text-ink-700">{it.qty}</td>
                    <td className="px-4 py-3 text-right num font-semibold text-ink-900">{formatUZSShort(it.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-ink-500 num">
            {items.length ? `${start + 1}-${Math.min(start + TOP_ITEMS_PAGE_SIZE, items.length)} / ${items.length}` : '0 / 0'}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon="ChevronLeft" disabled={safePage <= 1 || loading} onClick={() => onPageChange(safePage - 1)}>
              Oldingi
            </Button>
            <span className="min-w-12 text-center text-xs num text-ink-600">{safePage}/{totalPages}</span>
            <Button variant="outline" size="sm" iconRight="ChevronRight" disabled={safePage >= totalPages || loading} onClick={() => onPageChange(safePage + 1)}>
              Keyingi
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function LiveOrdersTable({ orders, onOpen, onNavigate }) {
  const recent = orders.slice(0, 8);
  return (
    <Card padding={false}>
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b border-ink-100">
        <div className="flex items-center gap-2.5">
          <h3 className="font-semibold text-ink-900 text-sm sm:text-base">Jonli buyurtmalar</h3>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10.5px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-success live-dot" />
            JONLI
          </span>
        </div>
        <button className="text-xs text-accent font-medium hover:underline" onClick={() => onNavigate('orders')}>Barchasi →</button>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/50">
              <th className="font-semibold px-5 py-2.5">Buyurtma №</th>
              <th className="font-semibold px-3 py-2.5">Joy / Stol</th>
              <th className="font-semibold px-3 py-2.5">Ofitsiant</th>
              <th className="font-semibold px-3 py-2.5 text-center">Taomlar</th>
              <th className="font-semibold px-3 py-2.5">Holat</th>
              <th className="font-semibold px-3 py-2.5 text-right">Jami</th>
              <th className="font-semibold px-5 py-2.5 text-right">Vaqt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {recent.length === 0 ? (
              <EmptyRow colSpan={7} icon="Receipt" text="Hozircha buyurtma yoʻq" />
            ) : recent.map(o => (
              <tr key={o.id} className="hover:bg-ink-50/60 cursor-pointer transition-colors" onClick={() => onOpen(o.id)}>
                <td className="px-5 py-3 font-mono font-semibold text-ink-900">{o.number}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: o.zoneColor }} />
                    <span className="text-ink-800 font-medium">{o.zoneShort}</span>
                  </div>
                  <div className="text-[11px] text-ink-500 num">{o.tableNumber}-stol</div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={o.waiterAvatar} color={o.waiterColor} size={26} />
                    <span className="text-ink-700">{o.waiter.split(' ')[0]}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center num text-ink-700">{o.itemCount}</td>
                <td className="px-3 py-3"><Badge status={o.status} size="sm" /></td>
                <td className="px-3 py-3 text-right num font-semibold text-ink-900">{formatUZSShort(o.total)}</td>
                <td className="px-5 py-3 text-right text-ink-500 text-xs">{formatTime(o.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-ink-100">
        {recent.length === 0 ? (
          <EmptyState icon="Receipt" text="Hozircha buyurtma yoʻq" />
        ) : recent.map(o => (
          <button key={o.id} onClick={() => onOpen(o.id)}
            className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-ink-50">
            <Avatar initials={o.waiterAvatar} color={o.waiterColor} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-ink-900 text-sm">{o.number}</span>
                <span className="text-[11px] text-ink-400">· {o.zoneShort} {o.tableNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Badge status={o.status} size="sm" />
                <span className="text-[11px] text-ink-500 truncate">{o.itemCount} ta taom</span>
              </div>
            </div>
            <div className="text-right">
              <div className="num font-bold text-ink-900 text-sm whitespace-nowrap">{formatUZSShort(o.total)}</div>
              <div className="text-[10.5px] text-ink-400 mt-0.5">{formatTime(o.time)}</div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function ActivityFeed({ orders }) {
  const events = orders.slice(0, 6).map((o, i) => {
    const types = [
      { icon: 'Receipt',      color: '#2E75B6', text: 'Yangi buyurtma qabul qilindi' },
      { icon: 'CheckCircle2', color: '#27AE60', text: 'Buyurtma tayyor deb belgilandi' },
      { icon: 'ChefHat',      color: '#F39C12', text: 'Oshxona buyurtmani boshladi' },
      { icon: 'CreditCard',   color: '#1F4E79', text: 'Toʻlov qabul qilindi' },
    ];
    const t = types[i % types.length];
    return { ...t, order: o };
  });

  return (
    <Card>
      <h3 className="font-semibold text-ink-900 mb-4">Soʻnggi harakatlar</h3>
      {events.length === 0 ? (
        <EmptyState icon="Activity" text="Hali harakatlar yoʻq" />
      ) : (
      <ol className="relative space-y-4">
        <span className="absolute left-[15px] top-2 bottom-2 w-px bg-ink-100" />
        {events.map((e, i) => (
          <li key={i} className="relative flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ring-white"
                 style={{ background: `${e.color}15`, color: e.color }}>
              <Icon name={e.icon} size={14} />
            </div>
            <div className="flex-1 pt-0.5 min-w-0">
              <div className="text-sm text-ink-800">
                <span className="font-medium">{e.text}</span>
                <span className="text-ink-400"> · </span>
                <span className="font-mono text-ink-600">{e.order.number}</span>
              </div>
              <div className="text-[11px] text-ink-500 mt-0.5">{e.order.waiter.split(' ')[0]} · {timeAgo(e.order.time)}</div>
            </div>
          </li>
        ))}
      </ol>
      )}
    </Card>
  );
}

export default function DashboardScreen({ orders, staff = [], userName = '', onOpenOrder, onNavigate, liveKey = 0 }) {
  const now = new Date();
  const today = orders.filter(o => {
    const t = o.time instanceof Date ? o.time : (o.time ? new Date(o.time) : null);
    return t ? isSameDay(t, now) : false;
  });
  const openCount = today.filter(o => o.status === 'preparing').length;
  const revenue = orders.filter(o => {
    const closedAt = o.closedAt instanceof Date ? o.closedAt : (o.closedAt ? new Date(o.closedAt) : null);
    return o.status === 'closed' && closedAt && isSameDay(closedAt, now);
  }).reduce((s, o) => s + o.total, 0);
  const waiterIds = new Set(today.map(o => o.waiterId));
  const waiterCount = staff.filter(s => s.roleRaw === 'waiter').length;

  // Bugun eng ko'p sotilgan taomlar — backenddan (buyurtma o'zgarsa liveKey orqali yangilanadi)
  const [topItemsList, setTopItemsList] = useState([]);
  const [allTopItems, setAllTopItems] = useState([]);
  const [topItemsOpen, setTopItemsOpen] = useState(false);
  const [topItemsLoading, setTopItemsLoading] = useState(false);
  const [topItemsPage, setTopItemsPage] = useState(1);
  useEffect(() => {
    let active = true;
    topItems({ date: 'today', limit: 5 })
      .then(t => { if (active) setTopItemsList(t); })
      .catch(() => { if (active) setTopItemsList([]); });
    return () => { active = false; };
  }, [liveKey]);
  const firstName = (userName || '').split(' ')[0] || 'foydalanuvchi';

  function openTopItemsModal() {
    setTopItemsOpen(true);
    setTopItemsPage(1);
    setTopItemsLoading(true);
    topItems({ date: 'today', limit: 50 })
      .then(rows => setAllTopItems(rows))
      .catch(() => setAllTopItems([]))
      .finally(() => setTopItemsLoading(false));
  }

  function exportToday() {
    exportXLSX(`buyurtmalar-${dateStamp()}.xlsx`, ordersToRows(today), 'Bugungi buyurtmalar');
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title={`Xayrli kun, ${firstName}`}
        subtitle="Bugun restoranlaringizdagi vaziyat."
        actions={
          <>
            <Button variant="outline" icon="Download" size="md" onClick={exportToday} disabled={today.length === 0}>Eksport</Button>
            <Button variant="primary" icon="Plus" size="md">Yangi buyurtma</Button>
          </>
        }
      />

      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-ink-900">Xayrli kun, {firstName} 👋</h1>
        <p className="text-xs text-ink-500 mt-0.5">Bugun restoranlaringizdagi vaziyat.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon="Receipt" iconBg="#d7e7f4" iconFg="#1F4E79"
          label="Bugungi buyurtmalar" value={today.length} sub="kechaga nisbatan" />
        <StatCard icon="Clock" iconBg="#fdf1de" iconFg="#8a5a07"
          label="Tayyorlanmoqda" value={openCount}
          sub={`${today.filter(o => o.status === 'delivered').length} yetkazildi · ${today.filter(o => o.status === 'closed').length} yopildi`} />
        <StatCard icon="Wallet" iconBg="#e6f6ec" iconFg="#1d7a44"
          label="Bugungi tushum" value={formatUZSShort(revenue)} sub="soʻm · sof tushum" />
        <StatCard icon="Users" iconBg="#1F4E790F" iconFg="#1F4E79"
          label="Faol ofitsiantlar" value={waiterIds.size}
          sub={`${waiterCount} ta ofitsiant`} />
      </div>

      <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
        <Button variant="primary" icon="Plus" fullWidth>Yangi buyurtma</Button>
        <Button variant="outline" icon="Download" fullWidth onClick={exportToday} disabled={today.length === 0}>Eksport</Button>
      </div>

      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 mt-4">
        {/* Right column — comes first on mobile for quick overview */}
        <div className="space-y-4 xl:order-2">
          <TopItemsWidget items={topItemsList} onOpenAll={openTopItemsModal} />
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-ink-900">Buyurtmalar holati</h3>
                <p className="text-xs text-ink-500 mt-0.5">Jonli taqsimot</p>
              </div>
            </div>
            {/* Mobile: colored tiles grid */}
            <div className="grid grid-cols-2 gap-2 sm:hidden">
              {STATUSES.map(s => {
                const count = today.filter(o => o.status === s).length;
                const pct = today.length ? (count / today.length) * 100 : 0;
                const meta = STATUS_META[s];
                return (
                  <div key={s} className="rounded-xl p-3" style={{ background: meta.bg }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: meta.dot }} />
                      <span className="text-[11px] font-medium leading-tight" style={{ color: meta.fg }}>{meta.label}</span>
                    </div>
                    <div className="text-2xl font-bold num leading-none" style={{ color: meta.fg }}>{count}</div>
                    <div className="text-[11px] mt-1 font-medium opacity-70" style={{ color: meta.fg }}>{pct.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
            {/* Desktop: progress bars */}
            <div className="hidden sm:block space-y-3">
              {STATUSES.map(s => {
                const count = today.filter(o => o.status === s).length;
                const pct = today.length ? (count / today.length) * 100 : 0;
                const meta = STATUS_META[s];
                return (
                  <div key={s}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ background: meta.dot }} />
                        <span className="text-sm text-ink-700">{meta.label}</span>
                      </div>
                      <div className="text-sm num text-ink-900 font-semibold">{count} <span className="text-ink-400 font-normal">({pct.toFixed(0)}%)</span></div>
                    </div>
                    <div className="h-1.5 rounded-full bg-ink-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.dot }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        {/* Left column — main content */}
        <div className="xl:col-span-2 space-y-4 xl:order-1">
          <LiveOrdersTable orders={today} onOpen={onOpenOrder} onNavigate={onNavigate} />
          <ActivityFeed orders={today} />
        </div>
      </div>
      <TopItemsModal
        open={topItemsOpen}
        onClose={() => setTopItemsOpen(false)}
        items={allTopItems}
        loading={topItemsLoading}
        page={topItemsPage}
        onPageChange={setTopItemsPage}
      />
    </div>
  );
}
