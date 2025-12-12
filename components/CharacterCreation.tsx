import React, { useState } from 'react';
import { Degree, FounderProfile } from '../types';

interface Props {
  onComplete: (profile: FounderProfile) => void;
  isLoading: boolean;
}

const CharacterCreation: React.FC<Props> = ({ onComplete, isLoading }) => {
  const [profile, setProfile] = useState<FounderProfile>({
    name: '',
    degree: Degree.BACHELORS,
    background: '',
    specialty: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.background && profile.specialty) {
      onComplete(profile);
    }
  };

  return (
    <div className="max-w-xl w-full mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <h1 className="text-3xl font-bold text-white mb-2">New Founder Profile</h1>
      <p className="text-slate-400 mb-8">Define who you are before you change the world.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            placeholder="e.g. Elon Jobs"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Highest Education</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(Degree).map((deg) => (
              <button
                key={deg}
                type="button"
                onClick={() => setProfile({ ...profile, degree: deg })}
                className={`px-3 py-2 text-sm rounded-md border transition-all ${
                  profile.degree === deg
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {deg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Major / Background</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Comp Sci, Art History"
              value={profile.background}
              onChange={(e) => setProfile({ ...profile, background: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Key Strength</label>
            <input
              type="text"
              required
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Coding, Sales, Vision"
              value={profile.specialty}
              onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 text-lg font-bold rounded-xl transition-all ${
            isLoading
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Initializing Simulation...
            </span>
          ) : (
            "Start Journey"
          )}
        </button>
      </form>
    </div>
  );
};

export default CharacterCreation;
