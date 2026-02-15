
import React, { useState } from 'react';
import { Screen, UserProfile } from '../types';
import { auth, signOut } from '../lib/firebase';
import Navbar from '../components/Navbar';

interface Props {
  onNavigate: (screen: Screen) => void;
  user: UserProfile | null;
}

const ProfileScreen: React.FC<Props> = ({ onNavigate, user }) => {
  const [showSettings, setShowSettings] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    onNavigate('LOGIN');
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center relative">
        <button 
          onClick={() => onNavigate('HOME')}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <span className="font-medium text-sm tracking-tight">.edsy</span>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 active:bg-zinc-900 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {showSettings && (
          <div className="absolute top-24 right-6 w-48 bg-zinc-900 border border-zinc-800 rounded-3xl p-2 shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </header>

      <div className="px-6 mb-8 text-center flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary p-1 bg-background-dark">
            <img 
              alt="User avatar" 
              className="w-full h-full object-cover rounded-full" 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`} 
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary text-black w-8 h-8 rounded-full flex items-center justify-center border-4 border-background-dark shadow-lg">
            <span className="material-symbols-outlined text-sm font-bold">verified</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-3xl font-light tracking-tight truncate max-w-[200px]">{user?.email.split('@')[0]}</h1>
          {user?.isPro && (
            <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-primary/30">
              PRO
            </span>
          )}
        </div>
        <p className="text-zinc-500 text-sm">{user?.email}</p>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-40 no-scrollbar">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Learning Analytics</h2>
        
        <div className="bg-zinc-900 rounded-[32px] p-8 flex items-center gap-6 mb-4 ring-1 ring-white/5 shadow-xl">
          <div className="relative w-28 h-28 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(#E2F163 ${Math.min(((user?.points || 0) % 1000) / 10, 100)}%, #2A2A2A 0)` }}>
            <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center flex-col">
              <span className="text-2xl font-semibold">{user?.points || 0}</span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500">Points</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-lg font-light leading-tight mb-2">You've reached <br/><span className="text-primary font-bold tracking-tight">Tier {Math.floor((user?.points || 0)/1000) + 1}</span></p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Pro Level Achieved</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => onNavigate('COMPLETED_COURSES')}
            className="bg-zinc-900 p-6 rounded-[32px] flex flex-col justify-between h-36 ring-1 ring-white/5 cursor-pointer hover:bg-zinc-800 transition-all active:scale-95 group shadow-lg"
          >
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">auto_stories</span>
            <div>
              <p className="text-3xl font-bold tracking-tighter">{user?.coursesCompleted || 0}</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Completed</p>
            </div>
          </div>
          <div className="bg-zinc-900 p-6 rounded-[32px] flex flex-col justify-between h-36 ring-1 ring-white/5 shadow-lg">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <div>
              <p className="text-3xl font-bold tracking-tighter">{user?.hoursSpent || 0}h</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Time Spent</p>
            </div>
          </div>
        </div>
      </div>

      <Navbar active="PROFILE" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfileScreen;
