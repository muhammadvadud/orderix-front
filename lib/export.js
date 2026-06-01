import { STATUS_META, formatDate, formatTime } from './data';

// rows: massiv ichida massivlar (birinchisi — sarlavha qatori)
export function downloadCSV(filename, rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = rows.map(r => r.map(esc).join(',')).join('\r\n');
  // BOM — Excel UTF-8 ni to'g'ri o'qishi uchun
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function ordersToRows(orders) {
  const header = ['№', 'Joy', 'Stol', 'Ofitsiant', 'Taomlar', 'Holat', 'Oraliq summa', 'Xizmat haqi', 'Jami', 'Sana', 'Vaqt'];
  const body = orders.map(o => {
    const t = o.time instanceof Date ? o.time : (o.time ? new Date(o.time) : null);
    return [
      o.number,
      o.zone,
      o.tableNumber,
      o.waiter,
      o.itemCount,
      STATUS_META[o.status]?.label || o.status,
      o.subtotal,
      o.serviceFee,
      o.total,
      t ? formatDate(t) : '',
      t ? formatTime(t) : '',
    ];
  });
  return [header, ...body];
}

export function seriesToRows(data) {
  const header = ['Sana', 'Buyurtmalar', 'Tushum'];
  const body = data.map(d => [d.label || d.date, d.orders, d.revenue]);
  return [header, ...body];
}

export function dateStamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
