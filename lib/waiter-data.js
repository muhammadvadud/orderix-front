// Waiter app mock data

export const WAITER_COLORS = {
  NAVY: '#1F4E79',
  ACCENT: '#2E75B6',
  NAVY_DARK: '#163A5C',
  BG: '#F4F6FA',
};

export const WAITER = {
  name: 'Aziz Karimov',
  role: 'Senior Waiter',
  initials: 'AK',
  restaurant: 'Plov Center · Yunusobod',
  phone: '+998 90 123 45 67',
  shift: '11:00 — 23:00',
  ordersToday: 14,
  ordersWeek: 87,
  revenueToday: 1_840_000,
  rating: 4.9,
};

export const TABLES = [
  { id: 't1',  label: 'T1',     zone: 'Hall',    seats: 2,  status: 'free' },
  { id: 't2',  label: 'T2',     zone: 'Hall',    seats: 4,  status: 'occupied', orderId: 'o1' },
  { id: 't3',  label: 'T3',     zone: 'Hall',    seats: 4,  status: 'free' },
  { id: 't4',  label: 'T4',     zone: 'Hall',    seats: 6,  status: 'occupied', orderId: 'o2' },
  { id: 't5',  label: 'T5',     zone: 'Hall',    seats: 2,  status: 'unavailable' },
  { id: 't6',  label: 'T6',     zone: 'Hall',    seats: 4,  status: 'free' },
  { id: 'b1',  label: 'Bar 1',  zone: 'Bar',     seats: 1,  status: 'free' },
  { id: 'b2',  label: 'Bar 2',  zone: 'Bar',     seats: 1,  status: 'occupied', orderId: 'o3' },
  { id: 'b3',  label: 'Bar 3',  zone: 'Bar',     seats: 1,  status: 'free' },
  { id: 'tr1', label: 'Ter. 1', zone: 'Terrace', seats: 4,  status: 'free' },
  { id: 'tr2', label: 'Ter. 2', zone: 'Terrace', seats: 4,  status: 'free' },
  { id: 'tr3', label: 'Ter. 3', zone: 'Terrace', seats: 6,  status: 'unavailable' },
  { id: 'tr4', label: 'Ter. 4', zone: 'Terrace', seats: 8,  status: 'free' },
  { id: 'v1',  label: 'VIP 1',  zone: 'VIP',     seats: 8,  status: 'free' },
  { id: 'v2',  label: 'VIP 2',  zone: 'VIP',     seats: 10, status: 'free' },
];

export const CATEGORIES = [
  { id: 'plov',     name: 'Plov',     icon: 'Wheat' },
  { id: 'shashlik', name: 'Shashlik', icon: 'Flame' },
  { id: 'salads',   name: 'Salads',   icon: 'Salad' },
  { id: 'soups',    name: 'Soups',    icon: 'Utensils' },
  { id: 'drinks',   name: 'Drinks',   icon: 'CupSoda' },
  { id: 'desserts', name: 'Desserts', icon: 'IceCream' },
];

export const MENU = [
  { id: 'm1',  cat: 'plov',     name: 'Tashkent Plov',     price: 65_000, desc: 'Classic, with quail egg' },
  { id: 'm2',  cat: 'plov',     name: 'Samarkand Plov',    price: 72_000, desc: 'Yellow carrot, raisins' },
  { id: 'm3',  cat: 'plov',     name: 'Wedding Plov',      price: 85_000, desc: 'With kazy & chickpeas' },
  { id: 'm4',  cat: 'plov',     name: 'Vegetarian Plov',   price: 48_000, desc: 'No meat, extra carrot' },
  { id: 'm5',  cat: 'shashlik', name: 'Beef Shashlik',     price: 38_000, desc: 'per skewer' },
  { id: 'm6',  cat: 'shashlik', name: 'Lamb Shashlik',     price: 42_000, desc: 'per skewer' },
  { id: 'm7',  cat: 'shashlik', name: 'Chicken Shashlik',  price: 32_000, desc: 'per skewer' },
  { id: 'm8',  cat: 'shashlik', name: 'Liver Shashlik',    price: 28_000, desc: 'per skewer' },
  { id: 'm9',  cat: 'salads',   name: 'Achichuk',          price: 24_000, desc: 'Tomato, onion, chili' },
  { id: 'm10', cat: 'salads',   name: 'Tashkent Salad',    price: 38_000, desc: 'Beef, radish, egg' },
  { id: 'm11', cat: 'salads',   name: 'Greek Salad',       price: 42_000, desc: 'Feta, olives, cucumber' },
  { id: 'm12', cat: 'soups',    name: 'Shurpa',            price: 35_000, desc: 'Lamb broth, vegetables' },
  { id: 'm13', cat: 'soups',    name: 'Lagman',            price: 45_000, desc: 'Hand-pulled noodles' },
  { id: 'm14', cat: 'soups',    name: 'Mastava',           price: 32_000, desc: 'Rice & meat soup' },
  { id: 'm15', cat: 'drinks',   name: 'Green Tea',         price:  8_000, desc: 'Pot, serves 2' },
  { id: 'm16', cat: 'drinks',   name: 'Black Tea',         price:  8_000, desc: 'Pot, serves 2' },
  { id: 'm17', cat: 'drinks',   name: 'Fresh Lemonade',    price: 22_000, desc: '0.5L glass' },
  { id: 'm18', cat: 'drinks',   name: 'Mineral Water',     price: 12_000, desc: '0.5L bottle' },
  { id: 'm19', cat: 'drinks',   name: 'Ayran',             price: 14_000, desc: 'Salted yogurt drink' },
  { id: 'm20', cat: 'desserts', name: 'Chak-chak',         price: 28_000, desc: 'Honey-glazed' },
  { id: 'm21', cat: 'desserts', name: 'Halva',             price: 22_000, desc: 'Sesame, classic' },
  { id: 'm22', cat: 'desserts', name: 'Vanilla Ice Cream', price: 18_000, desc: 'Two scoops' },
];

export const SERVICE_RATE = 0.10;

export const INITIAL_ORDERS = [
  {
    id: 'o1', tableId: 't2', tableLabel: 'T2 · Hall',
    status: 'preparing',
    createdAt: Date.now() - 12 * 60_000,
    items: [
      { menuId: 'm2', qty: 2 },
      { menuId: 'm6', qty: 4 },
      { menuId: 'm9', qty: 1 },
      { menuId: 'm15', qty: 1 },
    ],
  },
  {
    id: 'o2', tableId: 't4', tableLabel: 'T4 · Hall',
    status: 'ready',
    createdAt: Date.now() - 28 * 60_000,
    items: [
      { menuId: 'm3', qty: 3 },
      { menuId: 'm12', qty: 2 },
      { menuId: 'm10', qty: 1 },
      { menuId: 'm17', qty: 2 },
      { menuId: 'm20', qty: 1 },
    ],
  },
  {
    id: 'o3', tableId: 'b2', tableLabel: 'Bar 2 · Bar',
    status: 'served',
    createdAt: Date.now() - 47 * 60_000,
    items: [
      { menuId: 'm7', qty: 2 },
      { menuId: 'm18', qty: 1 },
    ],
  },
];

export function findItem(menuId) { return MENU.find(m => m.id === menuId); }

export function orderSubtotal(order) {
  return order.items.reduce((s, it) => s + (findItem(it.menuId)?.price || 0) * it.qty, 0);
}

export function orderTotal(order) {
  const sub = orderSubtotal(order);
  return sub + Math.round(sub * SERVICE_RATE);
}

export function orderItemCount(order) {
  return order.items.reduce((s, it) => s + it.qty, 0);
}

export function formatSoum(n) {
  return n.toLocaleString('en-US').replace(/,/g, ' ') + ' UZS';
}

export function minutesAgo(ts) {
  const m = Math.max(0, Math.round((Date.now() - ts) / 60_000));
  if (m < 1) return 'just now';
  if (m === 1) return '1 min ago';
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  return h === 1 ? '1 hr ago' : `${h} hr ago`;
}

export const STATUS_META = {
  pending:   { label: 'Pending',   dot: '#94a3b8', bg: '#f1f5f9', text: '#475569' },
  preparing: { label: 'Preparing', dot: '#f59e0b', bg: '#fef3c7', text: '#b45309' },
  ready:     { label: 'Ready',     dot: '#10b981', bg: '#d1fae5', text: '#047857' },
  served:    { label: 'Served',    dot: '#2E75B6', bg: '#dbeafe', text: '#1F4E79' },
};

export function nextAction(status) {
  if (status === 'pending')   return { label: 'Mark Preparing', next: 'preparing' };
  if (status === 'preparing') return { label: 'Mark Ready',     next: 'ready' };
  if (status === 'ready')     return { label: 'Mark Served',    next: 'served' };
  if (status === 'served')    return { label: 'Close Order',    next: 'closed' };
  return null;
}
