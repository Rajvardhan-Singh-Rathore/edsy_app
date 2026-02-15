
import React, { useState, useMemo } from 'react';
import { Screen, Lesson, UserProfile, Course } from '../types';
import { db, doc, updateDoc, increment, arrayUnion, deleteDoc, storage, ref, deleteObject } from '../lib/firebase';
import Navbar from '../components/Navbar';

interface Props {
  onNavigate: (screen: Screen) => void;
  setLastVideo: (l: Lesson) => void;
  user: UserProfile | null;
  setUser: (u: (prev: UserProfile | null) => UserProfile | null) => void;
  course: Course;
  extraLessons?: Lesson[];
  onRefresh?: () => void;
}

const CourseDetailScreen: React.FC<Props> = ({ onNavigate, setLastVideo, user, setUser, course, extraLessons = [], onRefresh }) => {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [isPaid, setIsPaid] = useState(false); // Default to false, in production this should come from user profile

  const isAdmin = user?.email.toLowerCase() === 'forfarzivada@gmail.com';
  const isPro = user?.isPro === true;

  const allLessons = useMemo(() => {
    // 1. Get static lessons from the course object
    const staticLessons = course.lessons || [];

    // 2. Filter extra lessons from Firestore with extreme strictness
    const filteredExtra = extraLessons.filter(l => {
      const lessonData = l as any;
      const lessonCourseId = String(lessonData.courseId || '').trim();
      const lessonInstructorId = String(lessonData.instructorId || '').trim();
      
      const targetCourseId = String(course.id || '').trim();
      const targetInstructorId = String(course.instructorId || '').trim();

      // BOTH must match perfectly for the lesson to appear
      return lessonCourseId === targetCourseId && lessonInstructorId === targetInstructorId;
    });

    return [...staticLessons, ...filteredExtra];
  }, [course.lessons, extraLessons, course.id, course.instructorId]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (isPro || isAdmin) return;
    const video = e.currentTarget;
    if (video.currentTime >= 180) { // 3 minutes = 180 seconds
      video.pause();
      // Ensure it stays paused even if user tries to play
      video.currentTime = 180;
      setIsPlaying(false);
      setShowPaymentOverlay(true);
    }
  };

  const handlePayment = () => {
    const options = {
      key: "rzp_live_SFfCH67cAmMbfs",
      amount: 4900, // Amount in paise (49.00)
      currency: "INR",
      name: "Edsy Learning",
      description: `Unlock ${course.title}`,
      handler: async function (response: any) {
        if (response.razorpay_payment_id) {
          try {
            if (user) {
              const userRef = doc(db, "users", user.uid);
              await updateDoc(userRef, {
                isPro: true
              });
              setUser((prev) => prev ? { ...prev, isPro: true } : null);
            }
            setIsPaid(true);
            setShowPaymentOverlay(false);
            setIsPlaying(true);
            alert("Payment Successful! Your account is now PRO.");
          } catch (e) {
            console.error("Failed to update PRO status", e);
            alert("Payment successful but failed to update profile. Please contact support.");
          }
        }
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || ""
      },
      theme: {
        color: "#E2F163"
      }
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration % 60);
    setVideoDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
  };

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    let processed = url.trim();
    
    // Dropbox Fix: Ensure direct streaming
    if (processed.includes('dropbox.com')) {
      if (processed.includes('?')) {
        processed = processed.split('?')[0] + '?raw=1';
      } else {
        processed = processed + '?raw=1';
      }
    }
    
    // Cloudinary Fix: Convert HLS segments (.ts) to high-quality .mp4 streams
    if (processed.includes('cloudinary.com')) {
      const urlParts = processed.split('?');
      let base = urlParts[0];
      if (base.toLowerCase().endsWith('.ts')) {
        base = base.replace(/\.ts$/i, '.mp4');
      }
      // Strip common HLS suffixes that break direct playback
      base = base.replace(/_nssgnx$/, '').replace(/_hls$/, '');
      processed = base + (urlParts[1] ? '?' + urlParts[1] : '');
    }
    
    return processed;
  };

  const getYoutubeID = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]{11}).*/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getDriveID = (url: string) => {
    if (!url) return null;
    const match = url.match(/\/(?:file\/d\/|open\?id=|drive\/folders\/)([a-zA-Z0-9_-]{25,})/);
    return match ? match[1] : null;
  };

  const activeFinalUrl = useMemo(() => sanitizeUrl(activeLesson?.videoUrl || ''), [activeLesson]);
  const activeYtId = useMemo(() => getYoutubeID(activeFinalUrl), [activeFinalUrl]);
  const activeDriveId = useMemo(() => getDriveID(activeFinalUrl), [activeFinalUrl]);
  const isDirectVideo = activeFinalUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v|ts|m3u8)/) || 
                        activeFinalUrl.includes('raw=1') || 
                        activeFinalUrl.includes('firebasestorage') ||
                        activeFinalUrl.includes('cloudinary.com');

  const playLesson = async (lesson: Lesson) => {
    if (lesson.locked || deletingId) return;
    
    // Add instructorId and courseId for "Resume Learning" functionality
    const lessonWithMeta = {
      ...lesson,
      courseId: course.id,
      instructorId: course.instructorId
    };
    
    setActiveLesson(lesson);
    setLastVideo(lessonWithMeta);
    setIsPlaying(true);
    setVideoDuration(null); // Reset duration for new video
    
    if (user) {
      const isFirstWatch = !user.watchedLessons?.includes(lesson.id);
      if (isFirstWatch) {
        try {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, {
            watchedLessons: arrayUnion(lesson.id),
            points: increment(100)
          });
          setUser((prev) => prev ? { 
            ...prev, 
            points: prev.points + 100, 
            watchedLessons: [...(prev.watchedLessons || []), lesson.id] 
          } : null);
        } catch (e) {
          console.error("Progress save failed", e);
        }
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent | React.TouchEvent, lesson: Lesson) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAdmin) return;
    
    const confirmDelete = window.confirm(`Delete "${lesson.title}" permanently from database?`);
    if (!confirmDelete) return;
    
    setDeletingId(lesson.id);
    try {
      console.log("Starting deletion of:", lesson.id);
      
      // 1. Delete from Firestore
      const docRef = doc(db, "uploads", lesson.id);
      await deleteDoc(docRef);

      // 2. Storage Cleanup
      const storagePath = (lesson as any).storagePath;
      if (storagePath) {
        try {
          await deleteObject(ref(storage, storagePath));
        } catch (sErr) {
          console.warn("Storage item already missing:", sErr);
        }
      }

      // 3. UI Cleanup
      if (activeLesson?.id === lesson.id) {
        setIsPlaying(false);
        setActiveLesson(null);
      }
      
      // 4. Force Global Refresh
      if (onRefresh) {
        await onRefresh();
      }
      
      console.log("Deletion successful");
      onNavigate('HOME');
    } catch (err: any) {
      console.error("Critical Delete Error:", err);
      alert(`System Error: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <header className="px-6 py-6 flex justify-between items-center shrink-0 border-b border-white/5">
        <button onClick={() => onNavigate('HOME')} className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-800 hover:bg-zinc-900 transition-colors">
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Session Player</span>
          <span className="text-[8px] opacity-40 uppercase font-medium">{course.title}</span>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="px-6 pb-6 shrink-0 mt-6">
        <div className="relative aspect-video rounded-[32px] overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
          {activeLesson && isPlaying ? (
            activeYtId ? (
              <iframe 
                key={`yt-pl-${activeYtId}`}
                src={`https://www.youtube-nocookie.com/embed/${activeYtId}?rel=0&modestbranding=1`} 
                className="w-full h-full" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            ) : activeDriveId ? (
              <iframe
                key={`drive-pl-${activeDriveId}`}
                src={`https://drive.google.com/videopreview?id=${activeDriveId}`}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
              ></iframe>
            ) : isDirectVideo ? (
              <div className="relative w-full h-full">
                <video 
                  key={`direct-pl-${activeFinalUrl}`} 
                  autoPlay 
                  controls 
                  playsInline
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  className="w-full h-full bg-zinc-900" 
                  src={activeFinalUrl} 
                />
                {showPaymentOverlay && (
                  <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-primary text-3xl">lock</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Preview Ended</h3>
                    <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
                      Continue with course to unlock the full video and complete your learning journey.
                    </p>
                    <button 
                      onClick={handlePayment}
                      className="w-full py-4 bg-primary text-black font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                      Continue with Course
                    </button>
                    <button 
                      onClick={() => setShowPaymentOverlay(false)}
                      className="mt-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest hover:text-white"
                    >
                      Close Preview
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-zinc-900 p-8 text-center">
                 <span className="material-symbols-outlined text-4xl mb-4 text-zinc-700 animate-pulse">videocam_off</span>
                 <p className="text-xs text-zinc-500 font-medium">Link verification required</p>
                 <a href={activeLesson.videoUrl} target="_blank" rel="noreferrer" className="mt-4 px-6 py-2 bg-primary text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Check Source</a>
              </div>
            )
          ) : (
            <div className="relative w-full h-full group cursor-pointer" onClick={() => playLesson(allLessons[0])}>
              <img src={course.image} className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                  <span className="material-symbols-outlined text-white text-5xl translate-x-1">play_arrow</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-between items-start">
          <div className="flex-1 overflow-hidden pr-4">
            <h1 className="text-2xl font-light tracking-tight truncate">
              {activeLesson?.title || 'Course Overview'}
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              Duration: <span className="text-primary">{videoDuration || activeLesson?.duration || '--:--'}</span>
            </p>
          </div>
          {activeLesson && (
            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-primary text-sm">bolt</span>
              <span className="text-[10px] font-bold text-primary">+100</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 pb-40 overflow-y-auto no-scrollbar pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">Modules</h3>
          <span className="text-[8px] bg-zinc-900 px-2 py-1 rounded border border-white/5 opacity-50">{allLessons.length} UNITS</span>
        </div>

        <div className="space-y-4">
          {allLessons.map((lesson) => {
            const isUploaded = extraLessons.some(el => el.id === lesson.id);
            const isDeleting = deletingId === lesson.id;
            const isCurrent = activeLesson?.id === lesson.id;
            
            return (
              <div 
                key={lesson.id}
                className="relative group"
              >
                <div 
                  onClick={() => !isDeleting && playLesson(lesson)}
                  className={`flex gap-4 p-4 rounded-[32px] transition-all cursor-pointer border shadow-lg ${isCurrent ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/10' : 'bg-zinc-900/30 border-transparent hover:bg-zinc-900 hover:border-white/5 active:scale-[0.98]'}`}
                >
                  <div className="relative w-28 aspect-video rounded-2xl overflow-hidden bg-zinc-800 shrink-0">
                    <img src={lesson.thumbnail} className={`w-full h-full object-cover transition-opacity duration-500 ${isCurrent ? 'opacity-90' : 'opacity-40'}`} />
                    {isCurrent && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20">
                         <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></div>
                         </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-center overflow-hidden">
                    <h4 className={`text-sm font-medium truncate ${isCurrent ? 'text-primary' : 'text-white'}`}>{lesson.title}</h4>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter mt-1">{lesson.duration}</p>
                  </div>
                </div>

                {/* RELOCATED & FORCED DELETE BUTTON */}
                {isAdmin && (
                  <button 
                    onMouseDown={(e) => handleDelete(e, lesson)} // Capture before bubble
                    onClick={(e) => handleDelete(e, lesson)}
                    disabled={isDeleting}
                    className="absolute top-3 right-3 z-[99] w-10 h-10 rounded-full flex items-center justify-center bg-zinc-950/80 backdrop-blur-xl border border-white/10 text-zinc-500 hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/10 transition-all pointer-events-auto shadow-2xl"
                    title="Remove Module"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <Navbar active="BOOKMARKS" onNavigate={onNavigate} />
    </div>
  );
};

export default CourseDetailScreen;
