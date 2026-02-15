
import React, { useState } from 'react';
import { Screen } from '../types';
import { 
  auth, db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  doc, setDoc 
} from '../lib/firebase';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const LoginScreen: React.FC<Props> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      if (isSignUp) {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email: email,
          points: 0,
          coursesCompleted: 0,
          hoursSpent: 0,
          level: 1,
          watchedLessons: [],
          completedCourses: []
        });
        
        if (email.toLowerCase() === 'forfarzivada@gmail.com') {
          onNavigate('ADMIN');
        } else {
          onNavigate('HOME');
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (email.toLowerCase() === 'forfarzivada@gmail.com') {
          onNavigate('ADMIN');
        } else {
          onNavigate('HOME');
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err.code);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        const msg = email === 'forfarzivada@gmail.com' 
          ? 'Invalid credentials. If this is your first time, please "Sign Up" first to create the admin account.'
          : 'Invalid credentials. Check email and password.';
        setError(msg);
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered.');
      } else {
        setError('Authentication failed. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full px-8 py-12 bg-background-dark text-white relative">
      <div className="flex justify-between items-start mb-16">
        <div className="flex flex-col gap-1">
          <div className="w-8 h-[2px] bg-white"></div>
          <div className="w-5 h-[2px] bg-white"></div>
        </div>
        <div className="text-xl font-bold tracking-tighter">.edsy</div>
      </div>

      <div className="flex flex-col mb-12">
        <h1 className="text-5xl font-light tracking-tight leading-[1.1] mb-2">
          {isSignUp ? 'Create' : 'Elevate'}<br/>
          <span className="font-semibold italic">{isSignUp ? 'Account' : 'Learning'}</span>
        </h1>
        <p className="text-slate-400 text-lg font-light max-w-[280px]">
          {isSignUp ? 'Join our community of specialized learners.' : 'Access specialized courses from world-class instructors.'}
        </p>
      </div>

      <div className="flex-grow flex flex-col justify-end space-y-6">
        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-1 leading-relaxed">
              {error}
            </div>
          )}
          <div className="relative">
            <input 
              className="w-full bg-zinc-900 border-none rounded-2xl py-4 px-6 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="Email address" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative flex items-center">
            <input 
              className="w-full bg-zinc-900 border-none rounded-2xl py-4 px-6 pr-14 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="Password" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              type="button"
              className="absolute right-4 w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer select-none"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
            >
              <span className="material-symbols-outlined text-[22px]">
                {showPassword ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            disabled={loading}
            onClick={handleAuth}
            className="w-full bg-primary text-black font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all group disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                {isSignUp ? 'Sign Up' : 'Log In'}
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center px-2">
            <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              {isSignUp ? 'Already have an account? Log In' : 'Create an account'}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
    </div>
  );
};

export default LoginScreen;
