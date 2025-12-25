
import React, { useState } from 'react';
import { Degree, FounderProfile, Theme, Difficulty } from '../types';

interface Props {
  onComplete: (profile: FounderProfile) => void;
  isLoading: boolean;
}

const CharacterCreation: React.FC<Props> = ({ onComplete, isLoading }) => {
  const [profile, setProfile] = useState<FounderProfile>({
    name: '',
    degree: Degree.BACHELORS,
    background: '',
    specialty: '',
    theme: 'light',
    difficulty: 'bootstrapper'
  });

  const handleRoll = () => {
    const names = ["Aria Vance", "Kaelen Moss", "Zoe Chen", "Julian Thorne"];
    const backgrounds = ["Fusion Energy", "Spatial Computing", "Bio-Synthetic Labs", "Autonomous Logistics"];
    const specialties = ["Algorithmic Strategy", "Full-Stack Dev", "Industrial Design", "Growth Ops"];
    setProfile(prev => ({
      ...prev,
      name: names[Math.floor(Math.random() * names.length)],
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)],
      specialty: specialties[Math.floor(Math.random() * specialties.length)],
    }));
  };

  return (
    <div className="max-w-2xl w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 rounded-t-3xl"></div>
      
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">The Launchpad</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Define your trajectory.</p>
        </div>
        <button onClick={handleRoll} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all text-xl">🎲</button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-sky-500"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Education</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-sky-500"
              value={profile.degree}
              onChange={e => setProfile({...profile, degree: e.target.value as Degree})}
            >
              {Object.values(Degree).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Domain Experience</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-sky-500"
              placeholder="e.g. Bio-Tech"
              value={profile.background}
              onChange={e => setProfile({...profile, background: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Core Competency</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 focus:ring-2 ring-sky-500"
              placeholder="e.g. Sales"
              value={profile.specialty}
              onChange={e => setProfile({...profile, specialty: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Ambience (Theme)</label>
            <div className="flex gap-2">
              {(['light', 'dark', 'neon'] as Theme[]).map(t => (
                <button
                  key={t}
                  onClick={() => setProfile({...profile, theme: t})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all ${profile.theme === t ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600' : 'border-slate-100 dark:border-slate-800'}`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Stakeholder Stakes (Difficulty)</label>
            <div className="flex gap-2">
              {(['bootstrapper', 'venture-scale'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setProfile({...profile, difficulty: d})}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg border-2 transition-all ${profile.difficulty === d ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-600' : 'border-slate-100 dark:border-slate-800'}`}
                >
                  {d.replace('-', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onComplete(profile)}
          disabled={!profile.name || isLoading}
          className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xl rounded-2xl shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50"
        >
          {isLoading ? "CALCULATING VECTORS..." : "IGNITE ENGINE"}
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
