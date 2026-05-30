'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar, MobileNavDrawer, BottomTabBar } from './sidebar';
import { Topbar } from './topbar';
import DashboardScreen from './screens/dashboard';
import OrdersScreen from './screens/orders';
import MenuScreen from './screens/menu';
import LocationsScreen from './screens/locations';
import StaffScreen from './screens/staff';
import ReportsScreen from './screens/reports';
import SettingsScreen from './screens/settings';
import { getSession, clearSession } from '@/lib/api';
import * as svc from '@/lib/services';

export default function AppShell() {
  const router = useRouter();
  const [screen, setScreen]       = useState('dashboard');
  const [orders, setOrders]       = useState([]);
  const [menu, setMenu]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [staff, setStaff]         = useState([]);
  const [zones, setZones]         = useState([]);
  const [tables, setTables]       = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [navOpen, setNavOpen]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [session, setSessionState] = useState(null);

  // Lookup maps for adapting orders
  const lookups = useMemo(() => {
    const tablesById = {}, zonesById = {}, staffById = {};
    tables.forEach(t => { tablesById[t.id] = t; });
    zones.forEach(z => { zonesById[z.id] = z; });
    staff.forEach(s => { staffById[s.id] = s; });
    return { tablesById, zonesById, staffById };
  }, [tables, zones, staff]);

  const reloadOrders = useCallback(async (lk) => {
    setOrders(await svc.listOrders('', lk || lookups));
  }, [lookups]);

  useEffect(() => {
    const s = getSession();
    if (!s?.access) { router.push('/login'); return; }
    setSessionState(s);
    (async () => {
      try {
        const [cats, items, st, zt] = await Promise.all([
          svc.listCategories(), svc.listMenuItems(), svc.listStaff(), svc.listZonesAndTables(),
        ]);
        setCategories(cats); setMenu(items); setStaff(st);
        setZones(zt.zones); setTables(zt.tables);

        const tablesById = {}, zonesById = {}, staffById = {};
        zt.tables.forEach(t => { tablesById[t.id] = t; });
        zt.zones.forEach(z => { zonesById[z.id] = z; });
        st.forEach(u => { staffById[u.id] = u; });
        setOrders(await svc.listOrders('', { tablesById, zonesById, staffById }));
      } catch (e) {
        console.error('Maʼlumotlarni yuklashda xatolik:', e);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = useMemo(() => {
    const u = session?.user || {};
    const name = u.full_name || u.username || 'Foydalanuvchi';
    const parts = name.trim().split(/\s+/);
    const avatar = (parts.length > 1 ? parts[0][0] + parts[1][0] : name.slice(0, 2)).toUpperCase();
    return { name, role: u.role === 'manager' ? 'Menejer' : (u.role === 'admin' ? 'Admin' : u.role), avatar, color: u.color || '#1F4E79' };
  }, [session]);

  const openCount = orders.filter(o => o.status === 'preparing').length;

  function navigate(s) { setNavOpen(false); setScreen(s); }
  function openOrderFromDashboard(id) { setOpenOrderId(id); setScreen('orders'); }

  function handleLogout() {
    clearSession();
    router.push('/login');
  }

  // ---- Menu handlers ----
  async function saveMenuItem(item, editId) {
    if (editId) await svc.updateMenuItem(editId, item);
    else await svc.createMenuItem(item);
    setMenu(await svc.listMenuItems());
  }
  async function deleteMenuItem(id) {
    await svc.deleteMenuItem(id);
    setMenu(m => m.filter(x => x.id !== id));
  }
  async function addCategory(data) {
    await svc.createCategory(data);
    setCategories(await svc.listCategories());
  }

  // ---- Staff handlers ----
  async function saveStaff(data, editId) {
    if (editId) await svc.updateStaff(editId, data);
    else await svc.createStaff(data);
    setStaff(await svc.listStaff());
  }
  async function removeStaff(id) {
    await svc.deleteStaff(id);
    setStaff(s => s.filter(x => x.id !== id));
  }

  // ---- Locations handlers ----
  async function addZone(data) {
    await svc.createZone(data);
    const zt = await svc.listZonesAndTables();
    setZones(zt.zones); setTables(zt.tables);
  }
  async function addTable({ zoneId, seats, count = 1 }) {
    const inZone = tables.filter(t => t.zoneId === zoneId);
    let next = inZone.length ? Math.max(...inZone.map(t => t.number || 0)) + 1 : 1;
    for (let i = 0; i < count; i++) await svc.createTable({ zoneId, seats, number: next++ });
    const zt = await svc.listZonesAndTables();
    setZones(zt.zones); setTables(zt.tables);
  }
  async function setTableStatus(id, status) {
    await svc.setTableStatus(id, status);
    const zt = await svc.listZonesAndTables();
    setTables(zt.tables);
  }

  // ---- Order handlers ----
  async function updateOrderStatus(id, status) {
    const cur = orders.find(o => o.id === id);
    if (cur && cur.status === status) return;
    try {
      // backend oqimi: preparing → delivered → closed. To'g'ridan-to'g'ri yopib bo'lmaydi.
      if (status === 'closed' && cur?.status === 'preparing') {
        await svc.setOrderStatus(id, 'delivered', lookups);
      }
      await svc.setOrderStatus(id, status, lookups);
      await reloadOrders();
    } catch (e) {
      alert(e.message || 'Holatni oʻzgartirishda xatolik');
    }
  }
  async function changeItemStatus(orderId, itemId, status) {
    try {
      await svc.setOrderItemStatus(orderId, itemId, status, lookups);
      await reloadOrders();
    } catch (e) {
      alert(e.message || 'Taom holatini oʻzgartirishda xatolik');
    }
  }
  async function editOrder(id, newItems) {
    const items = newItems.map(it => ({ menu_item_id: it.menuId, quantity: it.qty }));
    try {
      await svc.replaceOrderItems(id, items, lookups);
      await reloadOrders();
    } catch (e) {
      alert(e.message || 'Buyurtmani tahrirlashda xatolik');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-ink-500">
          <span className="w-4 h-4 rounded-full border-2 border-ink-200 border-t-navy-700 animate-spin" />
          Yuklanmoqda…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar active={screen} onNavigate={navigate} user={user} openCount={openCount} onLogout={handleLogout} />
      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)}
                       active={screen} onNavigate={navigate} user={user} openCount={openCount} onLogout={handleLogout} />

      <main className="md:pl-[240px]">
        <Topbar screen={screen} onMenuClick={() => setNavOpen(true)} />
        <div data-screen={screen} key={screen} className="anim-fade pb-[88px] md:pb-0"
             style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
          {screen === 'dashboard' && (
            <DashboardScreen
              orders={orders}
              staff={staff}
              userName={user.name}
              onOpenOrder={openOrderFromDashboard}
              onNavigate={navigate}
            />
          )}
          {screen === 'orders' && (
            <OrdersScreen
              orders={orders}
              staff={staff}
              menu={menu}
              categories={categories}
              openOrderId={openOrderId}
              setOpenOrderId={setOpenOrderId}
              onUpdateStatus={updateOrderStatus}
              onChangeItemStatus={changeItemStatus}
              onEditOrder={editOrder}
            />
          )}
          {screen === 'menu' && (
            <MenuScreen
              menu={menu}
              categories={categories}
              onSaveItem={saveMenuItem}
              onDeleteItem={deleteMenuItem}
              onAddCategory={addCategory}
            />
          )}
          {screen === 'locations' && (
            <LocationsScreen
              orders={orders}
              zones={zones}
              tables={tables}
              onAddZone={addZone}
              onAddTable={addTable}
              onSetTableStatus={setTableStatus}
              onNavigate={navigate}
            />
          )}
          {screen === 'staff' && (
            <StaffScreen staff={staff} zonesCount={zones.length} onSaveStaff={saveStaff} onRemoveStaff={removeStaff} />
          )}
          {screen === 'reports' && (
            <ReportsScreen orders={orders} />
          )}
          {screen === 'settings' && (
            <SettingsScreen />
          )}
        </div>
      </main>

      <BottomTabBar active={screen} onNavigate={navigate} onOpenMore={() => setNavOpen(true)} openCount={openCount} />
    </div>
  );
}
