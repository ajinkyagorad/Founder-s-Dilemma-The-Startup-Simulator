import React, { useEffect, useRef } from 'react';
import { HistoryItem, StoryChoice, TurnResponse } from '../types';

interface Props {
  history: HistoryItem[];
  currentTurn: TurnResponse;
  onMakeChoice: (choice: StoryChoice) => void;
  isLoading: boolean;
}

const GameScreen: React.FC<Props> = ({ history, currentTurn, onMakeChoice, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, currentTurn]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 relative">
      {/* Story Log Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scroll-smooth"
      >
        {history.map((item, idx) => (
          <div key={idx} className="animate-fade-in opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-slate-500">TURN {item.turn}</span>
              <span className="h-px bg-slate-800 flex-1"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.eventSummary}</span>
            </div>
            <div className="prose prose-invert prose-p:text-slate-300 max-w-none">
              <p className="leading-relaxed text-lg whitespace-pre-wrap">{item.narrative}</p>
            </div>
          </div>
        ))}

        {/* Current Turn Narrative */}
        <div className="animate-slide-up">
           <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-mono text-blue-500">CURRENT</span>
              <span className="h-px bg-blue-500/30 flex-1"></span>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider animate-pulse">{currentTurn.eventSummary}</span>
            </div>
            <div className="prose prose-invert prose-p:text-white max-w-none">
              <p className="leading-relaxed text-xl whitespace-pre-wrap drop-shadow-lg">{currentTurn.narrative}</p>
            </div>
            
            {/* Feedback from previous turn */}
            {currentTurn.feedback && (
              <div className="mt-4 p-3 bg-blue-900/20 border-l-4 border-blue-500 text-blue-200 text-sm italic">
                AI Insight: "{currentTurn.feedback}"
              </div>
            )}
        </div>
        
        {/* Spacer for bottom choices */}
        <div className="h-48"></div> 
      </div>

      {/* Choice Area (Sticky Bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-950 via-slate-950 to-transparent p-4 md:p-8 pb-8 pt-20">
        {isLoading ? (
           <div className="flex flex-col items-center justify-center gap-3 py-8">
             <div className="flex gap-2">
               <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
               <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
             </div>
             <p className="text-slate-400 font-mono text-sm">Simulating consequences...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {currentTurn.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => onMakeChoice(choice)}
                className={`
                  relative group overflow-hidden p-4 rounded-xl border text-left transition-all
                  hover:-translate-y-1 active:translate-y-0
                  ${choice.type === 'risky' ? 'bg-red-950/30 border-red-900/50 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 
                    choice.type === 'innovative' ? 'bg-indigo-950/30 border-indigo-900/50 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]' :
                    choice.type === 'expensive' ? 'bg-amber-950/30 border-amber-900/50 hover:border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]' :
                    'bg-slate-900/80 border-slate-700 hover:border-slate-400 hover:bg-slate-800'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`
                    text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded
                    ${choice.type === 'risky' ? 'bg-red-500/20 text-red-400' : 
                      choice.type === 'innovative' ? 'bg-indigo-500/20 text-indigo-400' :
                      choice.type === 'expensive' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-slate-500/20 text-slate-400'
                    }
                  `}>
                    {choice.type}
                  </span>
                </div>
                <p className="text-slate-200 font-medium leading-snug group-hover:text-white">{choice.text}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;
