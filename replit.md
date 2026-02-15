# Edsy - Specialized Learning Platform

## Overview

Edsy is a premium mobile-first learning platform built with React and TypeScript. It provides specialized courses with world-class instructors, featuring progress tracking, user authentication, and an admin content management system. The platform is designed as a dark-themed, iOS-inspired educational app with smooth animations and a modern UI aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 19 with TypeScript, using functional components and hooks
- **Build Tool**: Vite 6 for fast development and optimized production builds
- **Styling**: Tailwind CSS loaded via CDN with custom configuration for dark theme, custom colors (primary lime-green `#E2F163`), and extended border radius tokens
- **Animations**: Framer Motion for smooth UI transitions and interactions
- **Icons**: Material Symbols (Google) loaded via CSS, supplemented by Lucide React
- **State Management**: React useState/useEffect hooks with prop drilling pattern (no external state library)

### Screen-Based Navigation
The app uses a custom screen-based navigation system rather than React Router DOM (despite being installed):
- Screen state managed in App.tsx via `currentScreen` state
- Screens: LOGIN, HOME, INSTRUCTORS, COURSE, PROFILE, ADMIN, UPCOMING, COMPLETED_COURSES
- Navigation handled through `onNavigate` callback props
- Bottom navigation bar component (`Navbar.tsx`) for mobile navigation

### Backend & Data Layer
- **Authentication**: Firebase Auth with email/password sign-in
- **Database**: Firebase Firestore for user profiles, uploaded lessons, and progress tracking
- **Storage**: Firebase Storage for video file uploads (admin functionality)
- **Data Model**:
  - `users` collection: User profiles with points, level, watched lessons, completed courses
  - `uploads` collection: Admin-uploaded lessons with video URLs

### Content Structure
- Static course and instructor data defined in `constants.tsx`
- Dynamic lesson uploads stored in Firestore and merged with static course data
- Video content supports multiple sources: direct URLs, Dropbox links, Cloudinary, and Firebase Storage uploads

### Admin System
- Single admin user identified by email (`forfarzivada@gmail.com`)
- Admin can upload video lessons with title, description, course assignment
- Supports both URL-based videos and direct file uploads to Firebase Storage
- URL sanitization for Dropbox and Cloudinary compatibility

### Gamification
- Points system for watching lessons (prevents double-counting via `watchedLessons` array)
- User levels and hours tracking
- Course completion tracking with dedicated completed courses screen

## External Dependencies

### Firebase Services
- **Firebase Auth**: Email/password authentication
- **Firebase Firestore**: Document database for user data and uploaded content
- **Firebase Storage**: File storage for admin video uploads
- **Firebase Analytics**: Usage tracking (initialized but minimally used)
- Firebase SDK loaded via ESM from gstatic.com CDN (version 10.8.0)

### External Video Hosting
The platform supports video content from:
- Direct video URLs
- Dropbox (with automatic `?raw=1` parameter handling)
- Cloudinary (with automatic .ts to .mp4 conversion for browser compatibility)
- Firebase Storage uploads

### CDN Resources
- Tailwind CSS via CDN with forms and typography plugins
- Google Fonts (Inter font family)
- Material Symbols icon font

### Gemini API
The project includes configuration for Gemini API (via `GEMINI_API_KEY` environment variable), though current implementation doesn't appear to actively use it. This suggests planned AI features.