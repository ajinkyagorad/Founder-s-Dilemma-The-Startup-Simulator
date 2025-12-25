
import React from 'react';
import { GameStats, WorldState, Theme } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

interface StatsPanelProps {
  stats: GameStats;
  historyStats: GameStats[];
  world: WorldState;
  theme: Theme;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats, historyStats, world, theme }) => {
  const isDark = theme === 'dark' || theme === 'neon';
  
  const formatMoney = (val: number) => {
    const absVal = Math.abs(val);
    if (absVal >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (absVal >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const getTrend = (key: keyof GameStats) => {
    if (historyStats.length < 2) return null;
    const current = stats[key] as number;
    const previous = historyStats[historyStats.length - 2][key] as number;
    const diff = current - previous;
    if (diff === 0) return null;
    return {
      value: diff,
      formatted: key === 'cash' || key === 'valuation' ? formatMoney(diff) : diff.toLocaleString(),
      isPositive: diff > 0
    };
  };

  const StatBox = ({ label, value, keyName, icon, colorClass }: { label: string; value: string; keyName: keyof GameStats; icon: string; colorClass: string }) => {
    const trend = getTrend(keyName);
    return (
      <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          {trend && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${trend.isPositive ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.formatted.replace('-', '')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <p className={`text-2xl font-black ${colorClass}`}>{value}</p>
        </div>
      </div>
    );
  };

  const data = historyStats.map((s, i) => ({ name: i, val: s.valuation }));

  return (
    <div className={`h-full flex flex-col p-6 w-full md:w-80 border-r ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
      <div className="mb-8">
        <h2 className="text-2xl font-black tracking-tighter">Venture OS</h2>
        <div className="mt-2 flex items-center gap-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${world.marketCycle === 'Bull' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
             {world.marketCycle} Market
           </span>
           <span className="text-slate-400 text-[10px] font-bold uppercase">Turn {stats.turn}</span>
        </div>
      </div>

      <div className="space-y-3 mb-8">
        <StatBox label="Dry Powder" value={formatMoney(stats.cash)} keyName="cash" icon="💰" colorClass={stats.cash < 5000 ? 'text-rose-500' : 'text-emerald-500'} />
        <StatBox label="Pre-Money" value={formatMoney(stats.valuation)} keyName="valuation" icon="💎" colorClass="text-sky-500" />
        <StatBox label="Total Users" value={stats.users.toLocaleString()} keyName="users" icon="👥" colorClass="text-slate-500 dark:text-slate-300" />
      </div>

      <div className="flex-1 flex flex-col min-h-[120px]">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Equity Trajectory</p>
        <div className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area type="monotone" dataKey="val" stroke={theme === 'neon' ? '#f472b6' : '#0ea5e9'} fill={theme === 'neon' ? '#f472b644' : '#0ea5e944'} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`mt-8 p-4 rounded-2xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Market Intel</p>
        <div className="flex flex-wrap gap-1.5">
          {world.trendingTech.map(t => (
            <span key={t} className="px-2 py-1 bg-white dark:bg-slate-700 rounded-lg text-[10px] font-bold shadow-sm">#{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
