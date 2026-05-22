'use client';
import { Icon } from './Icon';
import { Avatar, IconButton } from './ui';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Bosh sahifa', icon: 'LayoutDashboard' },
  { id: 'orders',    label: 'Buyurtmalar', icon: 'Receipt' },
  { id: 'menu',      label: 'Menyu',       icon: 'BookOpen' },
  { id: 'locations', label: 'Joylar',      icon: 'Armchair' },
  { id: 'staff',     label: 'Xodimlar',    icon: 'Users' },
  { id: 'reports',   label: 'Hisobotlar',  icon: 'BarChart3' },
  { id: 'settings',  label: 'Sozlamalar',  icon: 'Settings' },
];

const BOTTOM_TABS = ['dashboard', 'orders', 'menu', 'reports'];

export function Logo({ size = 'md' }) {
  const w = size === 'lg' ? 44 : 36;
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative rounded-xl bg-navy-700 flex items-center justify-center shadow-sm"
           style={{ width: w, height: w }}>
        <Icon name="UtensilsCrossed" size={w * 0.5} className="text-white" />
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-warn border-2 border-white" />
      </div>
      <div>
        <div className={`font-bold ${size === 'lg' ? 'text-xl' : 'text-[17px]'} text-ink-900 tracking-tight leading-none`}>
          Order<span className="text-accent">i</span>X
        </div>
        <div className="text-[10.5px] text-ink-400 font-medium mt-1 tracking-wide uppercase">Restoran tizimi</div>
      </div>
    </div>
  );
}

export function Sidebar({ active, onNavigate, user, openCount }) {
  const router = useRouter();

  function handleLogout() {
    try { localStorage.removeItem('orderix_session'); } catch (e) {}
    router.push('/login');
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-ink-100 flex-col z-40">
      <div className="px-5 pt-5 pb-6"><Logo /></div>

      <div className="px-5 mb-2">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-400">Ish makoni</div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'bg-navy-700 text-white shadow-sm' : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900'
                  }`}
                >
                  <Icon name={item.icon} size={18} strokeWidth={isActive ? 2.25 : 2} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.id === 'orders' && openCount > 0 && (
                    <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'
                    }`}>{openCount}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 mx-1 p-4 rounded-xl bg-gradient-to-br from-navy-50 to-accent-50 border border-navy-100">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-md bg-navy-700 flex items-center justify-center">
              <Icon name="Sparkles" size={12} className="text-white" />
            </div>
            <div className="text-xs font-semibold text-navy-800">Maslahat</div>
          </div>
          <p className="text-[11.5px] leading-relaxed text-navy-700">
            <kbd className="px-1 py-0.5 rounded bg-white border border-navy-100 font-mono text-[10px]">⌘K</kbd> bilan istalgan buyurtma yoki taomga oʻting.
          </p>
        </div>
      </nav>

      <div className="px-3 py-3 border-t border-ink-100 mt-2">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-ink-100 transition-colors cursor-pointer">
          <Avatar initials={user.avatar} color={user.color} size={36} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-ink-900 truncate">{user.name}</div>
            <div className="text-[11px] text-ink-500 truncate">{user.role} · OrderiX</div>
          </div>
          <IconButton name="LogOut" label="Chiqish" size={32} onClick={handleLogout} />
        </div>
      </div>
    </aside>
  );
}

export function MobileNavDrawer({ open, onClose, active, onNavigate, user, openCount }) {
  const router = useRouter();

  function handleLogout() {
    try { localStorage.removeItem('orderix_session'); } catch (e) {}
    router.push('/login');
  }

  if (!open) return null;
  return (
    <div className="md:hidden fixed inset-0 z-50 anim-fade">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <aside className="absolute top-0 left-0 h-full w-[82%] max-w-[320px] bg-white shadow-pop anim-slide-left flex flex-col"
             style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <Logo size="lg" />
          <IconButton name="X" onClick={onClose} label="Yopish" />
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">Ish makoni</div>
          <ul className="space-y-0.5">
            {NAV_ITEMS.map(item => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { onNavigate(item.id); onClose(); }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? 'bg-navy-700 text-white' : 'text-ink-700 hover:bg-ink-100'
                    }`}
                  >
                    <Icon name={item.icon} size={20} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.id === 'orders' && openCount > 0 && (
                      <span className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'
                      }`}>{openCount}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="px-3 py-3 border-t border-ink-100"
             style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
            <Avatar initials={user.avatar} color={user.color} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink-900 truncate">{user.name}</div>
              <div className="text-[11px] text-ink-500 truncate">{user.role} · OrderiX</div>
            </div>
            <IconButton name="LogOut" label="Chiqish" size={36} variant="outline" onClick={handleLogout} />
          </div>
        </div>
      </aside>
    </div>
  );
}

export function BottomTabBar({ active, onNavigate, onOpenMore, openCount }) {
  const tabs = BOTTOM_TABS.map(id => NAV_ITEMS.find(x => x.id === id));
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-ink-100"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="grid grid-cols-5">
        {tabs.map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                isActive ? 'text-navy-700' : 'text-ink-500'
              }`}>
              <div className="relative">
                <Icon name={item.icon} size={22} strokeWidth={isActive ? 2.25 : 1.8} />
                {item.id === 'orders' && openCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-accent text-white text-[9px] font-bold inline-flex items-center justify-center">
                    {openCount}
                  </span>
                )}
              </div>
              <span className={`text-[10.5px] font-medium ${isActive ? '' : 'text-ink-500'}`}>{item.label}</span>
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-navy-700" />}
            </button>
          );
        })}
        <button onClick={onOpenMore}
          className={`flex flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
            !BOTTOM_TABS.includes(active) ? 'text-navy-700' : 'text-ink-500'
          }`}>
          <Icon name="Menu" size={22} strokeWidth={!BOTTOM_TABS.includes(active) ? 2.25 : 1.8} />
          <span className="text-[10.5px] font-medium">Boshqa</span>
          {!BOTTOM_TABS.includes(active) && <span className="absolute top-0 right-[10%] w-8 h-0.5 rounded-full bg-navy-700" />}
        </button>
      </div>
    </nav>
  );
}
