'use client';
import { useState } from 'react';
import { Sidebar, MobileNavDrawer, BottomTabBar } from './sidebar';
import { Topbar } from './topbar';
import DashboardScreen from './screens/dashboard';
import OrdersScreen from './screens/orders';
import MenuScreen from './screens/menu';
import LocationsScreen from './screens/locations';
import StaffScreen from './screens/staff';
import ReportsScreen from './screens/reports';
import SettingsScreen from './screens/settings';
import { ORDERS, MENU, CATEGORIES, STAFF, ZONES, TABLES } from '@/lib/data';

export default function AppShell() {
  const [screen, setScreen]       = useState('dashboard');
  const [orders, setOrders]       = useState(ORDERS);
  const [menu, setMenu]           = useState(MENU);
  const [categories, setCategories] = useState(CATEGORIES);
  const [staff, setStaff]         = useState(STAFF);
  const [zones, setZones]         = useState(ZONES);
  const [tables, setTables]       = useState(TABLES);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [navOpen, setNavOpen]     = useState(false);

  const user = { name: 'Aziza Karimova', role: 'Menejer', avatar: 'AK', color: '#1F4E79' };
  const openCount = orders.filter(o => o.status === 'preparing').length;

  function navigate(s) {
    setNavOpen(false);
    setScreen(s);
  }

  function openOrderFromDashboard(id) {
    setOpenOrderId(id);
    setScreen('orders');
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <Sidebar active={screen} onNavigate={navigate} user={user} openCount={openCount} />
      <MobileNavDrawer open={navOpen} onClose={() => setNavOpen(false)}
                       active={screen} onNavigate={navigate} user={user} openCount={openCount} />

      <main className="md:pl-[240px]">
        <Topbar screen={screen} onMenuClick={() => setNavOpen(true)} />
        <div data-screen={screen} key={screen} className="anim-fade pb-[88px] md:pb-0"
             style={{ paddingBottom: 'calc(88px + env(safe-area-inset-bottom))' }}>
          {screen === 'dashboard' && (
            <DashboardScreen
              orders={orders}
              onOpenOrder={openOrderFromDashboard}
              onNavigate={navigate}
            />
          )}
          {screen === 'orders' && (
            <OrdersScreen
              orders={orders}
              setOrders={setOrders}
              openOrderId={openOrderId}
              setOpenOrderId={setOpenOrderId}
            />
          )}
          {screen === 'menu' && (
            <MenuScreen
              menu={menu}
              setMenu={setMenu}
              categories={categories}
              setCategories={setCategories}
            />
          )}
          {screen === 'locations' && (
            <LocationsScreen
              orders={orders}
              staff={staff}
              zones={zones}
              setZones={setZones}
              tables={tables}
              setTables={setTables}
              onNavigate={navigate}
            />
          )}
          {screen === 'staff' && (
            <StaffScreen staff={staff} setStaff={setStaff} />
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
