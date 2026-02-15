
import React, { useState, useRef, useMemo } from 'react';
import { Screen } from '../types';
import { db, collection, addDoc, storage, ref, uploadBytesResumable, getDownloadURL } from '../lib/firebase';
import { ALL_COURSES, INSTRUCTORS } from '../constants';

interface Props {
  onNavigate: (screen: Screen) => void;
  onRefresh?: () => void;
}

const AdminScreen: React.FC<Props> = ({ onNavigate, onRefresh }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState(ALL_COURSES[0].id);
  const [instructor, setInstructor] = useState(INSTRUCTORS[0].id);
  const [videoUrl, setVideoUrl] = useState('');
  const [useUpload, setUseUpload] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const uploadTaskRef = useRef<any>(null);

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    let processed = url.trim();
    
    // Dropbox Fix: Ensure raw=1 for direct streaming
    if (processed.includes('dropbox.com')) {
      if (processed.includes('?')) {
        processed = processed.replace(/[?&]dl=[01]/g, '');
        processed += (processed.includes('?') ? '&' : '?') + 'raw=1';
      } else {
        processed += '?raw=1';
      }
    }
    
    // Cloudinary Fix: Force .mp4 extension for direct browser playback if .ts is detected
    if (processed.includes('cloudinary.com')) {
      // Replace .ts extension with .mp4 at the end of the path (before query params)
      const urlParts = processed.split('?');
      if (urlParts[0].toLowerCase().endsWith('.ts')) {
        urlParts[0] = urlParts[0].slice(0, -3) + '.mp4';
      }
      processed = urlParts.join('?');
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

  const finalUrl = useMemo(() => sanitizeUrl(videoUrl), [videoUrl]);
  const ytId = useMemo(() => getYoutubeID(finalUrl), [finalUrl]);
  const driveId = useMemo(() => getDriveID(finalUrl), [finalUrl]);
  const isDirectVideo = finalUrl.toLowerCase().match(/\.(mp4|webm|ogg|mov|m4v|ts|m3u8)/) || 
                        finalUrl.includes('raw=1') || 
                        finalUrl.includes('firebasestorage') ||
                        finalUrl.includes('cloudinary.com');

  const handlePublish = async () => {
    if (!title || !description) {
      setStatus('Title and description are required.');
      return;
    }
    if (!useUpload && !videoUrl) {
      setStatus('Please paste a video URL.');
      return;
    }
    
    setLoading(true);
    setStatus(useUpload ? 'Uploading file...' : 'Publishing...');
    
    try {
      let savedUrl = finalUrl;
      let storagePath = null;
      let calculatedDuration = "10:00";

      // Validation: Ensure course and instructor are selected
      if (!course || !instructor) {
        setStatus('Course and Instructor selection is required.');
        setLoading(false);
        return;
      }

      // Calculate duration for external links if possible
      if (!useUpload && isDirectVideo) {
        try {
          const videoElement = document.createElement('video');
          videoElement.preload = 'metadata';
          videoElement.src = finalUrl;
          
          calculatedDuration = await new Promise<string>((resolve) => {
            videoElement.onloadedmetadata = () => {
              const minutes = Math.floor(videoElement.duration / 60);
              const seconds = Math.floor(videoElement.duration % 60);
              resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            };
            videoElement.onerror = () => resolve("10:00");
            setTimeout(() => resolve("10:00"), 3000); // 3s timeout
          });
        } catch (e) {
          console.warn("Duration calculation failed", e);
        }
      }

      if (useUpload && selectedFile) {
        storagePath = `videos/${Date.now()}_${selectedFile.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        uploadTaskRef.current = uploadTask;

        savedUrl = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snap) => setUploadProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
            (err) => reject(err),
            async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
          );
        });

        // Calculate duration for uploaded file
        try {
          const videoElement = document.createElement('video');
          videoElement.preload = 'metadata';
          videoElement.src = savedUrl;
          calculatedDuration = await new Promise<string>((resolve) => {
            videoElement.onloadedmetadata = () => {
              const minutes = Math.floor(videoElement.duration / 60);
              const seconds = Math.floor(videoElement.duration % 60);
              resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            };
            videoElement.onerror = () => resolve("10:00");
            setTimeout(() => resolve("10:00"), 3000);
          });
        } catch (e) {}
      }

      await addDoc(collection(db, "uploads"), {
        title,
        description,
        courseId: course, 
        instructorId: instructor,
        timestamp: new Date().toISOString(),
        thumbnail: ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop",
        videoUrl: savedUrl, 
        duration: calculatedDuration,
        locked: false,
        storagePath: storagePath
      });
      
      setStatus('Success! Lesson is live.');
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setSelectedFile(null);
      
      if (onRefresh) await onRefresh();
      setTimeout(() => onNavigate('HOME'), 1000);
    } catch (e: any) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden relative">
      <div className="flex-grow px-6 py-12 flex flex-col overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => onNavigate('HOME')} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800">
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-bold tracking-[0.3em] uppercase text-zinc-600">Admin Console</h1>
            <span className="text-[8px] text-primary font-black uppercase mt-1">Universal Engine v5.0</span>
          </div>
          <div className="w-10"></div> 
        </div>

        <div className="space-y-6 flex-grow">
          <div className="grid grid-cols-2 gap-3">
            <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 transition-all">
              {ALL_COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
            <select value={instructor} onChange={(e) => setInstructor(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-3 text-xs outline-none focus:ring-1 focus:ring-primary/20 transition-all">
              {INSTRUCTORS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
              <button onClick={() => setUseUpload(false)} className={`flex-1 py-2 text-[9px] font-bold rounded-xl transition-all ${!useUpload ? 'bg-zinc-800 text-primary' : 'text-zinc-600'}`}>EXTERNAL LINK</button>
              <button onClick={() => setUseUpload(true)} className={`flex-1 py-2 text-[9px] font-bold rounded-xl transition-all ${useUpload ? 'bg-zinc-800 text-primary' : 'text-zinc-600'}`}>FILE UPLOAD</button>
            </div>

            {!useUpload && (
              <div className="space-y-3">
                <input 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-xs text-white placeholder:text-zinc-700 outline-none focus:ring-1 focus:ring-primary/30 transition-all" 
                  placeholder="Paste YouTube, Drive, Dropbox, Cloudinary..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                
                {finalUrl && (
                  <div className="bg-zinc-950 border border-zinc-800 rounded-[28px] overflow-hidden p-2 shadow-2xl animate-in fade-in duration-300">
                    <div className="flex justify-between items-center px-4 py-2">
                      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                        {ytId ? 'YouTube' : driveId ? 'G-Drive' : isDirectVideo ? 'Direct/Sanitized' : 'Analyzing...'}
                      </p>
                    </div>
                    <div className="aspect-video bg-black rounded-[22px] overflow-hidden border border-white/5">
                      {ytId ? (
                        <iframe 
                          key={`yt-adm-${ytId}`}
                          src={`https://www.youtube-nocookie.com/embed/${ytId}`} 
                          className="w-full h-full" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : driveId ? (
                        <iframe
                          key={`drive-adm-${driveId}`}
                          src={`https://drive.google.com/videopreview?id=${driveId}`}
                          className="w-full h-full"
                          frameBorder="0"
                          allow="autoplay"
                          allowFullScreen
                        ></iframe>
                      ) : isDirectVideo ? (
                        <video 
                          key={`direct-adm-${finalUrl}`} 
                          src={finalUrl} 
                          controls 
                          playsInline
                          className="w-full h-full bg-zinc-900" 
                        />
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-2">
                          <span className="material-symbols-outlined text-zinc-800 text-3xl">help_outline</span>
                          <p className="text-[10px] text-zinc-700">Source detected: Link may need validation</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {useUpload && (
              <div className="relative aspect-[21/9] rounded-2xl border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2 transition-colors hover:border-zinc-700">
                <span className="material-symbols-outlined text-zinc-700 text-3xl">upload_file</span>
                <p className="text-[9px] text-zinc-600 font-medium">{selectedFile ? selectedFile.name : 'Click to choose file'}</p>
                <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
            )}

            <input 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm outline-none focus:ring-1 focus:ring-primary/20 transition-all" 
              placeholder="Module Title" value={title} onChange={(e) => setTitle(e.target.value)} 
            />
            <textarea 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 px-6 text-sm resize-none outline-none focus:ring-1 focus:ring-primary/20 transition-all" 
              placeholder="Module Description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="pt-8">
          {status && (
            <div className={`p-4 rounded-xl mb-4 text-[10px] font-bold text-center border ${status.includes('Error') ? 'text-red-400 border-red-500/10' : 'text-primary border-primary/10'}`}>
              {status}
            </div>
          )}
          <button 
            disabled={loading} onClick={handlePublish}
            className="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-2xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'PUBLISHING...' : 'SAVE MODULE'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;
