// WebSocket orqali real-time yangilanishlar. Backend resurs o'zgarganda
// {event:'resource_changed', resource:'orders'|'locations'} yuboradi.
import { API_BASE, getSession } from './api';

function realtimeUrl(token) {
  // API_BASE: http(s)://host/api/v1  ->  ws(s)://host/ws/realtime/
  const base = API_BASE.replace(/\/api\/v1\/?$/, '');
  const wsBase = base.replace(/^http/, 'ws');
  return `${wsBase}/ws/realtime/?token=${encodeURIComponent(token)}`;
}

// onResource(resource) — har bir 'resource_changed' xabarida chaqiriladi.
// Uzilganda eksponensial backoff bilan qayta ulanadi. Tozalash funksiyasini qaytaradi.
export function connectRealtime(onResource) {
  let ws = null;
  let closed = false;
  let retry = 0;
  let timer = null;

  function schedule() {
    if (closed) return;
    retry = Math.min(retry + 1, 6);
    const delay = Math.min(1000 * 2 ** retry, 30000);
    timer = setTimeout(open, delay);
  }

  function open() {
    const token = getSession()?.access;
    if (!token) { schedule(); return; }
    try {
      ws = new WebSocket(realtimeUrl(token));
    } catch {
      schedule();
      return;
    }
    ws.onopen = () => { retry = 0; };
    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'resource_changed') onResource(data.resource);
      } catch {}
    };
    ws.onclose = () => { if (!closed) schedule(); };
    ws.onerror = () => { try { ws.close(); } catch {} };
  }

  open();

  return () => {
    closed = true;
    clearTimeout(timer);
    if (ws) { try { ws.close(); } catch {} }
  };
}
