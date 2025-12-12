import React, { useState } from 'react';
import { FounderProfile, GamePhase, GameStats, HistoryItem, TurnResponse, StoryChoice } from './types';
import { generateInitialScenario, generateNextTurn } from './services/geminiService';
import CharacterCreation from './components/CharacterCreation';
import GameScreen from './components/GameScreen';
import StatsPanel from './components/StatsPanel';

const INITIAL_STATS: GameStats = {
  cash: 10000,
  users: 0,
  productQuality: 10,
  hype: 5,
  stress: 10,
  valuation: 0,
  turn: 1
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.CREATION);
  const [profile, setProfile] = useState<FounderProfile | null>(null);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [historyStats, setHistoryStats] = useState<GameStats[]>([INITIAL_STATS]);
  const [currentTurn, setCurrentTurn] = useState<TurnResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startGame = async (newProfile: FounderProfile) => {
    setIsLoading(true);
    setProfile(newProfile);
    try {
      const scenario = await generateInitialScenario(newProfile);
      setCurrentTurn(scenario);
      setPhase(GamePhase.PLAYING);
    } catch (error) {
      console.error("Failed to start game:", error);
      alert("Failed to initialize simulation. Please check API Key or try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: StoryChoice) => {
    if (!profile || !currentTurn) return;

    setIsLoading(true);

    // 1. Snapshot current state to history
    const historyItem: HistoryItem = {
      turn: stats.turn,
      narrative: currentTurn.narrative,
      eventSummary: currentTurn.eventSummary,
      statsSnapshot: { ...stats }
    };
    setHistory(prev => [...prev, historyItem]);

    // 2. Optimistic Update (Optional) or Wait for Server
    // We wait for server to get the REAL impact because AI decides the random events.

    try {
      // 3. Call AI
      const nextTurn = await generateNextTurn(
        profile,
        stats,
        choice.id,
        history.slice(-3).map(h => h.eventSummary) // send partial history for context
      );

      // 4. Calculate New Stats
      const newStats: GameStats = {
        turn: stats.turn + 1,
        cash: Math.max(0, stats.cash + nextTurn.statChanges.cash),
        users: Math.max(0, stats.users + nextTurn.statChanges.users),
        productQuality: Math.min(100, Math.max(0, stats.productQuality + nextTurn.statChanges.productQuality)),
        hype: Math.min(100, Math.max(0, stats.hype + nextTurn.statChanges.hype)),
        stress: Math.min(100, Math.max(0, stats.stress + nextTurn.statChanges.stress)),
        valuation: Math.max(0, stats.valuation + nextTurn.statChanges.valuation)
      };

      setStats(newStats);
      setHistoryStats(prev => [...prev, newStats]);
      setCurrentTurn(nextTurn);

      // Check Game Over Conditions
      if (nextTurn.isGameOver || newStats.cash <= 0 || newStats.stress >= 100) {
        setPhase(GamePhase.GAME_OVER);
      }

    } catch (error) {
      console.error("Game Loop Error:", error);
      alert("Simulation glitch (API Error). Trying to recover...");
    } finally {
      setIsLoading(false);
    }
  };

  const resetGame = () => {
    setPhase(GamePhase.CREATION);
    setStats(INITIAL_STATS);
    setHistoryStats([INITIAL_STATS]);
    setHistory([]);
    setCurrentTurn(null);
  };

  return (
    <div className="h-screen w-full bg-black text-slate-200 font-sans overflow-hidden flex flex-col md:flex-row">
      
      {phase === GamePhase.CREATION && (
        <div className="w-full h-full flex items-center justify-center p-4 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=5')] bg-cover bg-center">
          <CharacterCreation onComplete={startGame} isLoading={isLoading} />
        </div>
      )}

      {phase === GamePhase.PLAYING && currentTurn && (
        <>
          <StatsPanel stats={stats} historyStats={historyStats} />
          <GameScreen 
            history={history} 
            currentTurn={currentTurn} 
            onMakeChoice={handleChoice}
            isLoading={isLoading}
          />
        </>
      )}

      {phase === GamePhase.GAME_OVER && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/20 p-8 text-center animate-fade-in">
          <h1 className="text-6xl font-black text-red-500 mb-4 tracking-tighter">SIMULATION ENDED</h1>
          <p className="text-2xl text-white mb-8 max-w-2xl">
            {currentTurn?.gameOverReason || (stats.cash <= 0 ? "Bankrupt" : "Burnout")}
          </p>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-8 w-full max-w-md">
            <h3 className="text-lg text-slate-400 mb-4">Final Metrics</h3>
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
              <span>Valuation</span>
              <span className="text-blue-400 font-mono">${stats.valuation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
              <span>Users</span>
              <span className="text-emerald-400 font-mono">{stats.users.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Turns Survived</span>
              <span className="text-white font-mono">{stats.turn}</span>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
          >
            Start New Venture
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
