// Domen bo'yicha API chaqiruvlari. Ko'pchiligi adapter orqali frontend shaklini qaytaradi.
import { api, getSession, setSession } from './api';
import {
  adaptUser, adaptCategory, adaptMenuItem, adaptZone, adaptTable, adaptOrder,
  LABEL_TO_ROLE, ROLE_LABELS, roleLabel,
} from './adapters';
import { pickAvatarColor } from './colors';

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

function restaurantId() {
  return getSession()?.user?.restaurant ?? null;
}

function cleanPhone(phone) {
  // backendga raqam '+' belgisisiz yuboriladi
  return (phone || '').replace(/[\s+]/g, '');
}

// ---- Auth ----
export async function loginPassword(phone_number, password) {
  return api.post('/auth/login', { phone_number: cleanPhone(phone_number), password }, { auth: false });
}

export async function otpRequest(phone_number) {
  return api.post('/auth/otp/request', { phone_number: cleanPhone(phone_number) }, { auth: false });
}

export async function otpVerify(phone_number, code) {
  return api.post('/auth/otp/verify', { phone_number: cleanPhone(phone_number), code }, { auth: false });
}

export async function getMe() {
  return api.get('/auth/me');
}

// Login dan keyin to'liq profilni (restaurant bilan) sessiyaga yozadi
export async function hydrateSession(base) {
  setSession(base);
  try {
    const me = await getMe();
    setSession({ ...getSession(), user: { ...base.user, ...me } });
  } catch {}
  return getSession();
}

// ---- Users / Staff ----
// Xodim lavozimlari (rollar) backenddan keladi. value — frontend yorlig'i
// (masalan "Menejer"), bu staff oqimi shu yorliqlar bilan ishlaydi.
export async function listRoles() {
  try {
    const data = await api.get('/users/roles');
    const list = unwrapList(data);
    if (list.length) {
      return list.map((r) => {
        const label = roleLabel(r.value);
        return { value: label, label, code: r.value };
      });
    }
  } catch {}
  // Fallback — backend bilan bog'lanib bo'lmasa, mahalliy ro'yxat
  return Object.entries(ROLE_LABELS).map(([code, label]) => ({ value: label, label, code }));
}

export async function listStaff() {
  const data = await api.get('/users?limit=100');
  return unwrapList(data).map(adaptUser);
}

export async function createStaff({ name, phone, role }) {
  const digits = cleanPhone(phone).replace(/\D/g, '');
  const payload = {
    username: 'u' + (digits || Date.now()),
    full_name: name,
    phone_number: cleanPhone(phone),
    role: LABEL_TO_ROLE[role] || 'waiter',
    password: 'orderix' + (digits.slice(-4) || '1234'),
    color: pickAvatarColor(digits || name),
  };
  const rid = restaurantId();
  if (rid) payload.restaurant = rid;
  const created = await api.post('/users', payload);
  return adaptUser(created);
}

export async function updateStaff(id, { name, phone, role }) {
  const payload = {};
  if (name !== undefined) payload.full_name = name;
  if (phone !== undefined) payload.phone_number = cleanPhone(phone);
  if (role !== undefined) payload.role = LABEL_TO_ROLE[role] || 'waiter';
  const updated = await api.patch(`/users/${id}`, payload);
  return adaptUser(updated);
}

export async function deleteStaff(id) {
  await api.del(`/users/${id}`);
}

// ---- Menu categories ----
export async function listCategories() {
  const data = await api.get('/menu/categories?limit=100');
  return unwrapList(data).map(adaptCategory);
}

export async function createCategory({ name, icon }) {
  const payload = { name, icon };
  const rid = restaurantId();
  if (rid) payload.restaurant = rid;
  return adaptCategory(await api.post('/menu/categories', payload));
}

export async function updateCategory(id, { name, icon }) {
  return adaptCategory(await api.patch(`/menu/categories/${id}`, { name, icon }));
}

export async function deleteCategory(id) {
  await api.del(`/menu/categories/${id}`);
}

// ---- Menu items ----
export async function listMenuItems() {
  const data = await api.get('/menu/items?limit=200');
  return unwrapList(data).map(adaptMenuItem);
}

export async function createMenuItem({ name, category, price }) {
  const payload = { name, category, price };
  const rid = restaurantId();
  if (rid) payload.restaurant = rid;
  return adaptMenuItem(await api.post('/menu/items', payload));
}

export async function updateMenuItem(id, { name, category, price }) {
  return adaptMenuItem(await api.patch(`/menu/items/${id}`, { name, category, price }));
}

export async function deleteMenuItem(id) {
  await api.del(`/menu/items/${id}`);
}

// ---- Locations (zones + tables) ----
export async function listZonesAndTables() {
  const data = await api.get('/locations/zones');
  const raw = unwrapList(data);
  const zones = raw.map(adaptZone);
  const tables = [];
  raw.forEach((z) => {
    (z.tables || []).forEach((t) => {
      tables.push(adaptTable({ ...t, parent: z.id }));
    });
  });
  return { zones, tables };
}

export async function createZone({ name, short, icon, color }) {
  const payload = { type: 'zone', name, short, icon, color };
  const rid = restaurantId();
  if (rid) payload.restaurant = rid;
  return adaptZone(await api.post('/locations', payload));
}

export async function createTable({ zoneId, seats, number }) {
  const payload = {
    type: 'table',
    name: `${number}-stol`,
    parent: zoneId,
    seats,
    number,
  };
  const rid = restaurantId();
  if (rid) payload.restaurant = rid;
  return adaptTable(await api.post('/locations', payload));
}

export async function setTableStatus(id, status) {
  return api.patch(`/locations/${id}/status`, { status });
}

// ---- Orders ----
export async function listOrders(params = '', lookups = {}) {
  const data = await api.get(`/orders?limit=100${params ? '&' + params : ''}`);
  return unwrapList(data).map((o) => adaptOrder(o, lookups));
}

export async function getOrder(id, lookups = {}) {
  return adaptOrder(await api.get(`/orders/${id}`), lookups);
}

export async function createOrder({ location_id, items }, lookups = {}) {
  // items: [{ menu_item_id, quantity }]
  return adaptOrder(await api.post('/orders', { location_id, items }), lookups);
}

export async function setOrderStatus(id, status, lookups = {}) {
  return adaptOrder(await api.patch(`/orders/${id}/status`, { status }), lookups);
}

export async function setOrderItemStatus(orderId, itemId, status, lookups = {}) {
  return adaptOrder(await api.patch(`/orders/${orderId}/items/${itemId}/status`, { status }), lookups);
}

export async function replaceOrderItems(orderId, items, lookups = {}) {
  // items: [{ menu_item_id, quantity }]
  return adaptOrder(await api.put(`/orders/${orderId}/items`, { items }), lookups);
}

// ---- Stats ----
export async function dashboardStats() {
  return api.get('/stats/dashboard');
}

export async function topItems({ date = '', range = '', dateFrom = '', dateTo = '', limit = 10 } = {}) {
  const params = new URLSearchParams();
  if (dateFrom && dateTo) {
    params.set('date_from', dateFrom);
    params.set('date_to', dateTo);
  } else if (range) {
    params.set('range', range);
  } else if (date) {
    params.set('date', date);
  }
  params.set('limit', String(limit));
  const data = await api.get(`/stats/top-items?${params.toString()}`);
  return unwrapList(data).map(r => ({
    menuId: r.menu_id,
    name: r.name,
    qty: Number(r.qty) || 0,
    revenue: Number(r.revenue) || 0,
  }));
}

export async function seriesStats({ range = '30d', dateFrom = '', dateTo = '' } = {}) {
  const params = new URLSearchParams();
  if (dateFrom && dateTo) {
    params.set('date_from', dateFrom);
    params.set('date_to', dateTo);
  } else {
    params.set('range', range);
  }
  const data = await api.get(`/stats/series?${params.toString()}`);
  return unwrapList(data);
}

export async function waiterStats() {
  return api.get('/stats/waiter');
}

// ---- Settings ----
export async function getSettings() {
  return api.get('/settings');
}

export async function updateSettings(payload) {
  return api.patch('/settings', payload);
}
