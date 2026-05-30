'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from './Icon';
import { Logo, Btn } from './login/login-ui';
import PasswordForm from './login/login-pwd';
import TelegramForm from './login/login-otp';
import { hydrateSession } from '@/lib/services';

function BrandPanel() {
  return (
    <div className="relative brand-bg overflow-hidden flex flex-col p-8 lg:p-12 text-white"
         style={{ minHeight: 'auto' }}>
      <div className="absolute inset-0 grid-overlay opacity-50" />
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -bottom-24 -left-16 w-80 h-80 rounded-full bg-navy-500/30 blur-3xl" />

      <div className="relative z-10 flex flex-col h-full">
        <Logo mode="dark" size="lg" />

        <div className="mt-auto pt-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-[11px] font-semibold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Tizim faol · 3 ta filial onlayn
          </div>
          <h1 className="mt-4 text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
            Restoraningizni<br />
            <span className="text-accent">bir joydan</span> boshqaring.
          </h1>
          <p className="mt-3 text-sm text-white/70 max-w-md leading-relaxed">
            Buyurtmalar, menyu, xodimlar va kunlik tushum — barchasi bitta panelda.
            Telegram orqali xavfsiz kirish.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { icon: 'Zap', label: 'Jonli buyurtmalar' },
              { icon: 'ShieldCheck', label: 'Xavfsiz kirish' },
              { icon: 'BarChart3', label: 'Hisobotlar' },
            ].map(f => (
              <div key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 backdrop-blur border border-white/10 text-xs font-medium">
                <Icon name={f.icon} size={12} className="text-accent" />
                {f.label}
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <div className="rounded-xl bg-white/8 backdrop-blur border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Bugun</div>
              <div className="mt-1 text-lg font-bold num">38</div>
              <div className="text-[10px] text-success">↑ 12%</div>
            </div>
            <div className="rounded-xl bg-white/8 backdrop-blur border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Tushum</div>
              <div className="mt-1 text-lg font-bold num">3.4M</div>
              <div className="text-[10px] text-success">↑ 8%</div>
            </div>
            <div className="rounded-xl bg-white/8 backdrop-blur border border-white/10 p-3">
              <div className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Faol</div>
              <div className="mt-1 text-lg font-bold num">6</div>
              <div className="text-[10px] text-white/50">ofitsiant</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-12 flex items-center justify-between text-[11px] text-white/50">
          <span>© 2026 OrderiX. Barcha huquqlar himoyalangan.</span>
          <a href="#" className="hover:text-white/80">Yordam</a>
        </div>
      </div>
    </div>
  );
}

function TabSwitcher({ tab, setTab }) {
  return (
    <div className="relative p-1 rounded-xl bg-ink-100 grid grid-cols-2 gap-1">
      <div
        className="absolute top-1 bottom-1 rounded-lg bg-white shadow-card transition-transform duration-300 ease-out"
        style={{
          width: 'calc(50% - 4px)',
          left: 4,
          transform: tab === 'telegram' ? 'translateX(100%)' : 'translateX(0)',
        }}
      />
      <button onClick={() => setTab('password')}
        className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          tab === 'password' ? 'text-navy-700' : 'text-ink-500'
        }`}>
        <Icon name="Lock" size={14} /> Login / parol
      </button>
      <button onClick={() => setTab('telegram')}
        className={`relative z-10 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          tab === 'telegram' ? 'text-telegram' : 'text-ink-500'
        }`}>
        <Icon name="Send" size={14} /> Telegram kod
      </button>
    </div>
  );
}

function SuccessScreen({ method, onContinue }) {
  useEffect(() => {
    const t = setTimeout(onContinue, 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="text-center anim-fade">
      <div className="w-16 h-16 mx-auto rounded-full bg-success/15 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
          <Icon name="Check" size={24} className="text-white" strokeWidth={3} />
        </div>
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink-900">Xush kelibsiz!</h2>
      <p className="mt-1 text-sm text-ink-500">
        {method === 'telegram' ? 'Telegram orqali muvaffaqiyatli tasdiqlandi.' : 'Hisobingizga muvaffaqiyatli kirdingiz.'}
      </p>
      <div className="mt-5 inline-flex items-center gap-2 text-xs text-ink-500">
        <span className="w-3 h-3 rounded-full border-2 border-ink-200 border-t-navy-700 animate-spin" />
        Bosh sahifaga yoʻnaltirilmoqda…
      </div>
    </div>
  );
}

function DemoRoleSelector({ onSelect }) {
  return (
    <div className="mt-8 pt-6 border-t border-ink-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex-1 h-px bg-ink-200" />
        <span className="text-xs text-ink-400 font-medium px-2">Demo rejim</span>
        <span className="flex-1 h-px bg-ink-200" />
      </div>
      <p className="text-center text-[11px] text-ink-400 mb-3">API ulanmagan — to&apos;g&apos;ridan-to&apos;g&apos;ri kirish</p>
      <div className="flex gap-2">
        <button
          onClick={() => onSelect('manager')}
          className="flex-1 h-11 rounded-xl border-2 border-ink-200 text-sm font-semibold text-ink-700 hover:border-navy-400 hover:bg-navy-50 transition-all">
          <span className="flex items-center justify-center gap-1.5">
            <Icon name="LayoutDashboard" size={14} />
            Menejer
          </span>
        </button>
        <button
          onClick={() => onSelect('waiter')}
          className="flex-1 h-11 rounded-xl border-2 border-navy-200 bg-navy-50 text-sm font-semibold text-navy-700 hover:bg-navy-100 hover:border-navy-400 transition-all">
          <span className="flex items-center justify-center gap-1.5">
            <Icon name="UtensilsCrossed" size={14} />
            Ofitsiant
          </span>
        </button>
      </div>
    </div>
  );
}

export default function LoginApp() {
  const router = useRouter();
  const [tab, setTab]         = useState('telegram');
  const [success, setSuccess] = useState(null);
  const [role, setRole]       = useState('manager');

  async function handleSuccess(payload) {
    // payload = { access, refresh, user, method }
    const session = await hydrateSession({
      access: payload.access,
      refresh: payload.refresh,
      user: payload.user,
      loginAt: new Date().toISOString(),
    });
    const backendRole = session?.user?.role;
    if (backendRole) setRole(backendRole === 'waiter' ? 'waiter' : 'manager');
    setSuccess(payload);
  }

  function goToApp() {
    const backendRole = (() => {
      try { return JSON.parse(localStorage.getItem('orderix_session') || '{}')?.user?.role; }
      catch { return null; }
    })();
    const target = backendRole === 'waiter' ? '/waiter' : (backendRole ? '/' : (role === 'waiter' ? '/waiter' : '/'));
    router.push(target);
  }

  function handleDemoSelect(selectedRole) {
    try {
      localStorage.setItem('orderix_session', JSON.stringify({
        method: 'demo',
        role: selectedRole,
        loginAt: new Date().toISOString(),
      }));
    } catch (e) {}
    router.push(selectedRole === 'waiter' ? '/waiter' : '/');
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row bg-ink-50">
      <div className="lg:w-[46%] lg:min-w-[440px] lg:max-w-[640px]">
        <BrandPanel />
      </div>

      <div className="flex-1 flex items-start lg:items-center justify-center p-6 sm:p-10 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] anim-fade">
          {success ? (
            <SuccessScreen method={success.method} onContinue={goToApp} />
          ) : (
            <>
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-ink-900 tracking-tight">Hisobingizga kiring</h2>
                <p className="mt-1.5 text-sm text-ink-500">Boshqaruv panelidan foydalanish uchun tasdiqlanish lozim.</p>
              </div>

              <div className="mt-5">
                <label className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">Rol tanlang</label>
                <div className="mt-2 flex gap-2">
                  {[
                    { id: 'manager', label: 'Menejer',   icon: 'LayoutDashboard' },
                    { id: 'waiter',  label: 'Ofitsiant', icon: 'UtensilsCrossed' },
                  ].map(r => (
                    <button key={r.id} onClick={() => setRole(r.id)}
                      className={`flex-1 h-11 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        role === r.id
                          ? 'border-navy-700 bg-navy-50 text-navy-800'
                          : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300'
                      }`}>
                      <Icon name={r.icon} size={14} />
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <TabSwitcher tab={tab} setTab={setTab} />
              </div>

              <div className="mt-6">
                {tab === 'password' ? (
                  <PasswordForm onSuccess={handleSuccess} />
                ) : (
                  <TelegramForm onSuccess={handleSuccess} />
                )}
              </div>

              <DemoRoleSelector onSelect={handleDemoSelect} />

              <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-ink-400">
                <a href="#" className="hover:text-ink-600">Maxfiylik</a>
                <span className="w-1 h-1 rounded-full bg-ink-300" />
                <a href="#" className="hover:text-ink-600">Shartlar</a>
                <span className="w-1 h-1 rounded-full bg-ink-300" />
                <a href="#" className="hover:text-ink-600">Yordam</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
