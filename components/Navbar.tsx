
import React from 'react';
import { Screen } from '../types';

interface Props {
  active: 'HOME' | 'EXPLORE' | 'BOOKMARKS' | 'PROFILE';
  onNavigate: (screen: Screen) => void;
}

const Navbar: React.FC<Props> = ({ active, onNavigate }) => {
  return (
    <div className="absolute bottom-6 left-6 right-6 h-20 bg-zinc-900/60 ios-blur border border-white/10 rounded-[32px] flex items-center justify-around px-4 z-50">
      <button 
        onClick={() => onNavigate('HOME')}
        className={`flex flex-col items-center gap-1 ${active === 'HOME' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <span className={`material-symbols-outlined ${active === 'HOME' ? 'fill-current' : ''}`}>home</span>
      </button>
      
      <button 
        onClick={() => onNavigate('INSTRUCTORS')}
        className={`flex flex-col items-center gap-1 ${active === 'EXPLORE' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <span className={`material-symbols-outlined ${active === 'EXPLORE' ? 'fill-current' : ''}`}>explore</span>
      </button>
      
      <button 
        onClick={() => onNavigate('COURSE')}
        className={`flex flex-col items-center gap-1 ${active === 'BOOKMARKS' ? 'text-primary' : 'text-zinc-500'} relative`}
      >
        <span className={`material-symbols-outlined ${active === 'BOOKMARKS' ? 'fill-current' : ''}`}>menu_book</span>
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
      </button>
      
      <button 
        onClick={() => onNavigate('PROFILE')}
        className={`flex flex-col items-center gap-1 ${active === 'PROFILE' ? 'text-primary' : 'text-zinc-500'}`}
      >
        <span className={`material-symbols-outlined ${active === 'PROFILE' ? 'fill-current' : ''}`}>person</span>
      </button>
    </div>
  );
};

export default Navbar;
