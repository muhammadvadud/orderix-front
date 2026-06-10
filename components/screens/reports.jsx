'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Icon } from '../Icon';
import { Card, Button, Select, Input, PageHeader, EmptyRow } from '../ui';
import { formatUZS, formatUZSShort, uzDateShort } from '@/lib/data';
import { seriesStats, topItems, itemSeries, waiterServiceFees } from '@/lib/services';
import { exportXLSX, seriesToRows, dateStamp } from '@/lib/export';

export default function ReportsScreen({ orders, menu = [], liveKey = 0 }) {
  const [range, setRange]   = useState('30d');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo]     = useState('');
  const [isSmall, setIsSmall] = useState(false);
  const [data, setData]     = useState([]);
  const [topList, setTopList] = useState([]);
  const [itemId, setItemId]   = useState('');
  const [itemData, setItemData] = useState([]);
  const [serviceFees, setServiceFees] = useState([]);

  // Kun (sana) yorliqlari ustma-ust tushmasligi uchun ko'rsatiladigan yorliqlar
  // sonini cheklaymiz: kichik ekranda ~5 ta, kattada ~9 ta yorliq.
  const tickStep = Math.max(0, Math.ceil(data.length / (isSmall ? 5 : 9)) - 1);

  const customRange = !!(dateFrom && dateTo);
  const periodLabel = customRange
    ? `${uzDateShort(dateFrom)} – ${uzDateShort(dateTo)}`
    : `Soʻnggi ${ { '7d': 7, '30d': 30, '90d': 90 }[range] || 30 } kun`;

  useEffect(() => {
    setIsSmall(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    let active = true;
    seriesStats({ range, dateFrom, dateTo })
      .then(d => { if (active) setData(d.map(x => ({ ...x, revenue: Number(x.revenue) || 0, orders: Number(x.orders) || 0, label: uzDateShort(x.date) }))); })
      .catch(() => { if (active) setData([]); });
    topItems({ range, dateFrom, dateTo, limit: 10 })
      .then(t => { if (active) setTopList(t); })
      .catch(() => { if (active) setTopList([]); });
    waiterServiceFees({ range, dateFrom, dateTo })
      .then(rows => { if (active) setServiceFees(rows); })
      .catch(() => { if (active) setServiceFees([]); });
    return () => { active = false; };
  }, [range, dateFrom, dateTo, liveKey]);

  // Tanlanmagan bo'lsa birinchi taomni standart qilamiz
  useEffect(() => {
    if (!itemId && menu.length) setItemId(String(menu[0].id));
  }, [menu, itemId]);

  // Tanlangan taomning kunlik sotuvi
  useEffect(() => {
    if (!itemId) { setItemData([]); return undefined; }
    let active = true;
    itemSeries({ menuItem: itemId, range, dateFrom, dateTo })
      .then(d => { if (active) setItemData(d.map(x => ({ ...x, label: uzDateShort(x.date) }))); })
      .catch(() => { if (active) setItemData([]); });
    return () => { active = false; };
  }, [itemId, range, dateFrom, dateTo, liveKey]);

  function onRangeChange(v) { setRange(v); setDateFrom(''); setDateTo(''); }
  function clearDates() { setDateFrom(''); setDateTo(''); }

  function exportExcel() {
    exportXLSX(`hisobot-${dateStamp()}.xlsx`, seriesToRows(data), 'Hisobot');
  }

  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrd = data.reduce((s, d) => s + d.orders, 0);
  const avgTicket = totalOrd ? Math.round(totalRev / totalOrd) : 0;
  const totalServiceFee = serviceFees.reduce((s, r) => s + r.serviceFee, 0);

  const tooltipStyle = {
    background: 'white',
    border: '1px solid #dde1e8',
    borderRadius: 10,
    boxShadow: '0 10px 30px -10px rgba(15,23,42,.18)',
    padding: '8px 12px',
    fontSize: 12,
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Hisobotlar"
        subtitle="Tushum, buyurtmalar va eng koʻp sotilgan taomlar"
        actions={<Button variant="outline" icon="Download" onClick={exportExcel} disabled={data.length === 0}>Excel eksport</Button>}
      />

      <div className="lg:hidden mb-4">
        <h1 className="text-xl font-bold text-ink-900">Hisobotlar</h1>
        <p className="text-xs text-ink-500 mt-0.5">{periodLabel}</p>
      </div>

      {/* Davr / sana bo'yicha filter */}
      <Card className="!p-3 sm:!p-4 mb-4 sm:mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[11rem_minmax(0,1fr)_minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-ink-500 mb-1">Davr</div>
            <Select value={customRange ? '' : range} onChange={e => onRangeChange(e.target.value)}
                    placeholder={customRange ? 'Maxsus oraliq' : undefined}
                    options={[
                      { value: '7d', label: 'Soʻnggi 7 kun' },
                      { value: '30d', label: 'Soʻnggi 30 kun' },
                      { value: '90d', label: 'Soʻnggi 90 kun' },
                    ]} className="w-full" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-ink-500 mb-1">Sanadan</div>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} max={dateTo || undefined} className="min-w-0" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-ink-500 mb-1">Sanagacha</div>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} min={dateFrom || undefined} className="min-w-0" />
          </div>
          {(dateFrom || dateTo) && (
            <Button variant="outline" icon="X" onClick={clearDates} className="w-full sm:w-auto">Tozalash</Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Tushum</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#e6f6ec', color: '#1d7a44' }}>
              <Icon name="Wallet" size={16} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {formatUZSShort(totalRev)} <span className="text-xs sm:text-sm text-ink-400 font-medium">soʻm</span>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Buyurtma</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#d7e7f4', color: '#1F4E79' }}>
              <Icon name="Receipt" size={16} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {totalOrd.toLocaleString().replace(/,/g, ' ')}
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Oʻrtacha chek</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#eef5fb', color: '#2E75B6' }}>
              <Icon name="Coins" size={16} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {formatUZSShort(avgTicket)} <span className="text-xs sm:text-sm text-ink-400 font-medium">soʻm</span>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Tayyorlanmoqda</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#fdf1de', color: '#8a5a07' }}>
              <Icon name="Clock" size={16} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {orders.filter(o => o.status === 'preparing').length}
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Xizmat haqi</div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#fff7ed', color: '#b45309' }}>
              <Icon name="HandCoins" size={16} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {formatUZSShort(totalServiceFee)} <span className="text-xs sm:text-sm text-ink-400 font-medium">soʻm</span>
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div>
            <h3 className="font-semibold text-ink-900">Tushum</h3>
            <p className="text-xs text-ink-500 mt-0.5">{periodLabel} · soʻm</p>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-navy-700" />
              <span className="text-ink-600">Tushum</span>
            </div>
          </div>
        </div>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-ink-400" style={{ height: isSmall ? 200 : 280 }}>
            <Icon name="LineChart" size={28} />
            <div className="text-sm mt-2">Bu davr uchun maʼlumot yoʻq</div>
          </div>
        ) : (
        <div style={{ width: '100%', height: isSmall ? 200 : 280 }}>
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 16, right: 6, bottom: 4, left: -12 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1F4E79" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#1F4E79" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 4" stroke="#eef0f4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} interval={tickStep} tickMargin={6} />
              <YAxis tickFormatter={v => formatUZSShort(v)} tick={{ fontSize: 9, fill: '#8a93a3' }} axisLine={false} tickLine={false} width={isSmall ? 62 : 78} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: '#5b6473', fontSize: 11, marginBottom: 4 }}
                formatter={(v) => [formatUZS(v), 'Tushum']}
                cursor={{ stroke: '#bcd0e4', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#1F4E79" strokeWidth={2.25} fill="url(#revGrad)" dot={false}
                    activeDot={{ r: 5, fill: '#1F4E79', strokeWidth: 2, stroke: '#fff' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </Card>

      <Card padding={false} className="mb-4">
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-ink-100">
          <h3 className="font-semibold text-ink-900">Ofitsiantlar xizmat haqi</h3>
          <p className="text-xs text-ink-500 mt-0.5">{periodLabel} · yopilgan buyurtmalar bo'yicha</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/40">
                <th className="font-semibold px-4 sm:px-5 py-2.5">Sana</th>
                <th className="font-semibold px-3 py-2.5">Xodim</th>
                <th className="font-semibold px-3 py-2.5 text-right">Buyurtma</th>
                <th className="font-semibold px-4 sm:px-5 py-2.5 text-right">Xizmat haqi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {serviceFees.length === 0 ? (
                <EmptyRow colSpan={4} icon="HandCoins" text="Bu davr uchun xizmat haqi yo'q" />
              ) : serviceFees.map((row, i) => (
                <tr key={`${row.date}-${row.waiterId}-${i}`} className="hover:bg-ink-50/60">
                  <td className="px-4 sm:px-5 py-2.5 text-ink-600 text-xs sm:text-sm">{uzDateShort(row.date)}</td>
                  <td className="px-3 py-2.5 text-ink-800 font-medium text-xs sm:text-sm">{row.waiterName}</td>
                  <td className="px-3 py-2.5 text-right num text-ink-700 text-xs sm:text-sm">{row.orders}</td>
                  <td className="px-4 sm:px-5 py-2.5 text-right num font-semibold text-ink-900 text-xs sm:text-sm">{formatUZSShort(row.serviceFee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-ink-900">Kunlik buyurtmalar</h3>
              <p className="text-xs text-ink-500 mt-0.5">{periodLabel}</p>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-accent" />
                <span className="text-ink-600">Buyurtma</span>
              </div>
            </div>
          </div>
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-ink-400" style={{ height: isSmall ? 200 : 280 }}>
              <Icon name="BarChart3" size={28} />
              <div className="text-sm mt-2">Bu davr uchun maʼlumot yoʻq</div>
            </div>
          ) : (
          <div style={{ width: '100%', height: isSmall ? 200 : 280 }}>
            <ResponsiveContainer>
              <BarChart data={data} margin={{ top: 16, right: 6, bottom: 4, left: -16 }}>
                <CartesianGrid strokeDasharray="3 4" stroke="#eef0f4" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} interval={tickStep} tickMargin={6} />
                <YAxis tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#eef5fb' }}
                         labelStyle={{ color: '#5b6473', fontSize: 11, marginBottom: 4 }}
                         formatter={(v) => [v, 'Buyurtma']} />
                <Bar dataKey="orders" fill="#2E75B6" radius={[4, 4, 0, 0]} maxBarSize={isSmall ? 10 : 18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          )}
        </Card>

        <Card padding={false} className="xl:col-span-2">
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-ink-100 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-ink-900">Top 10 taom</h3>
              <p className="text-xs text-ink-500 mt-0.5">Sotilgan miqdor boʻyicha</p>
            </div>
            <button className="text-xs text-accent font-medium hover:underline">Barchasi</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/40">
                <th className="font-semibold px-4 sm:px-5 py-2">№</th>
                <th className="font-semibold px-2 py-2">Taom</th>
                <th className="font-semibold px-2 py-2 text-right">Soni</th>
                <th className="font-semibold px-4 sm:px-5 py-2 text-right">Tushum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {topList.length === 0 ? (
                <EmptyRow colSpan={4} icon="UtensilsCrossed" text="Hali sotilgan taom yoʻq" />
              ) : topList.map((it, i) => (
                <tr key={it.menuId} className="hover:bg-ink-50/60">
                  <td className="px-4 sm:px-5 py-2.5">
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold ${
                      i < 3 ? 'bg-navy-700 text-white' : 'bg-ink-100 text-ink-600'
                    }`}>{i + 1}</span>
                  </td>
                  <td className="px-2 py-2.5 text-ink-800 font-medium text-xs sm:text-sm">{it.name}</td>
                  <td className="px-2 py-2.5 text-right num text-ink-700 text-xs sm:text-sm">{it.qty}</td>
                  <td className="px-4 sm:px-5 py-2.5 text-right num font-semibold text-ink-900 text-xs sm:text-sm">{formatUZSShort(it.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Bitta taomning kunlik sotuvi */}
      <Card className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
          <div>
            <h3 className="font-semibold text-ink-900">Taom boʻyicha kunlik sotuv</h3>
            <p className="text-xs text-ink-500 mt-0.5">{periodLabel} · jami {itemData.reduce((s, d) => s + d.qty, 0)} dona</p>
          </div>
          <Select value={itemId} onChange={e => setItemId(e.target.value)}
                  placeholder={menu.length ? undefined : 'Taom yoʻq'}
                  options={menu.map(m => ({ value: String(m.id), label: m.name }))}
                  className="w-full sm:w-56" />
        </div>
        {itemData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-ink-400" style={{ height: isSmall ? 200 : 280 }}>
            <Icon name="BarChart3" size={28} />
            <div className="text-sm mt-2">Bu davr uchun maʼlumot yoʻq</div>
          </div>
        ) : (
        <div style={{ width: '100%', height: isSmall ? 200 : 280 }}>
          <ResponsiveContainer>
            <BarChart data={itemData} margin={{ top: 16, right: 6, bottom: 4, left: -16 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#eef0f4" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} interval={tickStep} tickMargin={6} />
              <YAxis tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} width={36} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: '#eef5fb' }}
                       labelStyle={{ color: '#5b6473', fontSize: 11, marginBottom: 4 }}
                       formatter={(v) => [v, 'dona']} />
              <Bar dataKey="qty" fill="#1F4E79" radius={[4, 4, 0, 0]} maxBarSize={isSmall ? 12 : 22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        )}
      </Card>
    </div>
  );
}
