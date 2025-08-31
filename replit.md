# Link-A Tourism Platform

## Overview

Link-A is a comprehensive tourism and transportation platform designed for Mozambique. The application provides an integrated ecosystem that connects travelers with ride-sharing services, accommodations, and local events. The platform features a monorepo architecture with separate frontend and backend applications, supporting multiple user types including clients, drivers, hotel managers, and administrators.

The system implements Firebase authentication, real-time chat functionality, payment processing via Stripe, geolocation services, and a comprehensive booking system that spans transportation, accommodation, and event management.

## Recent Changes

**August 31, 2025:**
- ✅ Complete removal of all mock data and simulation components
- ✅ System now works exclusively with real data from PostgreSQL database
- ✅ Fixed SPA routing with proper static file serving and catch-all routes  
- ✅ Resolved 404 errors in route creation and JSON parsing
- ✅ Successfully cleaned codebase of all test/mock services
- ✅ Fixed frontend build errors by removing dependencies on deleted mock services
- ✅ Configured backend to serve both API endpoints and frontend static files correctly
- ✅ All terminology consistently uses Portuguese "saindo de" and "indo para"

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built as a React Single Page Application (SPA) using Vite as the build tool. The application follows a multi-app architecture pattern with separate applications for different user types:

- **Main App**: Public-facing application for general users
- **Drivers App**: Specialized interface for ride providers
- **Hotels App**: Management interface for accommodation providers  
- **Admin App**: Administrative dashboard for platform management

The frontend uses TypeScript with modern React patterns including hooks and context. UI components are built with Radix UI and styled with Tailwind CSS, providing a consistent design system across all applications.

### Backend Architecture
The backend follows a modular Express.js architecture with TypeScript. The system is organized into distinct modules:

- **Rides Module**: Handles ride-sharing functionality including search, booking, and management
- **Hotels Module**: Manages accommodation listings and reservations
- **Events Module**: Handles event creation, ticketing, and management
- **Bookings Module**: Centralized booking system across all service types
- **Users Module**: User management and profile operations
- **Admin Module**: Administrative functions and platform management

The backend implements role-based access control with Firebase Admin SDK, supporting different permission levels for clients, drivers, hotel managers, and administrators.

### Data Storage Solutions
The application uses PostgreSQL as the primary database, accessed through Drizzle ORM for type-safe database operations. The database design includes:

- **Users Table**: Stores user profiles with role-based permissions and verification status
- **Rides Table**: Transportation listings with geolocation and pricing information
- **Accommodations Table**: Hotel and lodging information with amenities and availability
- **Events Table**: Event listings with ticketing and partnership capabilities
- **Bookings Table**: Unified booking system supporting all service types
- **Payments Table**: Transaction records and billing information

Session management is handled through PostgreSQL session storage for authentication persistence.

### Authentication and Authorization
The system implements Firebase Authentication for user management with custom claims for role-based access control. The authentication flow supports:

- Email/password authentication
- Role assignment (client, driver, hotel_manager, admin)
- Document verification system for service providers
- JWT token verification with Firebase Admin SDK

Firebase Admin SDK handles server-side authentication verification and custom claims management for granular permission control.

### Real-time Communication
Socket.io integration provides real-time chat functionality between users, particularly for pre-booking coordination and customer support. The chat system includes:

- Direct messaging between users
- Booking-specific chat rooms
- Message persistence in PostgreSQL
- Real-time connection management

## External Dependencies

### Firebase Services
- **Firebase Authentication**: User management and authentication
- **Firebase Admin SDK**: Server-side authentication verification and user management
- Custom claims for role-based access control

### Payment Processing
- **Stripe**: Payment gateway for handling transactions
- Support for multiple payment methods including cards and mobile money
- Webhook integration for payment status updates

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL hosting
- **Railway**: Backend deployment and hosting
- **Vercel**: Frontend deployment and CDN

### Geolocation Services
- **Google Maps API**: Location services and mapping functionality
- **Geolib**: Distance calculations and geospatial operations
- Built-in Mozambique location database for local optimization

### File Storage
- **Google Cloud Storage**: Document and image storage
- **Multer**: File upload handling middleware

### Development Tools
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation
- **TanStack Query**: API state management and caching
- **Wouter**: Lightweight routing for React

### Communication Services
- **Socket.io**: Real-time bidirectional communication
- **WebSocket**: Low-level real-time connection support

### UI and Styling
- **Radix UI**: Accessible UI component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library