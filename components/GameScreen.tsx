
import React, { useState, useRef, useEffect } from 'react';
import { HistoryItem, StoryChoice, TurnResponse, Theme } from '../types';

interface Props {
  history: HistoryItem[];
  currentTurn: TurnResponse;
  onMakeChoice: (choice: string, isCustom: boolean) => void;
  isLoading: boolean;
  theme: Theme;
}

const GameScreen: React.FC<Props> = ({ history, currentTurn, onMakeChoice, isLoading, theme }) => {
  const [customInput, setCustomInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark' || theme === 'neon';

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history, currentTurn]);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim() && !isLoading) {
      onMakeChoice(customInput, true);
      setCustomInput('');
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full relative ${isDark ? 'bg-slate-950 text-white' : 'bg-[#fdfdfd] text-slate-900'}`}>
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 scroll-smooth">
        {history.map((item, idx) => (
          <div key={idx} className="max-w-3xl mx-auto opacity-40 animate-fade-in">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-[10px] font-black font-mono text-slate-400">TURN {item.turn}</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.eventSummary}</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm italic mb-2">You chose: {item.choiceMade}</p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">{item.narrative}</p>
          </div>
        ))}

        <div className="max-w-3xl mx-auto animate-slide-up pb-80">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]"></div>
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em]">Latest Intel</span>
            <div className="h-px bg-sky-100 dark:bg-sky-900/30 flex-1"></div>
          </div>
          
          <div className={`p-8 rounded-3xl shadow-sm border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h3 className="text-2xl font-black mb-4 tracking-tight leading-tight">{currentTurn.eventSummary}</h3>
            <p className="text-lg leading-relaxed opacity-90 whitespace-pre-wrap">{currentTurn.narrative}</p>
          </div>
          
          <div className="mt-6 flex gap-4">
             <div className="flex-1 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-sm">
                <span className="font-bold text-emerald-600 block mb-1">STRATEGIC FEEDBACK</span>
                <span className="italic">"{currentTurn.feedback}"</span>
             </div>
          </div>
        </div>
      </div>

      {/* Control Deck */}
      <div className={`absolute bottom-0 left-0 w-full p-6 md:p-8 border-t backdrop-blur-xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-4xl mx-auto">
          {!isTyping ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {currentTurn.choices.map((c) => (
                  <button
                    key={c.id}
                    disabled={isLoading}
                    onClick={() => onMakeChoice(c.text, false)}
                    className={`flex-1 min-w-[180px] p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 group relative overflow-hidden ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-2xl">{c.icon}</span>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${c.type === 'risky' ? 'text-rose-500' : 'text-sky-500'}`}>{c.type}</span>
                    </div>
                    <p className="font-bold text-sm leading-tight group-hover:text-sky-500 transition-colors">{c.text}</p>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setIsTyping(true)}
                className="w-full py-3 text-slate-400 dark:text-slate-500 text-xs font-bold border border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-sky-500 hover:text-sky-500 transition-all"
              >
                + OR EXECUTE CUSTOM STRATEGY
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="relative animate-slide-up">
              <input 
                autoFocus
                type="text"
                placeholder="Type your strategy (e.g. 'Hire a remote dev from Brazil to save costs')"
                className={`w-full p-5 pr-24 rounded-2xl border-2 focus:ring-0 text-lg font-medium ${isDark ? 'bg-slate-900 border-sky-500 text-white' : 'bg-slate-50 border-sky-500 text-slate-900'}`}
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
              />
              <div className="absolute right-3 top-3 flex gap-2">
                 <button type="button" onClick={() => setIsTyping(false)} className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-rose-500">ESC</button>
                 <button type="submit" className="px-5 py-2 bg-sky-500 text-white rounded-xl font-bold text-xs hover:bg-sky-600 transition-all">EXECUTE</button>
              </div>
            </form>
          )}
          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2">
               <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Simulating Market Vector...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
