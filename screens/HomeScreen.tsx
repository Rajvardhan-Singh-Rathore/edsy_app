
import React, { useState, useEffect } from 'react';
import { Screen, Lesson, UserProfile } from '../types';
import { CATEGORIES, ALL_COURSES } from '../constants';
import Navbar from '../components/Navbar';

interface Props {
  user: UserProfile | null;
  onNavigate: (screen: Screen) => void;
  onSelectCourse: (id: string) => void;
  lastVideo: Lesson | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const HomeScreen: React.FC<Props> = ({ user, onNavigate, onSelectCourse, lastVideo, searchQuery, setSearchQuery }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredCategories = CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = user?.email.toLowerCase() === 'forfarzivada@gmail.com';
  const isPro = user?.isPro === true;

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("App is already installed or your browser doesn't support installation.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="w-[85%] h-full bg-zinc-950 border-r border-white/10 p-8 animate-in slide-in-from-left duration-300 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-12">
              <span className="text-xl font-bold tracking-tighter">.edsy</span>
              <button onClick={() => setIsSidebarOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6">Explore Courses</h3>
            <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
              {ALL_COURSES.map(course => (
                <div 
                  key={course.id}
                  onClick={() => { onSelectCourse(course.id, course.instructorId); setIsSidebarOpen(false); }}
                  className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="overflow-hidden">
                    <h4 className="text-sm font-medium group-hover:text-primary transition-colors truncate">{course.title}</h4>
                    <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-wider">{course.category}</p>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
                </div>
              ))}
            </div>

            <div className="py-8 space-y-8 border-t border-white/5 mt-6">
              <button 
                onClick={() => {
                  onNavigate('HOME');
                  setIsSidebarOpen(false);
                }} 
                className="flex items-center gap-4 group"
              >
                <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">home</span>
                <span className="text-sm font-medium">Home</span>
              </button>
              <button onClick={() => onNavigate('UPCOMING')} className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">calendar_today</span>
                <span className="text-sm font-medium">Upcoming</span>
              </button>
              <button onClick={() => onNavigate('PROFILE')} className="flex items-center gap-4 group">
                <span className="material-symbols-outlined text-2xl group-hover:text-primary transition-colors">person</span>
                <span className="text-sm font-medium">Account</span>
              </button>
            </div>
            
            <div className="mt-auto pt-6 border-t border-white/5 space-y-3">
              <button 
                onClick={() => {
                  onNavigate('TERMS');
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 group text-zinc-500 hover:text-primary transition-colors py-1"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">description</span>
                <span className="text-xs font-medium">Terms & Conditions</span>
              </button>
              <button 
                onClick={() => {
                  onNavigate('PRIVACY');
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 group text-zinc-500 hover:text-primary transition-colors py-1"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">shield</span>
                <span className="text-xs font-medium">Privacy Policy</span>
              </button>
              <button 
                onClick={() => {
                  onNavigate('REFUND');
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 group text-zinc-500 hover:text-primary transition-colors py-1"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">payments</span>
                <span className="text-xs font-medium">Refund Policy</span>
              </button>
              <button 
                onClick={() => {
                  onNavigate('CONTACT');
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-4 group text-zinc-500 hover:text-primary transition-colors py-1"
              >
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">mail</span>
                <span className="text-xs font-medium">Contact Us</span>
              </button>
            </div>

            {isAdmin && (
              <div className="pt-6 mt-6 border-t border-white/5">
                <button 
                  onClick={() => onNavigate('ADMIN')}
                  className="w-full bg-primary/10 border border-primary/20 text-primary py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm hover:bg-primary/20 transition-all active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Add New Session
                </button>
              </div>
            )}

            <div className="pt-6 mt-4">
              <button 
                onClick={handleInstallClick}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm hover:bg-white/10 transition-all active:scale-[0.98]"
              >
                <span className="material-symbols-outlined">download_for_offline</span>
                Install Edsy App
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="px-6 pt-12 pb-2">
        <div className="flex justify-between items-center mb-10">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-12 h-12 flex flex-col justify-center items-start gap-[6px] transition-transform active:scale-90"
          >
            <div className="w-8 h-[2px] bg-white rounded-full"></div>
            <div className="w-5 h-[2px] bg-white rounded-full"></div>
          </button>
          <span className="font-medium text-lg tracking-tight">.edsy</span>
        </div>
        
        <h1 className="text-5xl font-light tracking-tight leading-tight mb-8">
          Choose<br/>
          your path
        </h1>

        <div className="flex items-center mb-8 h-14 w-full">
          <div className="flex-grow flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl px-5 h-full transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-zinc-800/50 group">
            <span className="material-symbols-outlined text-zinc-500 mr-3 text-xl group-focus-within:text-primary transition-colors">search</span>
            <input 
              placeholder="Search specialized courses..."
              className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 placeholder:text-zinc-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="ml-2">
                <span className="material-symbols-outlined text-sm opacity-50 hover:opacity-100">close</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-grow px-6 pb-40 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id}
              onClick={() => {
                if (cat.isUpcoming) {
                  onNavigate('UPCOMING');
                } else if (cat.name === 'DSA Mastery' || cat.domain === 'Algorithms') {
                  // Pass 'c2' explicitly for DSA
                  onSelectCourse('c2');
                  onNavigate('INSTRUCTORS');
                } else if (cat.name === 'Web Development' || cat.domain === 'Fullstack') {
                  // Pass 'c1' explicitly for Web Dev
                  onSelectCourse('c1');
                  onNavigate('INSTRUCTORS');
                } else {
                  // Find the first course for this category to get a default instructor
                  const courseForCat = ALL_COURSES.find(c => 
                    c.category.toLowerCase() === cat.domain.toLowerCase() || 
                    c.category.toLowerCase() === cat.name.toLowerCase()
                  );
                  if (courseForCat) {
                    onSelectCourse(courseForCat.id, courseForCat.instructorId);
                  } else {
                    onNavigate('INSTRUCTORS');
                  }
                }
              }}
              className={`${cat.color} bg-opacity-10 rounded-[32px] p-5 flex flex-col justify-between aspect-[4/5] cursor-pointer hover:scale-[0.98] transition-all border border-white/5 active:bg-opacity-20`}
            >
              <div className="flex justify-between items-start">
                <span className={`material-symbols-outlined text-2xl text-white`}>{cat.icon}</span>
                <span className="material-symbols-outlined text-lg opacity-40">north_east</span>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-widest opacity-60 mb-1">{cat.domain}</p>
                <h3 className="text-xl font-medium leading-snug text-white">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {lastVideo && (
          <div className="mt-10 mb-6">
            <h4 className="text-xs font-medium opacity-50 uppercase tracking-widest mb-4">Resume Learning</h4>
            <div 
              onClick={() => {
                if ((lastVideo as any).courseId) {
                  onSelectCourse((lastVideo as any).courseId, (lastVideo as any).instructorId);
                } else {
                  onNavigate('COURSE');
                }
              }}
              className="bg-zinc-900 rounded-[32px] p-6 border border-zinc-800/50 cursor-pointer hover:bg-zinc-800 transition-colors flex items-center gap-4 shadow-xl"
            >
              <div className="w-16 aspect-video rounded-xl bg-zinc-800 overflow-hidden shrink-0">
                <img src={lastVideo.thumbnail} className="w-full h-full object-cover opacity-70" />
              </div>
              <div className="flex-1 overflow-hidden">
                <h5 className="font-medium text-sm truncate">{lastVideo.title}</h5>
                <p className="text-[10px] opacity-60">Continue watching</p>
              </div>
              <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
            </div>
          </div>
        )}
      </main>

      <Navbar active="HOME" onNavigate={onNavigate} />
    </div>
  );
};

export default HomeScreen;
