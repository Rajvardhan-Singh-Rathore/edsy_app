
import { Category, Instructor, Course } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Web Development', domain: 'Fullstack', icon: 'code', color: 'bg-muted-blue' },
  { id: '4', name: 'DSA Mastery', domain: 'Algorithms', icon: 'account_tree', color: 'bg-muted-green' },
  { id: '3', name: 'Data Science', domain: 'Analytics', icon: 'insights', color: 'bg-muted-purple' },
  { id: '2', name: 'Upcoming Courses', domain: 'Future', icon: 'rocket_launch', color: 'bg-muted-yellow', isUpcoming: true },
];

export const INSTRUCTORS: Instructor[] = [
  {
    id: 'i1',
    name: 'Harkirat Singh',
    role: 'Fullstack & Web3 Expert',
    bio: 'Founder of 100xDevs. Remote Engineer. Helping devs become top 1% by mastering MERN & Open Source.',
    image: 'https://preview.redd.it/hello-r-jee-im-harkirat-singh-air-658-in-jee-iit-roorkee-v0-b369l2auvabd1.jpg?width=960&format=pjpg&auto=webp&s=1f89b2b36725a0079320eb15574b821178df81c6',
    students: '500k+',
    topRated: true
  },
  {
    id: 'i2',
    name: 'Shradha Khapra',
    role: 'Java & DSA Expert',
    bio: 'Co-founder of Apna College. Ex-Microsoft SDE. Teaching millions how to code with impact.',
    image: 'https://media.licdn.com/dms/image/v2/D4D0BAQGrHRUqV-gU3w/company-logo_200_200/company-logo_200_200/0/1665839135830?e=2147483647&v=beta&t=ixuAyv1IjLkdDQIqfrk_qAcK5FoRfzVuBQTKnpdGkgs',
    students: '1M+'
  },
  {
    id: 'i3',
    name: 'Harsh Sharma',
    role: 'Creative Developer',
    bio: 'Sheryians Coding School lead. Specialist in GSAP, Three.js and high-end frontend animations.',
    image: 'https://media.licdn.com/dms/image/v2/D4D03AQG_2E9DMYnDRg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1706865413542?e=2147483647&v=beta&t=zIBgwj5FGE2gRP4bCvVbbc5IeQxIOwZhYoDheOWB78o',
    students: '200k+'
  }
];

export const ALL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Mastering React & Next.js',
    category: 'Frontend',
    progress: 0,
    instructorId: 'i1',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    lessons: [
    ]
  },
  {
    id: 'c2',
    title: 'DSA with Java Mastery',
    category: 'Algorithms',
    progress: 0,
    instructorId: 'i2',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    lessons: [
    ]
  }
];

export const CURRENT_COURSE = ALL_COURSES[0];
