export const ZONES = [
  { id: 'z1', name: 'Asosiy zal',  short: 'Zal',     icon: 'LayoutGrid', color: '#1F4E79' },
  { id: 'z2', name: 'Veranda',     short: 'Veranda', icon: 'Trees',      color: '#27AE60' },
  { id: 'z3', name: 'VIP xonalar', short: 'VIP',     icon: 'Crown',      color: '#F39C12' },
  { id: 'z4', name: 'Terrasa',     short: 'Terrasa', icon: 'Sun',        color: '#E74C3C' },
];

const ZONE_TABLE_COUNTS = { z1: 14, z2: 8, z3: 4, z4: 6 };

export const TABLES = [];
(function buildTables() {
  let counter = 1;
  for (const zone of ZONES) {
    const n = ZONE_TABLE_COUNTS[zone.id];
    for (let i = 1; i <= n; i++) {
      let seats;
      if (zone.id === 'z3') seats = i % 2 ? 6 : 8;
      else if (zone.id === 'z2') seats = 4;
      else if (zone.id === 'z4') seats = i % 2 ? 4 : 2;
      else seats = (i % 3 === 0) ? 6 : (i % 2 === 0 ? 4 : 2);
      TABLES.push({ id: `t${counter++}`, zoneId: zone.id, number: i, seats });
    }
  }
})();

export function getTableById(id)  { return TABLES.find(t => t.id === id); }
export function getZoneById(id)   { return ZONES.find(z => z.id === id); }
export function tablesInZone(zid) { return TABLES.filter(t => t.zoneId === zid); }
export function tableLabel(o)     { return `${o.zoneShort} · ${o.tableNumber}-stol`; }

export const STAFF = [
  { id: 's1', name: 'Aziza Karimova',     phone: '+998 90 123 45 67', role: 'Menejer',   joined: '2024-03-12', avatar: 'AK', color: '#1F4E79' },
  { id: 's2', name: 'Bobur Yusupov',      phone: '+998 91 220 14 09', role: 'Ofitsiant', joined: '2024-06-04', avatar: 'BY', color: '#2E75B6' },
  { id: 's3', name: 'Dilnoza Tursunova',  phone: '+998 93 451 90 11', role: 'Ofitsiant', joined: '2025-01-18', avatar: 'DT', color: '#27AE60' },
  { id: 's4', name: 'Eldor Rashidov',     phone: '+998 90 778 22 31', role: 'Oshpaz',    joined: '2023-11-02', avatar: 'ER', color: '#F39C12' },
  { id: 's5', name: 'Feruza Saidova',     phone: '+998 99 312 56 88', role: 'Ofitsiant', joined: '2024-08-22', avatar: 'FS', color: '#8e44ad' },
  { id: 's6', name: 'Gʻulom Toshev',      phone: '+998 94 600 71 03', role: 'Ofitsiant', joined: '2025-02-09', avatar: 'GT', color: '#E74C3C' },
  { id: 's7', name: 'Hilola Mahkamova',   phone: '+998 90 909 12 12', role: 'Kassir',    joined: '2023-07-14', avatar: 'HM', color: '#16a085' },
  { id: 's8', name: 'Ilyos Nazarov',      phone: '+998 91 444 88 77', role: 'Ofitsiant', joined: '2024-12-30', avatar: 'IN', color: '#2c3e50' },
];

export const CATEGORIES = [
  { id: 'c1', name: 'Salatlar va appetayzerlar', short: 'Salatlar',   icon: 'Soup' },
  { id: 'c2', name: 'Asosiy taomlar',            short: 'Asosiy',     icon: 'UtensilsCrossed' },
  { id: 'c3', name: 'Mangaldan',                 short: 'Mangal',     icon: 'Flame' },
  { id: 'c4', name: 'Yangi salatlar',            short: 'Salatlar',   icon: 'Salad' },
  { id: 'c5', name: 'Shirinliklar',              short: 'Shirinlik',  icon: 'Cake' },
  { id: 'c6', name: 'Ichimliklar',               short: 'Ichimlik',   icon: 'CupSoda' },
];

export const MENU = [
  { id: 'm1',  name: 'Palov',                category: 'c2', price: 45000 },
  { id: 'm2',  name: 'Lagʻmon',              category: 'c2', price: 38000 },
  { id: 'm3',  name: 'Manti (6 dona)',       category: 'c2', price: 42000 },
  { id: 'm4',  name: 'Beshbarmoq',           category: 'c2', price: 55000 },
  { id: 'm5',  name: 'Qoʻyning shashligi',   category: 'c3', price: 35000 },
  { id: 'm6',  name: 'Mol goʻshtli shashlik',category: 'c3', price: 32000 },
  { id: 'm7',  name: 'Tandirda tovuq',       category: 'c3', price: 68000 },
  { id: 'm8',  name: 'Kabob toʻplami',       category: 'c3', price: 95000 },
  { id: 'm9',  name: 'Achchiq-chuchuk',      category: 'c4', price: 18000 },
  { id: 'm10', name: 'Yunon salati',         category: 'c4', price: 28000 },
  { id: 'm11', name: 'Sezar (tovuqli)',      category: 'c4', price: 36000 },
  { id: 'm12', name: 'Shoʻrva',              category: 'c1', price: 32000 },
  { id: 'm13', name: 'Mastava',              category: 'c1', price: 28000 },
  { id: 'm14', name: 'Somsa (3 dona)',       category: 'c1', price: 24000 },
  { id: 'm15', name: 'Chak-chak',            category: 'c5', price: 22000 },
  { id: 'm16', name: 'Pahlava',              category: 'c5', price: 26000 },
  { id: 'm17', name: 'Holva',                category: 'c5', price: 18000 },
  { id: 'm18', name: 'Koʻk choy (choynak)',  category: 'c6', price: 8000 },
  { id: 'm19', name: 'Ayron',                category: 'c6', price: 12000 },
  { id: 'm20', name: 'Limonad',              category: 'c6', price: 18000 },
  { id: 'm21', name: 'Espresso',             category: 'c6', price: 15000 },
];

export const STATUSES = ['preparing', 'delivered', 'closed'];

export const STATUS_META = {
  preparing: { label: 'Tayyorlanmoqda',  bg: '#fdf1de', fg: '#8a5a07', dot: '#F39C12' },
  delivered: { label: 'Yetkazib berildi', bg: '#e6f6ec', fg: '#1d7a44', dot: '#27AE60' },
  closed:    { label: 'Yopildi',          bg: '#eef0f4', fg: '#3d4654', dot: '#8a93a3' },
};

export const ITEM_STATUSES = ['preparing', 'delivered', 'cancelled'];

export const ITEM_STATUS_META = {
  preparing: { label: 'Tayyorlanmoqda',  short: 'Tayyor.',  bg: '#fdf1de', fg: '#8a5a07', dot: '#F39C12' },
  delivered: { label: 'Yetkazib berildi', short: 'Yetkazildi', bg: '#e6f6ec', fg: '#1d7a44', dot: '#27AE60' },
  cancelled: { label: 'Bekor qilindi',   short: 'Bekor',    bg: '#fde7e4', fg: '#a92e22', dot: '#E74C3C' },
};

export const TABLE_STATUS_META = {
  free:     { label: 'Boʻsh',           bg: '#e6f6ec', fg: '#1d7a44', dot: '#27AE60' },
  occupied: { label: 'Band',            bg: '#d7e7f4', fg: '#1F4E79', dot: '#2E75B6' },
  reserved: { label: 'Bron qilingan',   bg: '#fdf1de', fg: '#8a5a07', dot: '#F39C12' },
  dirty:    { label: 'Yigʻish kerak',   bg: '#eef0f4', fg: '#3d4654', dot: '#8a93a3' },
};

function mulberry32(seed) {
  return function() {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildOrders() {
  const rnd = mulberry32(42);
  const list = [];
  const now = new Date();
  const waiters = STAFF.filter(s => s.role === 'Ofitsiant');

  for (let i = 0; i < 42; i++) {
    const minsAgo = Math.floor(rnd() * 480);
    const t = new Date(now.getTime() - minsAgo * 60 * 1000);
    const waiter = waiters[Math.floor(rnd() * waiters.length)];
    const table = TABLES[Math.floor(rnd() * TABLES.length)];
    const zone = getZoneById(table.zoneId);

    let status;
    const r = rnd();
    if (minsAgo < 30)      status = 'preparing';
    else if (minsAgo < 90) status = r < 0.4 ? 'preparing' : r < 0.8 ? 'delivered' : 'closed';
    else                   status = r < 0.05 ? 'preparing' : r < 0.45 ? 'delivered' : 'closed';

    const itemSt = status === 'preparing' ? 'preparing' : 'delivered';

    const itemCount = 1 + Math.floor(rnd() * 5);
    const items = [];
    let subtotal = 0;
    for (let j = 0; j < itemCount; j++) {
      const m = MENU[Math.floor(rnd() * MENU.length)];
      const qty = 1 + Math.floor(rnd() * 3);
      items.push({ id: `${m.id}-${j}`, menuId: m.id, name: m.name, qty, price: m.price, status: itemSt });
      subtotal += m.price * qty;
    }
    const serviceFee = Math.round(subtotal * 0.1);
    const total = subtotal + serviceFee;

    list.push({
      id: 1000 + i,
      number: `#${(1000 + i).toString().padStart(4, '0')}`,
      tableId: table.id,
      tableNumber: table.number,
      tableSeats: table.seats,
      zoneId: zone.id,
      zone: zone.name,
      zoneShort: zone.short,
      zoneColor: zone.color,
      waiterId: waiter.id,
      waiter: waiter.name,
      waiterAvatar: waiter.avatar,
      waiterColor: waiter.color,
      itemCount: items.reduce((s, i) => s + i.qty, 0),
      items,
      subtotal,
      serviceFee,
      total,
      status,
      time: t,
    });
  }
  list.sort((a, b) => b.time - a.time);
  return list;
}

export const ORDERS = buildOrders();

(function assignInitialTableStatuses() {
  const rnd = mulberry32(7);
  TABLES.forEach(t => {
    const r = rnd();
    if (r < 0.12) t.initStatus = 'dirty';
    else t.initStatus = null;
  });
})();

export function getTableStatus(tableId, orders = ORDERS) {
  const active = orders.find(o => o.tableId === tableId && (o.status === 'open' || o.status === 'in_progress' || o.status === 'ready'));
  if (active) return { status: 'occupied', order: active };
  const t = getTableById(tableId);
  return { status: t && t.initStatus ? t.initStatus : 'free' };
}

export function topItemsToday(ordersArr = ORDERS) {
  const counts = {};
  ordersArr.forEach(o => {
    o.items.forEach(it => {
      counts[it.menuId] = (counts[it.menuId] || 0) + it.qty;
    });
  });
  return Object.entries(counts)
    .map(([menuId, qty]) => {
      const m = MENU.find(x => x.id === menuId);
      return { menuId, name: m.name, qty, revenue: m.price * qty };
    })
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 10);
}

// Real buyurtmalardan (adapter shaklidagi) eng ko'p sotilgan taomlarni hisoblaydi
export function topItemsFromOrders(ordersArr = [], limit = 10) {
  const map = {};
  ordersArr.forEach(o => (o.items || []).forEach(it => {
    if (it.status === 'cancelled') return;
    if (!map[it.menuId]) map[it.menuId] = { menuId: it.menuId, name: it.name, qty: 0, revenue: 0 };
    map[it.menuId].qty += it.qty;
    map[it.menuId].revenue += it.price * it.qty;
  }));
  return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, limit);
}

function buildSeries() {
  const rnd = mulberry32(99);
  const out = [];
  const today = new Date();
  const months = ['Yan','Fev','Mar','Apr','May','Iyn','Iyl','Avg','Sen','Okt','Noy','Dek'];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const base = 5_200_000;
    const wkBoost = (d.getDay() === 5 || d.getDay() === 6) ? 1.5 : 1.0;
    const wave = 1 + 0.25 * Math.sin(i / 3.5);
    const noise = 0.85 + rnd() * 0.4;
    const revenue = Math.round(base * wkBoost * wave * noise);
    const orders = Math.round(revenue / 95_000 + rnd() * 12);
    out.push({ day: `${d.getDate()} ${months[d.getMonth()]}`, dateRaw: d, revenue, orders });
  }
  return out;
}

export const SERIES_30 = buildSeries();

export function formatUZS(n) {
  return new Intl.NumberFormat('en-US').format(Math.round(n)).replace(/,/g, ' ') + ' soʻm';
}
// Narxlar har doim aniq ko'rsatiladi (qisqartmasiz, "k"/"M" ishlatilmaydi).
export function formatUZSShort(n) {
  return new Intl.NumberFormat('en-US').format(Math.round(n)).replace(/,/g, ' ');
}

export const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];

// "2026-06-05" -> "5-iyun" (timezone'ga bog'liq bo'lmasligi uchun qo'lda ajratamiz)
export function uzDateShort(iso) {
  const parts = String(iso).split('-').map(Number);
  const [, m, d] = parts;
  if (!m || !d) return String(iso);
  return `${d}-${UZ_MONTHS[m - 1]}`;
}
export function timeAgo(d) {
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s oldin`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} daq oldin`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} soat oldin`;
  const day = Math.floor(hr / 24);
  return `${day} kun oldin`;
}
export function formatTime(d) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}
export function formatDate(d) {
  const months = ['yan','fev','mar','apr','may','iyn','iyl','avg','sen','okt','noy','dek'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
