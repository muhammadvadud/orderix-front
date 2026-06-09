'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { WAITER, TABLES, WAITER_COLORS, nextAction, setWaiterData, setServiceRate } from '../lib/waiter-data';
import { getSession, clearSession } from '@/lib/api';
import { connectRealtime } from '@/lib/realtime';
import { routeForRole, normalizeRole, clearRoleCookie } from '@/lib/auth';
import * as svc from '@/lib/services';
import {
  MyOrdersScreen, NewOrderScreen, TablesScreen, ProfileScreen,
  HistoryScreen, OrderDetailSheet, Toast,
} from './waiter/screens';
import {
  ClipboardList, PlusCircle, Grid, User, Clock, Bell, LogOut, Receipt,
} from './waiter/icons';

const { NAVY, ACCENT, BG } = WAITER_COLORS;

async function loadFreshSession(router) {
  try {
    const session = await svc.refreshSessionUser();
    if (!session?.access) {
      router.push('/login');
      return null;
    }
    return session;
  } catch (e) {
    if (e?.status === 401) {
      clearSession();
      clearRoleCookie();
      router.push('/login');
      return null;
    }
    console.error('Sessiyani yangilashda xatolik:', e);
    return getSession();
  }
}

const NAV_ITEMS = [
  { id: 'orders',  label: 'Buyurtmalarim',  Ico: ClipboardList, badge: true },
  { id: 'new',     label: 'Yangi buyurtma', Ico: PlusCircle },
  { id: 'tables',  label: 'Stollar',        Ico: Grid },
  { id: 'history', label: 'Tarix',          Ico: Receipt },
  { id: 'profile', label: 'Profil',         Ico: User },
];

const CAT_ICON_ALIASES = {
  Wheat: 'Wheat',
  Flame: 'Flame',
  Salad: 'Salad',
  Utensils: 'Utensils',
  UtensilsCrossed: 'Utensils',
  Soup: 'Utensils',
  ChefHat: 'Utensils',
  CupSoda: 'CupSoda',
  Coffee: 'CupSoda',
  Cake: 'IceCream',
  IceCream: 'IceCream',
};

function normalizeCategoryIcon(icon) {
  return CAT_ICON_ALIASES[icon] || 'Utensils';
}

// manager-adapter buyurtmasini waiter shakliga o'tkazadi
function toWaiterOrder(o) {
  return {
    id: o.id,
    tableId: o.tableId,
    tableLabel: `${o.tableNumber}-stol · ${o.zone}`,
    status: o.status,
    createdAt: o.time.getTime(),
    // List'da backend bergan qiymatlar; detail kelganda items'dan aniqlashadi.
    itemCount: o.itemCount,
    total: o.total,
    subtotal: o.subtotal,
    serviceFee: o.serviceFee,
    serviceRate: o.serviceRate,
    items: o.items.map(it => ({ menuId: it.menuId, name: it.name, qty: it.qty, status: it.status, itemId: it.id, price: it.price })),
  };
}

// Backend zona/stollaridan waiter ko'rinishidagi stollar va lookup'larni quradi
function buildZonesTables(zt) {
  const zonesById = {}; zt.zones.forEach(z => { zonesById[z.id] = z; });
  const tablesById = {}; zt.tables.forEach(t => { tablesById[t.id] = t; });
  const tables = zt.tables.map(t => ({
    id: t.id,
    label: `${t.number}-stol`,
    zone: zonesById[t.zoneId]?.name || '—',
    seats: t.seats,
    status: t.rawStatus === 'occupied'
      ? 'occupied'
      : ((t.initStatus === 'reserved' || t.initStatus === 'dirty') ? 'unavailable' : 'free'),
  }));
  return { tables, zonesById, tablesById };
}

export default function WaiterShell() {
  const router = useRouter();
  const [tab, setTab]           = useState('orders');
  const [orders, setOrders]     = useState([]);
  const [ready, setReady]       = useState(false);
  const [lookups, setLookups]   = useState({});
  const [openOrderId,     setOpenOrderId]     = useState(null);
  const [historyOrderId,  setHistoryOrderId]  = useState(null);
  const [orderDetail,     setOrderDetail]     = useState(null);
  // Detail API'dan kelgan to'liq buyurtma (taomlar bilan); kelguncha list'dagi qisqa nusxa.
  const openOrder    = (orderDetail && orderDetail.id === openOrderId)    ? orderDetail : (orders.find(o => o.id === openOrderId)    || null);
  const historyOrder = (orderDetail && orderDetail.id === historyOrderId) ? orderDetail : (orders.find(o => o.id === historyOrderId) || null);
  const [toast, setToast]       = useState(null);
  const [draft, setDraft]       = useState({ step: 1, tableId: null, items: [] });
  const [, forceRender]         = useState(0);

  const activeCount = orders.filter(o => o.status !== 'closed').length;
  const occupiedIds = new Set(orders.filter(o => o.status !== 'closed').map(o => o.tableId));

  const reloadOrders = useCallback(async (lk) => {
    const raw = await svc.listOrders('', lk || lookups);
    setOrders(raw.map(toWaiterOrder));
  }, [lookups]);

  // Buyurtma ochilganda detail API'dan to'liq ma'lumot olinadi.
  const loadDetail = useCallback(async (id) => {
    if (id == null) { setOrderDetail(null); return; }
    try {
      setOrderDetail(toWaiterOrder(await svc.getOrder(id, lookups)));
    } catch (e) {
      console.error('Buyurtma tafsilotini olishda xatolik:', e);
    }
  }, [lookups]);

  function openActive(id)  { setHistoryOrderId(null); setOpenOrderId(id);    loadDetail(id); }
  function openHistory(id) { setOpenOrderId(null);    setHistoryOrderId(id); loadDetail(id); }

  // Joylar (stollar/zonalar) o'zgarganda qayta yuklab, qayta render qilamiz.
  const reloadZonesTables = useCallback(async () => {
    const zt = await svc.listZonesAndTables();
    const { tables, zonesById, tablesById } = buildZonesTables(zt);
    setWaiterData({ tables });
    setLookups(lk => ({ ...lk, zonesById, tablesById }));
    forceRender(v => v + 1);
  }, []);

  // Realtime: backend resurs o'zgarishini bildirsa, tegishli ma'lumot qayta yuklanadi.
  // rtRef orqali eng so'nggi handler ishlatiladi — ulanish bir marta ochiladi.
  const rtRef = useRef({});
  rtRef.current.orders = () => {
    reloadOrders();
    // Stol bandligi buyurtmalardan hisoblanadi (boshqa ofitsiantniki ham) — stollar yangilansin
    reloadZonesTables();
    const openId = openOrderId ?? historyOrderId;
    if (openId != null) loadDetail(openId);
  };
  rtRef.current.locations = () => { reloadZonesTables(); };
  useEffect(() => {
    if (!ready || !getSession()?.access) return undefined;
    return connectRealtime((resource) => {
      const handler = rtRef.current[resource];
      if (handler) handler();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Yangi buyurtma sahifasiga kirilganda stol holatini bir marta yangilab olamiz,
  // shunda boshqa joyda yopilgan/band qilingan stol to'g'ri (bo'sh/band) ko'rinadi.
  useEffect(() => {
    if (ready && tab === 'new') reloadZonesTables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, ready]);

  useEffect(() => {
    (async () => {
      const s = await loadFreshSession(router);
      if (!s?.access) { setReady(true); return; }
      if (normalizeRole(s?.user?.role) !== 'waiter') {
        router.replace(routeForRole(s?.user?.role));
        setReady(true);
        return;
      }
      try {
        const [cats, items, zt] = await Promise.all([
          svc.listCategories(), svc.listMenuItems(), svc.listZonesAndTables(),
        ]);
        const { tables, zonesById, tablesById } = buildZonesTables(zt);

        setWaiterData({
          menu: items.map(m => ({ id: m.id, cat: m.category, name: m.name, price: m.price, desc: '' })),
          categories: cats.map(c => ({ id: c.id, name: c.name, icon: normalizeCategoryIcon(c.icon) })),
          tables,
        });

        const u = s.user || {};
        let restaurantName = '';
        try {
          const settings = await svc.getSettings();
          restaurantName = settings?.restaurant_name || '';
          if (settings?.service_fee != null) setServiceRate(settings.service_fee);
        } catch {}
        let stats = {};
        try { stats = await svc.waiterStats(); } catch {}
        const name = u.full_name || u.username || 'Ofitsiant';
        const initials = name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join('').toUpperCase();
        setWaiterData({ waiter: {
          name, role: 'Ofitsiant', initials,
          restaurant: restaurantName || 'OrderiX',
          phone: u.phone_number || '',
          shift: '—',
          ordersToday: stats.orders_today ?? 0,
          ordersWeek: stats.orders_week ?? 0,
          revenueToday: Number(stats.revenue_today ?? 0),
          rating: 5.0,
        }});

        const lk = { tablesById, zonesById, staffById: {} };
        setLookups(lk);
        await reloadOrders(lk);
        setReady(true);
      } catch (e) {
        console.error('Ofitsiant maʼlumotlarini yuklashda xatolik:', e);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function advance(id) {
    const o = orders.find(x => x.id === id);
    const a = o && nextAction(o.status);
    if (!a) return;
    try {
      const updated = await svc.setOrderStatus(id, a.next, lookups);
      await reloadOrders();
      if (id === openOrderId) setOrderDetail(toWaiterOrder(updated));
      setToast('Buyurtma yangilandi');
    } catch (e) { setToast(e.message || 'Xatolik'); }
  }

  async function editOrderItems(id, newItems) {
    const items = newItems.map(it => ({ menu_item_id: it.menuId, quantity: it.qty }));
    try {
      const updated = await svc.replaceOrderItems(id, items, lookups);
      await reloadOrders();
      if (id === openOrderId) setOrderDetail(toWaiterOrder(updated));
      setToast('Buyurtma tahrirlandi');
    } catch (e) { setToast(e.message || 'Tahrirlashda xatolik'); }
  }

  async function changeItemStatus(orderId, itemId, newStatus) {
    try {
      const updated = await svc.setOrderItemStatus(orderId, itemId, newStatus, lookups);
      await reloadOrders();
      if (orderId === openOrderId) setOrderDetail(toWaiterOrder(updated));
    } catch (e) { setToast(e.message || 'Xatolik'); }
  }

  async function placeOrder() {
    const items = draft.items.map(it => ({ menu_item_id: it.menuId, quantity: it.qty }));
    try {
      await svc.createOrder({ location_id: draft.tableId, items }, lookups);
      await reloadOrders();
      setDraft({ step: 1, tableId: null, items: [] });
      setTab('orders');
      setToast('Buyurtma berildi · oshxonaga yuborildi');
    } catch (e) {
      setToast(e.message || 'Buyurtma berishda xatolik');
    }
  }

  function handleLogout() {
    clearSession();
    clearRoleCookie();
    router.push('/login');
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center" style={{ background: BG }}>
        <div className="flex items-center gap-3 text-slate-500 text-sm">
          <span className="w-4 h-4 rounded-full border-2 border-slate-200 animate-spin" style={{ borderTopColor: NAVY }} />
          Yuklanmoqda…
        </div>
      </div>
    );
  }

  return (
    <div className="waiter-app min-h-screen md:flex" style={{ background: BG, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <WaiterSidebar tab={tab} setTab={setTab} activeCount={activeCount} onLogout={handleLogout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <WaiterTopBar />
        <main className="flex-1 min-w-0 relative pb-28 md:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            {tab === 'orders'  && <MyOrdersScreen orders={orders} onAdvance={advance} onOpen={o => openActive(o.id)} onGoNew={() => setTab('new')} />}
            {tab === 'new'     && <NewOrderScreen draft={draft} setDraft={setDraft} onSubmit={placeOrder} occupiedIds={occupiedIds} />}
            {tab === 'tables'  && <TablesScreen   orders={orders} onOpenOrder={(o) => { setTab('orders'); openActive(o.id); }} occupiedIds={occupiedIds} />}
            {tab === 'history' && <HistoryScreen  orders={orders} onOpen={o => openHistory(o.id)} />}
            {tab === 'profile' && <ProfileScreen  onLogout={handleLogout} />}
          </div>
        </main>
      </div>
      <WaiterBottomNav tab={tab} setTab={setTab} activeCount={activeCount} />

      <OrderDetailSheet order={openOrder}    onClose={() => { setOpenOrderId(null); setOrderDetail(null); }}    onAdvance={advance} onEdit={editOrderItems} onChangeItemStatus={changeItemStatus} />
      <OrderDetailSheet order={historyOrder} onClose={() => { setHistoryOrderId(null); setOrderDetail(null); }} readOnly onAdvance={() => {}} onEdit={() => {}} onChangeItemStatus={() => {}} />
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}

function WaiterTopBar() {
  return (
    <header className="hidden md:flex sticky top-0 z-20 h-16 px-6 lg:px-8 items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/70">
      <div className="flex items-center gap-2 text-[13px] text-slate-500">
        <span className="font-semibold text-slate-700">{WAITER.restaurant}</span>
        <span className="h-1 w-1 rounded-full bg-slate-300"/>
        <span className="inline-flex items-center gap-1"><Clock size={13}/> Smena {WAITER.shift}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="tap h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-slate-700">
          <Bell size={17}/>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl text-white grid place-items-center text-[13px] font-extrabold"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${ACCENT})` }}>
            {WAITER.initials}
          </div>
          <div className="leading-tight">
            <div className="text-[13px] font-bold text-slate-900">{WAITER.name}</div>
            <div className="text-[11px] text-slate-500">{WAITER.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function WaiterSidebar({ tab, setTab, activeCount, onLogout }) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-[240px] lg:w-[260px] shrink-0 sticky top-0 h-screen bg-white border-r border-slate-200/70">
      <div className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <div className="h-10 w-10 rounded-xl text-white grid place-items-center font-extrabold text-[14px] tracking-tight"
          style={{ background: `linear-gradient(135deg, ${NAVY}, ${ACCENT})` }}>
          Ox
        </div>
        <div>
          <div className="text-[16px] font-extrabold text-slate-900 leading-none">OrderiX</div>
          <div className="text-[11px] text-slate-500 mt-1">Ofitsiant paneli</div>
        </div>
      </div>

      <nav className="px-3 flex-1 flex flex-col gap-1 mt-2">
        {NAV_ITEMS.map(it => {
          const on = tab === it.id;
          const badge = it.badge ? activeCount : 0;
          return (
            <button key={it.id} onClick={() => setTab(it.id)}
              className="tap h-12 rounded-xl px-3 flex items-center gap-3 text-[14px] font-semibold text-left"
              style={{ background: on ? NAVY : 'transparent', color: on ? '#fff' : '#475569' }}>
              <it.Ico size={19} strokeWidth={on ? 2.2 : 2}/>
              <span className="flex-1">{it.label}</span>
              {badge > 0 && (
                <span className="min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-extrabold grid place-items-center"
                  style={{ background: on ? 'rgba(255,255,255,0.2)' : '#fee2e2', color: on ? '#fff' : '#dc2626' }}>
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-2xl p-3 flex items-center gap-2.5" style={{ background: `${NAVY}0d` }}>
          <div className="h-10 w-10 rounded-xl text-white grid place-items-center font-extrabold text-[13px]"
            style={{ background: `linear-gradient(135deg, ${NAVY}, ${ACCENT})` }}>
            {WAITER.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-bold text-slate-900 truncate">{WAITER.name}</div>
            <div className="text-[11px] text-slate-500 truncate">{WAITER.role}</div>
          </div>
          <button onClick={onLogout} className="tap h-8 w-8 rounded-lg grid place-items-center text-slate-500 hover:text-slate-700">
            <LogOut size={15}/>
          </button>
        </div>
      </div>
    </aside>
  );
}

function WaiterBottomNav({ tab, setTab, activeCount }) {
  const items = [
    { id: 'orders',  label: 'Buyurtmalar', Ico: ClipboardList, badge: activeCount },
    { id: 'new',     label: 'Yangi',       Ico: PlusCircle,    primary: true },
    { id: 'tables',  label: 'Stollar',     Ico: Grid },
    { id: 'history', label: 'Tarix',       Ico: Receipt },
    { id: 'profile', label: 'Profil',      Ico: User },
  ];
  const activeIndex = items.findIndex(it => it.id === tab);
  return (
    <div className="md:hidden fixed left-0 right-0 z-40 px-3"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <div className="relative mx-auto max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/70
                      shadow-[0_-4px_30px_-12px_rgba(15,23,42,0.18)] flex items-stretch px-2 py-1.5"
        style={{ height: 64 }}>
        {activeIndex >= 0 && !items[activeIndex].primary && (
          <span
            className="absolute bottom-2 h-1 w-6 rounded-full transition-[left] duration-300 ease-out"
            style={{
              background: NAVY,
              left: `calc(0.5rem + ((100% - 1rem) / 5) * ${activeIndex} + (((100% - 1rem) / 5) - 1.5rem) / 2)`,
            }}
          />
        )}
        {items.map(it => {
          const on = tab === it.id;
          if (it.primary) {
            return (
              <button key={it.id} onClick={() => setTab(it.id)} className="tap flex-1 grid place-items-center">
                <div className="h-12 w-12 rounded-2xl grid place-items-center text-white"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${ACCENT})`, boxShadow: `0 6px 16px -4px ${NAVY}88` }}>
                  <it.Ico size={22} strokeWidth={2.2}/>
                </div>
              </button>
            );
          }
          return (
            <button key={it.id} onClick={() => setTab(it.id)}
              className="tap flex-1 relative flex flex-col items-center justify-center gap-1 pt-1 pb-2"
              style={{ color: on ? NAVY : '#94a3b8' }}>
              <div className="relative h-6 w-6 grid place-items-center">
                <it.Ico size={22} strokeWidth={on ? 2.4 : 2}/>
                {it.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-extrabold text-white grid place-items-center"
                    style={{ background: '#dc2626' }}>
                    {it.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-none font-semibold">{it.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
