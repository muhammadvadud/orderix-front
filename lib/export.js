import { STATUS_META, formatDate, formatTime } from './data';

// rows: massiv ichida massivlar (birinchisi — sarlavha qatori).
// xlsx kutubxonasi faqat tugma bosilganda yuklanadi (bundle shishmasligi uchun).
// Fayl butunlay browserda yaratiladi — serverga hech narsa yuborilmaydi.
export async function exportXLSX(filename, rows, sheetName = 'Maʼlumot') {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.aoa_to_sheet(rows);
  // Ustun kengliklarini sarlavha/qiymat uzunligiga qarab moslaymiz
  const colCount = rows[0]?.length || 0;
  ws['!cols'] = Array.from({ length: colCount }, (_, c) => {
    const max = rows.reduce((m, r) => Math.max(m, String(r[c] ?? '').length), 0);
    return { wch: Math.min(Math.max(max + 2, 8), 40) };
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
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
