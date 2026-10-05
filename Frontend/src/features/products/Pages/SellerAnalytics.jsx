import React, { useState } from 'react';
import Navbar from '../../../components/Navbar';

const SellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Revenue chart data points (Monthly progression)
  const monthlyData = [
    { label: 'Jan', revenue: 24000, orders: 180 },
    { label: 'Feb', revenue: 31000, orders: 220 },
    { label: 'Mar', revenue: 28000, orders: 200 },
    { label: 'Apr', revenue: 42000, orders: 290 },
    { label: 'May', revenue: 38000, orders: 260 },
    { label: 'Jun', revenue: 49000, orders: 340 },
    { label: 'Jul', revenue: 48290, orders: 342 },
  ];

  // Weekly performance breakdown
  const weeklyData = [
    { day: 'Mon', value: 42, pct: 40 },
    { day: 'Tue', value: 58, pct: 55 },
    { day: 'Wed', value: 76, pct: 72 },
    { day: 'Thu', value: 65, pct: 62 },
    { day: 'Fri', value: 92, pct: 88 },
    { day: 'Sat', value: 105, pct: 100 },
    { day: 'Sun', value: 84, pct: 80 },
  ];

  // Category distribution
  const categories = [
    { name: 'Linen & Apparel', percentage: 45, revenue: '₹2,17,305.00', color: 'bg-black' },
    { name: 'Leather Accessories', percentage: 30, revenue: '₹1,44,870.00', color: 'bg-neutral-700' },
    { name: 'Footwear & Boots', percentage: 15, revenue: '₹72,435.00', color: 'bg-neutral-400' },
    { name: 'Fragrances & Beauty', percentage: 10, revenue: '₹48,290.00', color: 'bg-neutral-300' },
  ];

  // Top products
  const topProducts = [
    { id: 1, name: 'Relaxed Fit Linen-blend Shirt', sales: 142, revenue: '₹1,13,460.00', conversion: '4.8%' },
    { id: 2, name: 'Minimalist Leather Tote', sales: 98, revenue: '₹1,47,000.00', conversion: '3.9%' },
    { id: 3, name: 'Artisanal Silk Scarf', sales: 64, revenue: '₹31,360.00', conversion: '2.7%' },
    { id: 4, name: 'Cashmere Ribbed Knit', sales: 38, revenue: '₹91,200.00', conversion: '3.2%' },
  ];

  // Max value calculation for smooth SVG scaling
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
  const chartHeight = 160;
  const chartWidth = 600;

  // Compute SVG polyline points for minimal curve
  const points = monthlyData
    .map((d, index) => {
      const x = (index / (monthlyData.length - 1)) * chartWidth;
      const y = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 20);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 antialiased">
      <Navbar />
      
      <div className="px-6 py-10 sm:px-8 lg:px-12 md:ml-64">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">Store Analytics</h1>
              <p className="mt-1.5 text-xs font-light text-gray-500">
                Performance insights, revenue metrics, and customer conversion trends.
              </p>
            </div>

            {/* Time Filter Pills */}
            <div className="flex items-center space-x-1 rounded-xl bg-neutral-100 p-1 border border-neutral-200/60 self-start sm:self-auto">
              {[
                { id: '7d', label: '7 Days' },
                { id: '30d', label: '30 Days' },
                { id: '3m', label: '3 Months' },
                { id: '1y', label: 'Year' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setTimeRange(filter.id)}
                  className={`rounded-lg px-3 py-1.5 text-[11px] font-light uppercase tracking-wider transition-all cursor-pointer ${
                    timeRange === filter.id
                      ? 'bg-white text-black font-normal shadow-sm'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-2 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-light text-gray-400 uppercase tracking-widest">
                <span>Gross Revenue</span>
                <span className="inline-flex items-center text-emerald-600 font-normal text-[10px]">
                  +14.2% ↑
                </span>
              </div>
              <p className="text-3xl font-light tracking-tight text-gray-900">₹4,82,900.00</p>
              <p className="text-[10px] text-gray-400 font-light">+ ₹60,100 vs previous period</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-2 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-light text-gray-400 uppercase tracking-widest">
                <span>Total Orders</span>
                <span className="inline-flex items-center text-emerald-600 font-normal text-[10px]">
                  +8.5% ↑
                </span>
              </div>
              <p className="text-3xl font-light tracking-tight text-gray-900">342</p>
              <p className="text-[10px] text-gray-400 font-light">Avg. 11.4 orders per day</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-2 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-light text-gray-400 uppercase tracking-widest">
                <span>Conversion Rate</span>
                <span className="inline-flex items-center text-emerald-600 font-normal text-[10px]">
                  +0.6% ↑
                </span>
              </div>
              <p className="text-3xl font-light tracking-tight text-gray-900">3.4%</p>
              <p className="text-[10px] text-gray-400 font-light">From 10,050 unique visits</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-neutral-50/50 p-6 space-y-2 hover:bg-neutral-50 transition-colors">
              <div className="flex items-center justify-between text-xs font-light text-gray-400 uppercase tracking-widest">
                <span>Avg. Order Value</span>
                <span className="inline-flex items-center text-emerald-600 font-normal text-[10px]">
                  +3.1% ↑
                </span>
              </div>
              <p className="text-3xl font-light tracking-tight text-gray-900">₹1,412.00</p>
              <p className="text-[10px] text-gray-400 font-light">High tier buyer basket size</p>
            </div>
          </div>

          {/* Revenue Trend Chart & Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Minimal SVG Revenue Line Chart */}
            <div className="lg:col-span-7 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-gray-900">Revenue Growth</h2>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Monthly revenue trajectory</p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-light uppercase tracking-wider text-gray-600">
                  Live Data
                </span>
              </div>

              {/* Minimal SVG Curve */}
              <div className="relative pt-4">
                <svg className="w-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                  {/* Subtle Gridlines */}
                  <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#f3f4f6" strokeDasharray="4" />
                  <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#f3f4f6" strokeDasharray="4" />
                  <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#e5e7eb" />

                  {/* Gradient Area Fill */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
                    fill="url(#chartGradient)"
                  />

                  {/* Minimal Stroke Line */}
                  <polyline
                    fill="none"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points}
                  />

                  {/* Data Points */}
                  {monthlyData.map((d, i) => {
                    const cx = (i / (monthlyData.length - 1)) * chartWidth;
                    const cy = chartHeight - (d.revenue / maxRevenue) * (chartHeight - 20);
                    return (
                      <g key={d.label} className="group cursor-pointer">
                        <circle
                          cx={cx}
                          cy={cy}
                          r="4"
                          className="fill-black stroke-white stroke-2 transition-transform duration-200 group-hover:scale-150"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between text-[11px] font-light text-gray-400 mt-4 border-t border-gray-100 pt-2">
                  {monthlyData.map((d) => (
                    <span key={d.label}>{d.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Revenue Distribution */}
            <div className="lg:col-span-5 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-light text-gray-900">Sales by Category</h2>
                <p className="text-xs text-gray-400 font-light mt-0.5">Product segment revenue share</p>
              </div>

              {/* Progress Bar Visualizers */}
              <div className="space-y-5 pt-2">
                {categories.map((cat) => (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-light">
                      <span className="text-gray-900 font-normal">{cat.name}</span>
                      <span className="text-gray-500">{cat.revenue} ({cat.percentage}%)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${cat.color}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Weekly Activity & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Weekly Bar Chart */}
            <div className="lg:col-span-5 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-light text-gray-900">Weekly Orders</h2>
                <p className="text-xs text-gray-400 font-light mt-0.5">Order distribution across days</p>
              </div>

              {/* Minimal Vertical Bar Chart */}
              <div className="flex items-end justify-between h-40 pt-4 px-2 border-b border-gray-100">
                {weeklyData.map((item) => (
                  <div key={item.day} className="flex flex-col items-center gap-2 group flex-1">
                    <span className="text-[10px] text-gray-400 font-light opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.value}
                    </span>
                    <div className="w-6 sm:w-8 bg-neutral-100 rounded-t-lg overflow-hidden flex items-end h-32">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-300 ${
                          item.day === 'Sat' ? 'bg-black' : 'bg-neutral-800 hover:bg-black'
                        }`}
                        style={{ height: `${item.pct}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-light text-gray-500">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Products */}
            <div className="lg:col-span-7 rounded-[2rem] border border-gray-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-light text-gray-900">Top Performing Products</h2>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Highest volume and revenue listings</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-light">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[10px]">
                      <th className="py-3 px-2">Product</th>
                      <th className="py-3 px-2">Sales</th>
                      <th className="py-3 px-2">Revenue</th>
                      <th className="py-3 px-2 text-right">Conversion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {topProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-2 font-normal text-gray-900">{prod.name}</td>
                        <td className="py-3.5 px-2 text-gray-600">{prod.sales} units</td>
                        <td className="py-3.5 px-2 text-gray-900 font-normal">{prod.revenue}</td>
                        <td className="py-3.5 px-2 text-right">
                          <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200">
                            {prod.conversion}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;
