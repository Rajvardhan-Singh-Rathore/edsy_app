
import React from 'react';
import { Screen } from '../types';
import { INSTRUCTORS, ALL_COURSES } from '../constants';
import Navbar from '../components/Navbar';

interface Props {
  onNavigate: (screen: Screen) => void;
  onSelectCourse: (id: string, instructorId?: string) => void;
  selectedCourseId: string;
}

const InstructorScreen: React.FC<Props> = ({ onNavigate, onSelectCourse, selectedCourseId }) => {
  const [selectedInstructorId, setSelectedInstructorId] = React.useState(INSTRUCTORS[0].id);

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('HOME')}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <div className="text-[10px] tracking-widest font-bold opacity-60 uppercase">.edsy</div>
          <div className="w-10"></div>
        </div>
        <h1 className="text-5xl font-light leading-tight tracking-tight mb-2">
          Choose Your <br/>
          <span className="font-medium">Instructor</span>
        </h1>
        <p className="text-slate-400 text-sm mt-4">Top specialists for Specialized Learning</p>
      </header>

      <section className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar space-y-6 pt-4">
        {INSTRUCTORS.map((instructor) => {
          const isSelected = selectedInstructorId === instructor.id;
          return (
            <div 
              key={instructor.id}
              onClick={() => setSelectedInstructorId(instructor.id)}
              className={`group relative rounded-[32px] overflow-hidden border border-transparent transition-all duration-300 cursor-pointer ${isSelected ? 'bg-primary' : 'bg-zinc-900/50 hover:border-primary/40'}`}
            >
              <div className="p-6">
                <div className="flex gap-5">
                  <div className="relative w-28 h-36 shrink-0 rounded-2xl overflow-hidden shadow-2xl">
                     <img 
                      alt={instructor.name} 
                      className={`w-full h-full object-cover ${isSelected ? '' : 'grayscale group-hover:grayscale-0 transition-all duration-700'}`} 
                      src={instructor.image} 
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div>
                      <h3 className={`text-xl font-bold leading-tight ${isSelected ? 'text-black' : 'text-white'}`}>{instructor.name}</h3>
                      <p className={`text-[10px] mt-1 font-semibold uppercase tracking-wider ${isSelected ? 'text-black/60' : 'text-slate-500'}`}>{instructor.role}</p>
                    </div>
                    <div className="mt-4">
                      <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-black/50' : 'text-slate-500'}`}>Verified Mentor</span>
                    </div>
                  </div>
                </div>
                <p className={`mt-5 text-xs line-clamp-2 leading-relaxed ${isSelected ? 'text-black/80 font-medium' : 'text-slate-400'}`}>
                  {instructor.bio}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div className={`${isSelected ? 'text-black/60' : 'text-slate-500'} text-[10px] font-bold uppercase tracking-widest`}>
                    {instructor.students} Learners
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // CRITICAL: We MUST pass the courseId that was selected in the HOME screen
                      // If this is the DSA Mastery path, we must pass 'c2'
                      // If this is the Web Development path, we must pass 'c1'
                      onSelectCourse(selectedCourseId, instructor.id);
                    }}
                    className={`px-8 py-3 font-bold rounded-2xl text-xs hover:scale-105 transition-all active:scale-95 shadow-lg ${isSelected ? 'bg-black text-white shadow-black/20' : 'bg-primary text-black shadow-primary/20'}`}
                  >
                    Select
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <Navbar active="EXPLORE" onNavigate={onNavigate} />
    </div>
  );
};

export default InstructorScreen;
