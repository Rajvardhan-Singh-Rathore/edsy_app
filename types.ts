
export type Screen = 'LOGIN' | 'HOME' | 'INSTRUCTORS' | 'COURSE' | 'PROFILE' | 'ADMIN' | 'UPCOMING' | 'COMPLETED_COURSES' | 'CONTACT' | 'TERMS' | 'PRIVACY' | 'REFUND';

export interface UserProfile {
  uid: string;
  email: string;
  points: number;
  coursesCompleted: number;
  hoursSpent: number;
  level: number;
  watchedLessons: string[]; // Track IDs of watched videos to prevent double points
  completedCourses: string[]; // Track IDs of finished courses
  isPro?: boolean; // NEW: Persistent Pro status
}

export interface Instructor {
  id: string;
  name: string;
  role: string;
  rating?: number;
  reviews?: number;
  bio: string;
  image: string;
  students: string;
  topRated?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  lessons: Lesson[];
  progress: number;
  instructorId: string;
  image: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  description: string;
  locked: boolean;
  thumbnail: string;
  videoUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  domain: string;
  icon: string;
  color: string;
  isUpcoming?: boolean;
}
