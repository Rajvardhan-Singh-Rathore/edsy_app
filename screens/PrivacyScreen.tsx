
import React from 'react';
import { Screen } from '../types';

interface Props {
  onNavigate?: (screen: Screen) => void;
}

const PrivacyScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate ? onNavigate('HOME') : window.history.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="text-[10px] tracking-widest font-bold opacity-60 uppercase">.edsy</div>
          <div className="w-10"></div>
        </div>
        <h1 className="text-5xl font-light leading-tight tracking-tight mb-2">
          Privacy <br/>
          <span className="font-medium">Policy</span>
        </h1>
        <p className="text-slate-400 text-sm mt-4">Your privacy matters to us.</p>
      </header>

      <main className="flex-1 px-6 pt-8">
        <div className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-8">
          <p className="text-slate-300 leading-relaxed mb-8">
            We value your trust. However, please be informed that we will not be responsible for anything related to your use of this platform or any data shared.
          </p>
          
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Disclaimer</h3>
            <p className="text-sm text-slate-400">
              By using our services, you agree that we are not liable for any issues, data breaches, or damages that may occur.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-background-dark/80 backdrop-blur-md absolute bottom-0 left-0 right-0 border-t border-white/5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">© 2026 EDY LEARNING</p>
      </footer>
    </div>
  );
};

export default PrivacyScreen;
