
import React, { useState, useEffect } from 'react';
import { FounderProfile, GamePhase, GameStats, HistoryItem, TurnResponse, StoryChoice, WorldState, Theme } from './types';
import { generateInitialScenario, generateNextTurn } from './services/geminiService';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import StatsPanel from './components/StatsPanel';

const INITIAL_STATS: GameStats = {
  cash: 30000,
  users: 0,
  productQuality: 10,
  marketFit: 5,
  stress: 5,
  valuation: 100000,
  turn: 1,
  burnRate: 2000
};

const INITIAL_WORLD: WorldState = {
  marketCycle: 'Bull',
  trendingTech: ['Sustainable AI', 'Modular Web'],
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.CREATION);
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [world, setWorld] = useState<WorldState>(INITIAL_WORLD);
  const [historyStats, setHistoryStats] = useState<GameStats[]>([INITIAL_STATS]);
  const [currentTurn, setCurrentTurn] = useState<TurnResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.theme) {
      document.body.className = profile.theme;
      if (profile.theme === 'neon') document.documentElement.classList.add('dark');
      else if (profile.theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [profile?.theme]);

  const startGame = async (newProfile: FounderProfile) => {
    setIsLoading(true);
    setProfile(newProfile);
    try {
      const scenario = await generateInitialScenario(newProfile);
      setCurrentTurn(scenario);
      if (scenario.worldUpdate) setWorld(scenario.worldUpdate);
      setPhase(GamePhase.PLAYING);
    } catch (error) {
      console.error(error);
      alert("Sim engine initialization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (action: string, isCustom: boolean) => {
    if (!profile || !currentTurn) return;
    setIsLoading(true);

    const historyItem: HistoryItem = {
      turn: stats.turn,
      narrative: currentTurn.narrative,
      eventSummary: currentTurn.eventSummary,
      statsSnapshot: { ...stats },
      choiceMade: action
    };
    setHistory(prev => [...prev, historyItem]);

    try {
      const nextTurn = await generateNextTurn(profile, stats, action, isCustom, world);
      
      const difficultyMod = profile.difficulty === 'venture-scale' ? 1.5 : 1.0;
      const baseBurn = (stats.turn * 1000) * difficultyMod;

      const newStats: GameStats = {
        turn: stats.turn + 1,
        cash: stats.cash + nextTurn.statChanges.cash - baseBurn,
        users: Math.max(0, stats.users + nextTurn.statChanges.users),
        productQuality: Math.min(100, Math.max(0, stats.productQuality + nextTurn.statChanges.productQuality)),
        marketFit: Math.min(100, Math.max(0, stats.marketFit + nextTurn.statChanges.marketFit)),
        stress: Math.min(100, Math.max(0, stats.stress + nextTurn.statChanges.stress)),
        valuation: Math.max(0, stats.valuation + nextTurn.statChanges.valuation),
        burnRate: baseBurn
      };

      setStats(newStats);
      setHistoryStats(prev => [...prev, newStats]);
      setCurrentTurn(nextTurn);
      if (nextTurn.worldUpdate) setWorld(nextTurn.worldUpdate);

      if (nextTurn.isGameOver || newStats.cash < -50000 || newStats.stress >= 100) {
        setPhase(GamePhase.GAME_OVER);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen w-full flex flex-col md:flex-row transition-colors duration-500 ${profile?.theme === 'neon' ? 'dark bg-slate-950 text-pink-400' : ''}`}>
      {phase === GamePhase.CREATION && (
        <div className="w-full h-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
           <CharacterCreation onComplete={startGame} isLoading={isLoading} />
        </div>
      )}

      {phase === GamePhase.PLAYING && currentTurn && profile && (
        <>
          <StatsPanel stats={stats} historyStats={historyStats} world={world} theme={profile.theme} />
          <GameScreen 
            history={history} 
            currentTurn={currentTurn} 
            onMakeChoice={handleChoice} 
            isLoading={isLoading} 
            theme={profile.theme}
          />
        </>
      )}

      {phase === GamePhase.GAME_OVER && (
        <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-950">
          <h1 className="text-6xl font-black mb-4 tracking-tighter uppercase">Simulation Terminated</h1>
          <p className="text-xl opacity-60 max-w-xl mb-12">
            {currentTurn?.gameOverReason || "The market was more ruthless than your vision today."}
          </p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg mb-12">
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl">
               <p className="text-xs font-bold text-slate-400 mb-1">FINAL VALUATION</p>
               <p className="text-3xl font-black text-sky-500">${stats.valuation.toLocaleString()}</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl">
               <p className="text-xs font-bold text-slate-400 mb-1">USER SCALE</p>
               <p className="text-3xl font-black text-emerald-500">{stats.users.toLocaleString()}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:scale-105 transition-all">REBOOT SYSTEM</button>
        </div>
      )}
    </div>
  );
};

export default App;
