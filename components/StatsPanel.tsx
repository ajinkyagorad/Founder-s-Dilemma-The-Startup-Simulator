import React from 'react';
import { GameStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsPanelProps {
  stats: GameStats;
  historyStats: GameStats[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, historyStats }) => {
  const formatMoney = (val: number) => {
    if (Math.abs(val) >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (Math.abs(val) >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const data = historyStats.map((s, i) => ({
    name: `Turn ${i}`,
    cash: s.cash,
    users: s.users,
    valuation: s.valuation
  }));

  // Progress bars helper
  const ProgressBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1 text-slate-400">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${color}`} 
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 border-l border-slate-800 h-full flex flex-col p-4 w-full md:w-80 shrink-0 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-2">Company Metrics</h2>

      <div className="grid grid-cols-2 md:grid-cols-1 gap-4 mb-6">
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 uppercase">Cash on Hand</p>
          <p className={`text-xl font-mono font-bold ${stats.cash < 5000 ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`}>
            {formatMoney(stats.cash)}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 uppercase">Valuation</p>
          <p className="text-xl font-mono font-bold text-blue-400">
            {formatMoney(stats.valuation)}
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 col-span-2 md:col-span-1">
          <p className="text-xs text-slate-400 uppercase">Active Users</p>
          <p className="text-xl font-mono font-bold text-white">
            {stats.users.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <ProgressBar label="Product Quality" value={stats.productQuality} color="bg-indigo-500" />
        <ProgressBar label="Market Hype" value={stats.hype} color="bg-amber-500" />
        <ProgressBar label="Founder Stress" value={stats.stress} color="bg-rose-600" />
      </div>

      <div className="flex-1 min-h-[200px] flex flex-col">
        <p className="text-xs text-slate-400 mb-2 uppercase">Growth Trajectory</p>
        <div className="flex-1 w-full bg-slate-800/50 rounded border border-slate-700 p-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ display: 'none' }}
                formatter={(value: number) => [formatMoney(value), 'Valuation']}
              />
              <Area type="monotone" dataKey="valuation" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
