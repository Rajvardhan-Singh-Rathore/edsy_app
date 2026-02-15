
import React from 'react';
import { Screen, UserProfile } from '../types';
import { ALL_COURSES, INSTRUCTORS } from '../constants';
import Navbar from '../components/Navbar';

interface Props {
  onNavigate: (screen: Screen) => void;
  user: UserProfile | null;
  onSelectCourse: (id: string) => void;
}

const CompletedCoursesScreen: React.FC<Props> = ({ onNavigate, user, onSelectCourse }) => {
  const completed = ALL_COURSES.filter(c => user?.completedCourses?.includes(c.id));

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => onNavigate('PROFILE')}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <span className="font-medium text-sm tracking-tight">.edsy Archive</span>
          <div className="w-10"></div>
        </div>
        <h1 className="text-4xl font-light tracking-tight leading-tight mb-2">
          Your <br/>
          <span className="font-medium">Achievements</span>
        </h1>
        <p className="text-zinc-500 text-sm">{completed.length} courses completed</p>
      </header>

      <div className="flex-1 px-6 pb-32 overflow-y-auto no-scrollbar space-y-4 pt-4">
        {completed.length > 0 ? (
          completed.map(course => {
            const instructor = INSTRUCTORS.find(i => i.id === course.instructorId);
            return (
              <div 
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="bg-zinc-900/50 border border-white/5 rounded-[32px] p-5 flex items-center gap-5 cursor-pointer hover:bg-zinc-900 transition-all active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                  <img src={course.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-base truncate">{course.title}</h3>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">Mentor: {instructor?.name}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                   <span className="material-symbols-outlined text-primary text-xl font-bold">verified</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 pb-12">
            <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">school</span>
            <p className="text-zinc-500 font-medium">You haven't finished any courses yet. Finish all lessons in a course to see it here!</p>
          </div>
        )}
      </div>

      <Navbar active="PROFILE" onNavigate={onNavigate} />
    </div>
  );
};

export default CompletedCoursesScreen;
