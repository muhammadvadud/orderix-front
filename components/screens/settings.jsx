'use client';
import { useState, useEffect } from 'react';
import { Icon } from '../Icon';
import { Card, Button, Input, Select, Field, PageHeader } from '../ui';
import { getSettings, updateSettings } from '@/lib/services';

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? 'Bildirishnomani o‘chirish' : 'Bildirishnomani yoqish'}
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative overflow-hidden transition-colors shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 ${checked ? 'bg-accent' : 'bg-ink-200'} cursor-pointer`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsScreen() {
  const [tab, setTab]                     = useState('general');
  const [restaurantName, setRestaurantName] = useState('');
  const [serviceFee, setServiceFee]       = useState(10);
  const [currency, setCurrency]           = useState('UZS');
  const [notif, setNotif]                 = useState({ orders: true, staff: false, daily: true });
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    getSettings().then(s => {
      if (s.restaurant_name != null) setRestaurantName(s.restaurant_name);
      if (s.service_fee != null) setServiceFee(Number(s.service_fee));
      setNotif({
        orders: s.notify_orders ?? true,
        staff: s.notify_staff ?? false,
        daily: s.notify_daily ?? true,
      });
    }).catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    try {
      await updateSettings({
        restaurant_name: restaurantName,
        service_fee: serviceFee,
        notify_orders: notif.orders,
        notify_staff: notif.staff,
        notify_daily: notif.daily,
      });
      alert('Sozlamalar saqlandi');
    } catch (e) {
      alert(e.message || 'Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  const tabs = [
    { id: 'general',       label: 'Umumiy',          icon: 'Settings' },
    { id: 'billing',       label: 'Toʻlov',           icon: 'CreditCard' },
    { id: 'notifications', label: 'Bildirishnoma',    icon: 'Bell' },
    { id: 'security',      label: 'Xavfsizlik',       icon: 'ShieldCheck' },
    { id: 'integrations',  label: 'Integratsiyalar',  icon: 'Plug' },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1200px] mx-auto">
      <PageHeader title="Sozlamalar" subtitle="Akkauntingiz va restoran sozlamalarini boshqaring" />

      <div className="lg:hidden mb-4">
        <p className="text-xs text-ink-500">Akkauntingiz va restoran sozlamalari</p>
      </div>

      <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 w-max pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition flex items-center gap-1.5 ${
                tab === t.id ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-ink-600 border-ink-200'
              }`}>
              <Icon name={t.icon} size={12} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <aside className="hidden lg:block col-span-3">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  tab === t.id ? 'bg-navy-50 text-navy-700' : 'text-ink-600 hover:bg-ink-100'
                }`}>
                <Icon name={t.icon} size={16} />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="col-span-12 lg:col-span-9 space-y-4">
          {tab === 'general' && (
            <>
              <Card>
                <h3 className="font-semibold text-ink-900 mb-1">Restoran maʼlumotlari</h3>
                <p className="text-xs text-ink-500 mb-5">Biznesingiz haqida ommaviy maʼlumot.</p>
                <div className="space-y-4">
                  <Field label="Biznes nomi">
                    <Input value={restaurantName} onChange={e => setRestaurantName(e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Valyuta">
                      <Select value={currency} onChange={e => setCurrency(e.target.value)}
                              options={[{value:'UZS',label:'UZS — Oʻzbek soʻmi'},{value:'USD',label:'USD'},{value:'RUB',label:'RUB'}]} />
                    </Field>
                    <Field label="Vaqt mintaqasi">
                      <Select value="Asia/Tashkent" onChange={() => {}}
                              options={[{value:'Asia/Tashkent',label:'Toshkent (UTC+5)'}]} />
                    </Field>
                  </div>
                  <Field label="Xizmat haqi (%)">
                    <Input type="number" value={serviceFee} onChange={e => setServiceFee(+e.target.value)} />
                  </Field>
                </div>
              </Card>
              <Card>
                <h3 className="font-semibold text-ink-900 mb-1">Cheq sozlamalari</h3>
                <p className="text-xs text-ink-500 mb-5">Mijoz toʻlov vaqtida koʻradigan koʻrinish.</p>
                <div className="rounded-lg border-2 border-dashed border-ink-200 p-6 text-center">
                  <Icon name="Receipt" size={28} className="text-ink-300 mx-auto" />
                  <div className="mt-2 text-sm text-ink-500">
                    Logotipni shu yerga tashlang yoki <span className="text-accent font-medium cursor-pointer">tanlang</span>
                  </div>
                  <div className="text-[11px] text-ink-400 mt-1">PNG yoki SVG · maks 2MB</div>
                </div>
              </Card>
            </>
          )}
          {tab === 'notifications' && (
            <Card>
              <h3 className="font-semibold text-ink-900 mb-1">Bildirishnomalar</h3>
              <p className="text-xs text-ink-500 mb-5">Nimadan xabardor boʻlishni tanlang.</p>
              <div className="divide-y divide-ink-100">
                {[
                  { key: 'orders', label: 'Yangi buyurtmalar', sub: 'Har bir yangi buyurtma kelganda' },
                  { key: 'staff',  label: 'Xodim smenalari',   sub: 'Ofitsiantlar smenani boshlaganda yoki tugatganda' },
                  { key: 'daily',  label: 'Kunlik xulosa',     sub: 'Har oqshom tushum va faoliyat xulosasi' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3.5 gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-ink-900">{n.label}</div>
                      <div className="text-xs text-ink-500 mt-0.5">{n.sub}</div>
                    </div>
                    <Toggle checked={notif[n.key]} onChange={v => setNotif(s => ({...s, [n.key]: v}))} />
                  </div>
                ))}
              </div>
            </Card>
          )}
          {tab !== 'general' && tab !== 'notifications' && (
            <Card>
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-ink-100 inline-flex items-center justify-center text-ink-400">
                  <Icon name={tabs.find(t => t.id === tab).icon} size={20} />
                </div>
                <h3 className="mt-3 font-semibold text-ink-800">{tabs.find(t => t.id === tab).label}</h3>
                <p className="mt-1 text-sm text-ink-500 max-w-xs mx-auto">Bu boʻlim prototipning bir qismi. Akkauntingizni ulang va sozlang.</p>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline">Bekor qilish</Button>
            <Button variant="primary" icon="Check" onClick={save} disabled={saving}>
              {saving ? 'Saqlanmoqda…' : 'Oʻzgarishlarni saqlash'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
