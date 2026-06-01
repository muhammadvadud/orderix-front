'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Icon } from '../Icon';
import { Card, Button, Select, Trend, PageHeader, EmptyRow } from '../ui';
import { topItemsFromOrders, formatUZS, formatUZSShort } from '@/lib/data';
import { seriesStats } from '@/lib/services';

export default function ReportsScreen({ orders, liveKey = 0 }) {
  const [range, setRange]   = useState('30d');
  const [isSmall, setIsSmall] = useState(false);
  const [data, setData]     = useState([]);

  useEffect(() => {
    setIsSmall(window.innerWidth < 640);
  }, []);

  useEffect(() => {
    let active = true;
    seriesStats(range)
      .then(d => { if (active) setData(d.map(x => ({ ...x, revenue: Number(x.revenue) || 0, orders: Number(x.orders) || 0 }))); })
      .catch(() => { if (active) setData([]); });
    return () => { active = false; };
  }, [range, liveKey]);

  const totalRev = data.reduce((s, d) => s + d.revenue, 0);
  const totalOrd = data.reduce((s, d) => s + d.orders, 0);
  const avgTicket = totalOrd ? Math.round(totalRev / totalOrd) : 0;
  const last7 = data.slice(-7);
  const prev7 = data.slice(-14, -7);
  const wkRev = last7.reduce((s, d) => s + d.revenue, 0);
  const prevWkRev = prev7.reduce((s, d) => s + d.revenue, 0);
  const wkTrend = prevWkRev ? ((wkRev - prevWkRev) / prevWkRev * 100).toFixed(1) : '0';

  const topItems = topItemsFromOrders(orders, 10);

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
        actions={
          <>
            <Select value={range} onChange={e => setRange(e.target.value)}
                    options={[
                      { value: '7d', label: 'Soʻnggi 7 kun' },
                      { value: '30d', label: 'Soʻnggi 30 kun' },
                      { value: '90d', label: 'Soʻnggi 90 kun' },
                    ]} className="w-40" />
            <Button variant="outline" icon="Download">PDF eksport</Button>
          </>
        }
      />

      <div className="md:hidden mb-4 flex items-center gap-2">
        <Select value={range} onChange={e => setRange(e.target.value)}
                options={[
                  { value: '7d', label: '7 kun' },
                  { value: '30d', label: '30 kun' },
                  { value: '90d', label: '90 kun' },
                ]} className="flex-1" />
        <Button variant="outline" icon="Download" size="md">PDF</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Tushum (30 kun)</div>
            <Trend value={+wkTrend} />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {formatUZSShort(totalRev)} <span className="text-xs sm:text-sm text-ink-400 font-medium">soʻm</span>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Buyurtma (30 kun)</div>
            <Trend value={6.3} />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {totalOrd.toLocaleString().replace(/,/g, ' ')}
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Oʻrtacha chek</div>
            <Trend value={2.1} />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {formatUZSShort(avgTicket)} <span className="text-xs sm:text-sm text-ink-400 font-medium">soʻm</span>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-ink-400 font-semibold">Tayyorlanmoqda</div>
            <Trend value={-1.4} />
          </div>
          <div className="mt-2 text-lg sm:text-2xl font-bold num text-ink-900 leading-tight">
            {orders.filter(o => o.status === 'preparing').length}
          </div>
        </Card>
      </div>

      <Card className="mb-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div>
            <h3 className="font-semibold text-ink-900">Tushum</h3>
            <p className="text-xs text-ink-500 mt-0.5">Soʻnggi 30 kun · soʻm</p>
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
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} interval={isSmall ? 5 : 3} />
              <YAxis tickFormatter={v => formatUZSShort(v)} tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} width={50} />
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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-ink-900">Kunlik buyurtmalar</h3>
              <p className="text-xs text-ink-500 mt-0.5">Soʻnggi 30 kun</p>
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
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#8a93a3' }} axisLine={false} tickLine={false} interval={isSmall ? 5 : 3} />
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
              {topItems.length === 0 ? (
                <EmptyRow colSpan={4} icon="UtensilsCrossed" text="Hali sotilgan taom yoʻq" />
              ) : topItems.map((it, i) => (
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
    </div>
  );
}
