
import React, { useState, useEffect, useCallback } from 'react';
import { Screen, UserProfile, Lesson, Course } from './types';
import { onAuthStateChanged, auth, db, doc, getDoc, collection, getDocs } from './lib/firebase';
import { ALL_COURSES } from './constants';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import InstructorScreen from './screens/InstructorScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import AdminScreen from './screens/AdminScreen';
import UpcomingScreen from './screens/UpcomingScreen';
import CompletedCoursesScreen from './screens/CompletedCoursesScreen';
import ContactScreen from './screens/ContactScreen';
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import RefundScreen from './screens/RefundScreen';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const NavigationHandler: React.FC<{ 
  currentScreen: Screen, 
  setCurrentScreen: (s: Screen) => void 
}> = ({ currentScreen, setCurrentScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Sync URL to internal state
    const path = location.pathname;
    if (path === '/privacy') setCurrentScreen('PRIVACY');
    else if (path === '/terms') setCurrentScreen('TERMS');
    else if (path === '/refund') setCurrentScreen('REFUND');
    else if (path === '/contact') setCurrentScreen('CONTACT');
  }, [location]);

  return null;
};

const App: React.FC = () => {
  // useEffect(() => {
  //   const loader = document.getElementById("app-loader");
  //   if (loader) loader.remove();
  // }, []);

  useEffect(() => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.classList.add("opacity-0");
    setTimeout(() => loader.remove(), 500); // smooth fade
  }
}, []);

  
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [lastVideo, setLastVideo] = useState<Lesson | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course>(ALL_COURSES[0]);
  const [uploadedLessons, setUploadedLessons] = useState<Lesson[]>([]);

  const fetchUploads = useCallback(async () => {
    try {
      const q = collection(db, "uploads");
      const snapshot = await getDocs(q);
      const lessons = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
      setUploadedLessons(lessons);
    } catch (e) {
      console.error("Error fetching uploads:", e);
    }
  }, []);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          // Forced Pro status for specific user
          if (userData.email === 'adityajadhav0119d@gmail.com') {
            userData.isPro = true;
          }
          setCurrentUser(userData);
        }
        if (currentScreen === 'LOGIN') {
          if (user.email === 'forfarzivada@gmail.com') setCurrentScreen('ADMIN');
          else setCurrentScreen('HOME');
        }
      } else {
        setCurrentUser(null);
        setCurrentScreen('LOGIN');
      }
    });
    return () => unsubscribe();
  }, [currentScreen]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('c1');
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  const navigateToCourse = (courseId: string, instructorId?: string) => {
    const course = ALL_COURSES.find(c => c.id === courseId) || ALL_COURSES[0];
    
    // Create a NEW course object that specifically locks in the selected instructor
    // This ensures CourseDetailScreen ALWAYS has the correct instructor context
    const instructorSpecificCourse = {
      ...course,
      instructorId: instructorId || course.instructorId
    };
    
    setSelectedCourse(instructorSpecificCourse);
    setSelectedInstructorId(instructorId || course.instructorId);
    setSelectedCourseId(courseId);
    setCurrentScreen('COURSE');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN':
        return <LoginScreen onNavigate={setCurrentScreen} />;
      case 'HOME':
        return <HomeScreen 
          user={currentUser} 
          onNavigate={setCurrentScreen} 
          onSelectCourse={(id, instId) => {
            setSelectedCourseId(id);
            if (instId) navigateToCourse(id, instId);
            else setCurrentScreen('INSTRUCTORS');
          }} 
          lastVideo={lastVideo} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />;
      case 'INSTRUCTORS':
        return <InstructorScreen 
          onNavigate={setCurrentScreen} 
          onSelectCourse={navigateToCourse} 
          selectedCourseId={selectedCourseId}
        />;
      case 'COURSE':
        return <CourseDetailScreen 
          onNavigate={setCurrentScreen} 
          setLastVideo={setLastVideo} 
          user={currentUser} 
          setUser={setCurrentUser} 
          course={{
            ...selectedCourse,
            instructorId: selectedInstructorId || selectedCourse.instructorId
          }} 
          extraLessons={uploadedLessons} 
          onRefresh={fetchUploads}
        />;
      case 'PROFILE':
        return <ProfileScreen onNavigate={setCurrentScreen} user={currentUser} />;
      case 'ADMIN':
        return <AdminScreen onNavigate={setCurrentScreen} onRefresh={fetchUploads} />;
      case 'UPCOMING':
        return <UpcomingScreen onNavigate={setCurrentScreen} />;
      case 'COMPLETED_COURSES':
        return <CompletedCoursesScreen onNavigate={setCurrentScreen} user={currentUser} onSelectCourse={navigateToCourse} />;
      case 'CONTACT':
        return <ContactScreen onNavigate={setCurrentScreen} />;
      case 'TERMS':
        return <TermsScreen onNavigate={setCurrentScreen} />;
      case 'PRIVACY':
        return <PrivacyScreen onNavigate={setCurrentScreen} />;
      case 'REFUND':
        return <RefundScreen onNavigate={setCurrentScreen} />;
      default:
        return <LoginScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <BrowserRouter>
      <NavigationHandler currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      <div className="flex justify-center min-h-screen bg-slate-950 md:py-8">
        <div className="w-full max-w-[430px] h-full min-h-screen md:min-h-[884px] md:h-[884px] bg-background-dark relative overflow-hidden md:rounded-[50px] md:shadow-2xl flex flex-col border border-white/5">
          <Routes>
            <Route path="/privacy" element={<PrivacyScreen onNavigate={setCurrentScreen} />} />
            <Route path="/terms" element={<TermsScreen onNavigate={setCurrentScreen} />} />
            <Route path="/refund" element={<RefundScreen onNavigate={setCurrentScreen} />} />
            <Route path="/contact" element={<ContactScreen onNavigate={setCurrentScreen} />} />
            <Route path="*" element={<>{renderScreen()}</>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
