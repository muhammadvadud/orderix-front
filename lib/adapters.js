// Backend obyektlarini frontend kutadigan shaklga o'tkazuvchi adapterlar.

export const ROLE_LABELS = {
  manager: 'Menejer',
  waiter: 'Ofitsiant',
  cook: 'Oshpaz',
  admin: 'Admin',
};

export const LABEL_TO_ROLE = {
  Menejer: 'manager',
  Ofitsiant: 'waiter',
  Oshpaz: 'cook',
  Kassir: 'waiter', // backend hozircha kassirni qo'llamaydi
  Admin: 'admin',
};

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}

function initialsOf(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '–';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function adaptUser(u) {
  const name = u.full_name || u.username || u.phone_number;
  return {
    id: u.id,
    name,
    phone: u.phone_number,
    role: roleLabel(u.role),
    roleRaw: u.role,
    joined: u.created_at,
    avatar: u.avatar || initialsOf(name),
    color: u.color || '#2E75B6',
  };
}

export function adaptCategory(c) {
  return {
    id: c.id,
    name: c.name,
    short: (c.name || '').slice(0, 12),
    icon: c.icon || 'Utensils',
  };
}

export function adaptMenuItem(m) {
  return {
    id: m.id,
    name: m.name,
    category: m.category,
    price: Number(m.price),
  };
}

export function adaptZone(z) {
  return {
    id: z.id,
    name: z.name,
    short: z.short || (z.name || '').slice(0, 8),
    icon: z.icon || 'LayoutGrid',
    color: z.color || '#1F4E79',
  };
}

export function adaptTable(t) {
  return {
    id: t.id,
    zoneId: t.parent,
    number: t.number,
    seats: t.seats || 0,
    // occupied aktiv buyurtmadan hisoblanadi — qo'lda statuslarni saqlaymiz
    initStatus: t.status === 'occupied' ? null : t.status,
  };
}

export function adaptOrder(o, { tablesById = {}, zonesById = {}, staffById = {} } = {}) {
  const table = tablesById[o.location];
  const zone = table ? zonesById[table.zoneId] : null;
  const waiter = staffById[o.waiter];

  const items = (o.items || []).map((it) => ({
    id: it.id,
    menuId: it.menu_item,
    name: it.menu_item_name,
    qty: it.quantity,
    price: Number(it.price),
    status: it.status || 'preparing',
  }));

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const total = Number(o.total_amount);
  const itemCount = items.reduce((s, it) => s + it.qty, 0);

  return {
    id: o.id,
    number: `#${String(o.id).padStart(4, '0')}`,
    tableId: o.location,
    tableNumber: table?.number ?? '—',
    tableSeats: table?.seats ?? 0,
    zoneId: zone?.id ?? null,
    zone: zone?.name ?? o.location_name ?? '—',
    zoneShort: zone?.short ?? o.location_name ?? '—',
    zoneColor: zone?.color ?? '#2E75B6',
    waiterId: o.waiter,
    waiter: waiter?.name || o.waiter_name || '—',
    waiterAvatar: waiter?.avatar || initialsOf(o.waiter_name),
    waiterColor: waiter?.color || '#2E75B6',
    itemCount,
    items,
    subtotal,
    serviceFee: Math.max(0, total - subtotal),
    total,
    status: o.status,
    time: new Date(o.created),
  };
}
