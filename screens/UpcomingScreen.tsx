
import React from 'react';
import { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const UpcomingScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <div className="flex justify-between items-center px-8 pt-6">
        <button 
          onClick={() => onNavigate('HOME')}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800"
        >
          <span className="material-symbols-outlined text-slate-400">arrow_back_ios_new</span>
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">rocket_launch</span>
        </div>
        <h2 className="text-3xl font-light mb-4 tracking-tight">No courses yet</h2>
        <p className="text-zinc-500 text-sm leading-relaxed max-w-[280px]">
          We're working with top instructors to bring you high-quality specialized content. Stay tuned!
        </p>
      </div>
      
      <div className="p-8">
        <button 
          onClick={() => onNavigate('HOME')}
          className="w-full py-4 bg-zinc-900 text-white font-medium rounded-2xl border border-zinc-800"
        >
          Return Home
        </button>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
    </div>
  );
};

export default UpcomingScreen;
