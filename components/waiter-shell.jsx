'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WAITER, INITIAL_ORDERS, HISTORY_ORDERS, TABLES, WAITER_COLORS, nextAction } from '../lib/waiter-data';
import {
  MyOrdersScreen, NewOrderScreen, TablesScreen, ProfileScreen,
  HistoryScreen, OrderDetailSheet, Toast,
} from './waiter/screens';
import {
  ClipboardList, PlusCircle, Grid, User, Clock, Bell, LogOut, Receipt,
} from './waiter/icons';

const { NAVY, ACCENT, BG } = WAITER_COLORS;

const NAV_ITEMS = [
  { id: 'orders',  label: 'Buyurtmalarim',  Ico: ClipboardList, badge: true },
  { id: 'new',     label: 'Yangi buyurtma', Ico: PlusCircle },
  { id: 'tables',  label: 'Stollar',        Ico: Grid },
  { id: 'history', label: 'Tarix',          Ico: Receipt },
  { id: 'profile', label: 'Profil',         Ico: User },
];

export default function WaiterShell() {
  const router = useRouter();
  const [tab, setTab]           = useState('orders');
  const [orders, setOrders]     = useState(() => [...HISTORY_ORDERS, ...INITIAL_ORDERS]);
  const [openOrderId,     setOpenOrderId]     = useState(null);
  const [historyOrderId,  setHistoryOrderId]  = useState(null);
  const openOrder    = orders.find(o => o.id === openOrderId)    || null;
  const historyOrder = orders.find(o => o.id === historyOrderId) || null;
  const [toast, setToast]       = useState(null);
  const [draft, setDraft]       = useState({ step: 1, tableId: null, items: [] });

  const activeCount = orders.filter(o => o.status !== 'closed').length;
  const occupiedIds = new Set(orders.filter(o => o.status !== 'closed').map(o => o.tableId));

  function advance(id) {
    setOrders(os => os.map(o => {
      if (o.id !== id) return o;
      const a = nextAction(o.status);
      if (!a) return o;
      const items = a.next === 'delivered'
        ? o.items.map(it => it.status !== 'cancelled' ? { ...it, status: 'delivered' } : it)
        : o.items;
      return { ...o, status: a.next, items };
    }));
    setToast('Buyurtma yangilandi');
  }

  function editOrderItems(id, newItems) {
    setOrders(os => os.map(o => {
      if (o.id !== id) return o;
      const existingSt = {};
      o.items.forEach(it => { existingSt[it.menuId] = it.status || 'preparing'; });
      const updated = newItems.map(it => ({ ...it, status: existingSt[it.menuId] || 'preparing' }));
      return { ...o, items: updated };
    }));
    setToast('Buyurtma tahrirlandi');
  }

  function changeItemStatus(orderId, menuId, newStatus) {
    setOrders(os => os.map(o => {
      if (o.id !== orderId) return o;
      const newItems    = o.items.map(it => it.menuId === menuId ? { ...it, status: newStatus } : it);
      const allDone     = newItems.every(it => it.status !== 'preparing');
      const anyDelivered = newItems.some(it => it.status === 'delivered');
      if (allDone && anyDelivered && o.status === 'preparing') {
        setToast('Barcha taomlar yetkazildi');
        return { ...o, items: newItems, status: 'delivered' };
      }
      return { ...o, items: newItems };
    }));
  }

  function placeOrder() {
    const table = TABLES.find(t => t.id === draft.tableId);
    const newOrder = {
      id: 'o' + Date.now(),
      tableId: draft.tableId,
      tableLabel: `${table.label} · ${table.zone}`,
      status: 'preparing',
      createdAt: Date.now(),
      items: draft.items.map(it => ({ ...it, status: 'preparing' })),
    };
    setOrders(os => [newOrder, ...os]);
    setDraft({ step: 1, tableId: null, items: [] });
    setTab('orders');
    setToast('Buyurtma berildi · oshxonaga yuborildi');
  }

  function handleLogout() {
    try { localStorage.removeItem('orderix_session'); } catch (e) {}
    router.push('/login');
  }

  return (
    <div className="waiter-app min-h-screen md:flex" style={{ background: BG, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <WaiterSidebar tab={tab} setTab={setTab} activeCount={activeCount} onLogout={handleLogout} />
      <div className="flex-1 min-w-0 flex flex-col">
        <WaiterTopBar />
        <main className="flex-1 min-w-0 relative pb-28 md:pb-8">
          <div className="mx-auto w-full max-w-7xl">
            {tab === 'orders'  && <MyOrdersScreen orders={orders} onAdvance={advance} onOpen={o => setOpenOrderId(o.id)} onGoNew={() => setTab('new')} />}
            {tab === 'new'     && <NewOrderScreen draft={draft} setDraft={setDraft} onSubmit={placeOrder} occupiedIds={occupiedIds} />}
            {tab === 'tables'  && <TablesScreen   orders={orders} onOpenOrder={(o) => { setTab('orders'); setOpenOrderId(o.id); }} occupiedIds={occupiedIds} />}
            {tab === 'history' && <HistoryScreen  orders={orders} onOpen={o => setHistoryOrderId(o.id)} />}
            {tab === 'profile' && <ProfileScreen  onLogout={handleLogout} />}
          </div>
        </main>
      </div>
      <WaiterBottomNav tab={tab} setTab={setTab} activeCount={activeCount} />

      <OrderDetailSheet order={openOrder}    onClose={() => setOpenOrderId(null)}    onAdvance={advance} onEdit={editOrderItems} onChangeItemStatus={changeItemStatus} />
      <OrderDetailSheet order={historyOrder} onClose={() => setHistoryOrderId(null)} readOnly onAdvance={() => {}} onEdit={() => {}} onChangeItemStatus={() => {}} />
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
  return (
    <div className="md:hidden fixed left-0 right-0 z-40 px-3"
      style={{ bottom: 'calc(env(safe-area-inset-bottom) + 12px)' }}>
      <div className="mx-auto max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/70
                      shadow-[0_-4px_30px_-12px_rgba(15,23,42,0.18)] flex items-stretch px-2 py-1.5"
        style={{ height: 64 }}>
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
              className="tap flex-1 grid place-items-center relative"
              style={{ color: on ? NAVY : '#94a3b8' }}>
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative">
                  <it.Ico size={22} strokeWidth={on ? 2.4 : 2}/>
                  {it.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-1 rounded-full text-[10px] font-extrabold text-white grid place-items-center"
                      style={{ background: '#dc2626' }}>
                      {it.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold">{it.label}</span>
              </div>
              {on && (
                <span className="absolute top-1 h-1 w-6 rounded-full" style={{ background: NAVY }}/>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
