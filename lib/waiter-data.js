// Waiter app mock data

export const WAITER_COLORS = {
  NAVY: '#1F4E79',
  ACCENT: '#2E75B6',
  NAVY_DARK: '#163A5C',
  BG: '#F4F6FA',
};

export const WAITER = {
  name: 'Aziz Karimov',
  role: 'Katta ofitsiant',
  initials: 'AK',
  restaurant: 'Plov Center · Yunusobod',
  phone: '+998 90 123 45 67',
  shift: '11:00 — 23:00',
  ordersToday: 14,
  ordersWeek: 87,
  revenueToday: 1_840_000,
  serviceFeeToday: 0,
  serviceFeeWeek: 0,
  rating: 4.9,
};

export const TABLES = [
  { id: 't1',  label: 'T1',     zone: 'Zal',     seats: 2,  status: 'free' },
  { id: 't2',  label: 'T2',     zone: 'Zal',     seats: 4,  status: 'occupied', orderId: 'o1' },
  { id: 't3',  label: 'T3',     zone: 'Zal',     seats: 4,  status: 'free' },
  { id: 't4',  label: 'T4',     zone: 'Zal',     seats: 6,  status: 'occupied', orderId: 'o2' },
  { id: 't5',  label: 'T5',     zone: 'Zal',     seats: 2,  status: 'unavailable' },
  { id: 't6',  label: 'T6',     zone: 'Zal',     seats: 4,  status: 'free' },
  { id: 'b1',  label: 'Bar 1',  zone: 'Bar',     seats: 1,  status: 'free' },
  { id: 'b2',  label: 'Bar 2',  zone: 'Bar',     seats: 1,  status: 'occupied', orderId: 'o3' },
  { id: 'b3',  label: 'Bar 3',  zone: 'Bar',     seats: 1,  status: 'free' },
  { id: 'tr1', label: 'Ter. 1', zone: 'Terras',  seats: 4,  status: 'free' },
  { id: 'tr2', label: 'Ter. 2', zone: 'Terras',  seats: 4,  status: 'free' },
  { id: 'tr3', label: 'Ter. 3', zone: 'Terras',  seats: 6,  status: 'unavailable' },
  { id: 'tr4', label: 'Ter. 4', zone: 'Terras',  seats: 8,  status: 'free' },
  { id: 'v1',  label: 'VIP 1',  zone: 'VIP',     seats: 8,  status: 'free' },
  { id: 'v2',  label: 'VIP 2',  zone: 'VIP',     seats: 10, status: 'free' },
];

export const CATEGORIES = [
  { id: 'plov',     name: 'Plov',        icon: 'Wheat' },
  { id: 'shashlik', name: 'Shashlik',    icon: 'Flame' },
  { id: 'salads',   name: 'Salatlar',    icon: 'Salad' },
  { id: 'soups',    name: "Sho'rvalar",  icon: 'Utensils' },
  { id: 'drinks',   name: 'Ichimliklar', icon: 'CupSoda' },
  { id: 'desserts', name: 'Shirinliklar',icon: 'IceCream' },
];

export const MENU = [
  { id: 'm1',  cat: 'plov',     name: 'Toshkent plovi',        price: 65_000, desc: 'Klassik, bedana tuxumi bilan' },
  { id: 'm2',  cat: 'plov',     name: 'Samarqand plovi',       price: 72_000, desc: 'Sariq sabzi, kishmish bilan' },
  { id: 'm3',  cat: 'plov',     name: "To'y plovi",            price: 85_000, desc: "Kazi va no'xat bilan" },
  { id: 'm4',  cat: 'plov',     name: 'Vegetarian plov',       price: 48_000, desc: "Go'shtsiz, qo'shimcha sabzi" },
  { id: 'm5',  cat: 'shashlik', name: "Mol go'shti shashligi", price: 38_000, desc: 'tayoqcha' },
  { id: 'm6',  cat: 'shashlik', name: "Qo'y shashligi",        price: 42_000, desc: 'tayoqcha' },
  { id: 'm7',  cat: 'shashlik', name: 'Tovuq shashligi',       price: 32_000, desc: 'tayoqcha' },
  { id: 'm8',  cat: 'shashlik', name: 'Jigar shashligi',       price: 28_000, desc: 'tayoqcha' },
  { id: 'm9',  cat: 'salads',   name: 'Achchiq-chuchuk',       price: 24_000, desc: 'Pomidor, piyoz, chili' },
  { id: 'm10', cat: 'salads',   name: 'Toshkent salati',       price: 38_000, desc: "Mol go'shti, turp, tuxum" },
  { id: 'm11', cat: 'salads',   name: 'Yunon salati',          price: 42_000, desc: 'Feta, zaytun, bodring' },
  { id: 'm12', cat: 'soups',    name: "Sho'rva",               price: 35_000, desc: "Qo'y sho'rvasi, sabzavotlar" },
  { id: 'm13', cat: 'soups',    name: "Lag'mon",               price: 45_000, desc: "Qo'lda tortilgan qiyma" },
  { id: 'm14', cat: 'soups',    name: 'Mastava',               price: 32_000, desc: "Guruch va go'shtli sho'rva" },
  { id: 'm15', cat: 'drinks',   name: "Ko'k choy",             price:  8_000, desc: 'Choynak, 2 kishi uchun' },
  { id: 'm16', cat: 'drinks',   name: 'Qora choy',             price:  8_000, desc: 'Choynak, 2 kishi uchun' },
  { id: 'm17', cat: 'drinks',   name: 'Yangi limonad',         price: 22_000, desc: '0.5L stakan' },
  { id: 'm18', cat: 'drinks',   name: 'Mineral suv',           price: 12_000, desc: '0.5L shisha' },
  { id: 'm19', cat: 'drinks',   name: 'Ayron',                 price: 14_000, desc: "Sho'r qatiq ichimlik" },
  { id: 'm20', cat: 'desserts', name: 'Chak-chak',             price: 28_000, desc: 'Asalda qovurilgan' },
  { id: 'm21', cat: 'desserts', name: 'Halvo',                 price: 22_000, desc: 'Kunjut, klassik' },
  { id: 'm22', cat: 'desserts', name: 'Vanil muzqaymoq',       price: 18_000, desc: 'Ikki porsiya' },
];

// Xizmat haqi ulushi (0.10 = 10%). Restoran sozlamasidan setServiceRate orqali yangilanadi.
export let SERVICE_RATE = 0.10;
export function setServiceRate(pct) {
  const v = Number(pct);
  if (!Number.isNaN(v)) SERVICE_RATE = v / 100;
}

export const INITIAL_ORDERS = [
  {
    id: 'o1', tableId: 't2', tableLabel: 'T2 · Zal',
    status: 'preparing',
    createdAt: Date.now() - 12 * 60_000,
    items: [
      { menuId: 'm2',  qty: 2, status: 'preparing' },
      { menuId: 'm6',  qty: 4, status: 'preparing' },
      { menuId: 'm9',  qty: 1, status: 'preparing' },
      { menuId: 'm15', qty: 1, status: 'preparing' },
    ],
  },
  {
    id: 'o2', tableId: 't4', tableLabel: 'T4 · Zal',
    status: 'preparing',
    createdAt: Date.now() - 28 * 60_000,
    items: [
      { menuId: 'm3',  qty: 3, status: 'delivered' },
      { menuId: 'm12', qty: 2, status: 'delivered' },
      { menuId: 'm10', qty: 1, status: 'preparing' },
      { menuId: 'm17', qty: 2, status: 'preparing' },
      { menuId: 'm20', qty: 1, status: 'preparing' },
    ],
  },
  {
    id: 'o3', tableId: 'b2', tableLabel: 'Bar 2 · Bar',
    status: 'delivered',
    createdAt: Date.now() - 47 * 60_000,
    items: [
      { menuId: 'm7',  qty: 2, status: 'delivered' },
      { menuId: 'm18', qty: 1, status: 'delivered' },
    ],
  },
];

function rng(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const HISTORY_ORDERS = (function () {
  const rand = rng(77);
  const now = Date.now();
  const list = [];
  for (let i = 0; i < 22; i++) {
    const minsAgo = 20 + Math.floor(rand() * 460);
    const table = TABLES[Math.floor(rand() * TABLES.length)];
    const itemCount = 1 + Math.floor(rand() * 5);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      const m = MENU[Math.floor(rand() * MENU.length)];
      items.push({ menuId: m.id, qty: 1 + Math.floor(rand() * 3), status: 'delivered' });
    }
    const r = rand();
    const status = r < 0.70 ? 'closed' : r < 0.90 ? 'delivered' : 'preparing';
    list.push({
      id: `h${i + 1}`,
      tableId: table.id,
      tableLabel: `${table.label} · ${table.zone}`,
      status,
      createdAt: now - minsAgo * 60_000,
      items,
    });
  }
  return list.sort((a, b) => b.createdAt - a.createdAt);
})();

// Backend'dan kelgan ma'lumot bilan modul holatini to'ldiradi (joyida).
// Shu tariqa findItem va boshqa yordamchilar real ma'lumot bilan ishlaydi.
export function setWaiterData({ menu, categories, tables, waiter } = {}) {
  if (menu)       { MENU.length = 0;       MENU.push(...menu); }
  if (categories) { CATEGORIES.length = 0; CATEGORIES.push(...categories); }
  if (tables)     { TABLES.length = 0;     TABLES.push(...tables); }
  if (waiter)     { Object.assign(WAITER, waiter); }
}

export function findItem(menuId) { return MENU.find(m => m.id === menuId); }

export function orderSubtotal(order) {
  // Backenddan kelgan subtotal bo'lsa o'shani, aks holda taom narxidan hisoblaymiz.
  if (typeof order.subtotal === 'number') return order.subtotal;
  return order.items.reduce((s, it) => {
    if (it.status === 'cancelled') return s;
    return s + ((it.price ?? findItem(it.menuId)?.price ?? 0) * it.qty);
  }, 0);
}

export function orderTotal(order) {
  // Mavjud buyurtma uchun backend yakuniy summasini ishlatamiz (xizmat haqi shunda hisoblangan).
  if (typeof order.total === 'number' && order.total > 0) return order.total;
  const sub = orderSubtotal(order);
  return sub + Math.round(sub * SERVICE_RATE);
}

export function orderItemCount(order) {
  return order.items.reduce((s, it) => it.status === 'cancelled' ? s : s + it.qty, 0);
}

export function formatSoum(n) {
  return n.toLocaleString('en-US').replace(/,/g, ' ') + ' UZS';
}

export function minutesAgo(ts) {
  const m = Math.max(0, Math.round((Date.now() - ts) / 60_000));
  if (m < 1) return 'hozirgina';
  if (m === 1) return '1 daq oldin';
  if (m < 60) return `${m} daq oldin`;
  const h = Math.floor(m / 60);
  return h === 1 ? '1 soat oldin' : `${h} soat oldin`;
}

export const STATUS_META = {
  preparing: { label: 'Tayyorlanmoqda',  dot: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
  delivered: { label: 'Yetkazib berildi', dot: '#10b981', bg: '#d1fae5', text: '#047857' },
  closed:    { label: 'Yopildi',          dot: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
};

export const ITEM_STATUS_META = {
  preparing: { label: 'Tayyorlanmoqda',  short: 'Tayyor.',    dot: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
  delivered: { label: 'Yetkazib berildi', short: 'Yetkazildi', dot: '#10b981', bg: '#d1fae5', text: '#047857' },
  cancelled: { label: 'Bekor qilindi',   short: 'Bekor',       dot: '#ef4444', bg: '#fee2e2', text: '#dc2626' },
};

export function nextAction(status) {
  if (status === 'preparing') return { label: 'Yetkazib berildi deb belgilash', next: 'delivered' };
  if (status === 'delivered') return { label: 'Buyurtmani yopish',               next: 'closed' };
  return null;
}
