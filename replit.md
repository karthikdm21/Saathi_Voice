# Saathi Voice - Voice-First Mentorship Platform

## Overview

Saathi Voice is a voice-first mentorship platform designed to connect rural youth in India with mentors. The application is built as a full-stack web application using modern technologies and follows a RESTful API architecture with a React frontend and Express.js backend.

## User Preferences

Preferred communication style: Simple, everyday language.
Registration preferences: Both voice and writing options should be available side by side for all registration forms.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend, backend, and database layers:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom dark theme optimized for accessibility
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Voice Handling**: Native Web Audio APIs for voice recording and playback

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with proper HTTP status codes and error handling
- **File Uploads**: Multer for handling audio file uploads
- **Session Management**: Simple localStorage-based session handling

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via Drizzle config)
- **Migrations**: Drizzle Kit for schema migrations
- **Connection**: Neon Database serverless driver for PostgreSQL

## Key Components

### Voice Recording System
The application implements a comprehensive voice recording system:
- Real-time audio recording using MediaRecorder API
- Support for WebM audio format with Opus codec
- Audio playback with custom controls
- File upload system for voice messages and introductions
- Audio transcription capabilities (framework ready)

### User Management
- Role-based user system (Students and Mentors)
- Comprehensive onboarding flows for both user types
- Profile management with voice introductions
- Simple authentication using localStorage

### Mentorship System
- Mentor discovery and matching based on expertise and languages
- Active mentorship relationship management
- Voice message exchange between mentors and students
- Rating and review system for mentors

### UI/UX Design
- Dark theme optimized for rural environments
- Mobile-first responsive design
- Accessibility-focused component library
- Voice-first interaction patterns

## Data Flow

1. **User Onboarding**: Users select their role and complete role-specific onboarding with voice introductions
2. **Mentor Discovery**: Students can search and filter mentors based on expertise, languages, and experience
3. **Mentorship Creation**: Students can connect with mentors to establish mentorship relationships
4. **Voice Communication**: Mentors and students exchange voice messages within their mentorship
5. **Session Management**: User sessions are maintained locally with plans for backend authentication

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm & drizzle-zod**: Type-safe ORM with validation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **multer**: File upload handling
- **wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Production bundling

## Deployment Strategy

The application is designed for deployment on Replit with the following characteristics:

### Development Setup
- Hot module replacement via Vite
- TypeScript compilation and type checking
- Automatic restart on server changes
- Replit-specific development enhancements

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles the Express server
- Database: Drizzle migrations handle schema updates
- File Storage: Local file system for audio uploads (ready for cloud storage)

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode switching
- Replit-specific integrations and banners

### Scalability Considerations
- Stateless server design for horizontal scaling
- File upload system ready for cloud storage migration
- Database queries optimized with proper indexing
- Caching strategy via React Query

The architecture prioritizes simplicity, type safety, and voice-first user experience while maintaining the flexibility to scale and add features like real-time communication, advanced NLP for voice processing, and comprehensive analytics.