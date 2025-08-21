# Link-A Mz - Transportation & Accommodations Platform

## Overview

Link-A Mz is a comprehensive travel booking platform designed specifically for the Mozambique market that combines ride-sharing, accommodation services, and restaurant meal stops in a unified interface. The application allows users to search for transportation options (similar to Uber), lodging accommodations (similar to Airbnb), and dining experiences through a single platform. Built with a React frontend and Express backend, it provides a seamless booking experience with real-time search capabilities, interactive maps focused on Mozambique territory, comprehensive booking management, promotional "Deal of the Day" packages, pre-booking chat functionality, user rating system, and restaurant meal stop ordering with advance chat capabilities.

## User Preferences

- Preferred communication style: Simple, everyday language
- Target market: Mozambique with Portuguese as main language
- Currency: Mozambique Metical (MZN) for all pricing
- Map restriction: Limited to Mozambique territory only with Portuguese labels
- Features: 
  - "Deal of the Day" promotional offers combining rides and accommodations
  - Restaurant/meal stops with advance ordering and chat capabilities
  - Pre-booking chat system between users, drivers, and hosts
  - Comprehensive user rating system for drivers, hosts, and restaurants
  - Seat selection for rides with available seat display
  - Multi-person booking capability for accommodations

## System Architecture

### Frontend Architecture
The client-side is built using React with TypeScript, utilizing modern development patterns:
- **Component Architecture**: Modular React components with separation of concerns between search, results, and booking functionality
- **State Management**: React Query (TanStack Query) for server state management and caching, with local React state for UI interactions
- **UI Framework**: Tailwind CSS for styling with shadcn/ui component library providing consistent design system
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

### Backend Architecture
The server follows a REST API pattern with Express.js:
- **API Layer**: RESTful endpoints for rides, accommodations, and bookings with standardized request/response patterns
- **Storage Pattern**: Interface-based storage abstraction (IStorage) with in-memory implementation for development and easy database integration
- **Error Handling**: Centralized error handling middleware with consistent error response format
- **Development Setup**: Vite integration for hot module replacement in development mode

### Data Architecture
The application uses a PostgreSQL-compatible schema with Drizzle ORM:
- **Database Schema**: Well-defined tables for users, rides, accommodations, bookings, ratings, chat messages, and restaurants with proper relationships
- **User Management**: Enhanced user system with ratings, verification status, and user types (user, driver, host, restaurant)
- **Rating System**: Comprehensive rating and review system for all service providers
- **Chat System**: Pre-booking and post-booking chat functionality between users and service providers
- **Restaurant Integration**: Full restaurant database with menus, daily specials, and ordering capabilities
- **Type Safety**: Shared TypeScript types generated from Drizzle schema ensuring consistency across frontend and backend
- **Validation**: Zod schemas for runtime validation derived from database schema

### Authentication & Session Management
- **Session Storage**: PostgreSQL session store with connect-pg-simple for persistent sessions
- **User Management**: Complete user authentication system with secure password handling

## External Dependencies

### Core Technologies
- **React**: Frontend framework with TypeScript support
- **Express.js**: Node.js web server framework
- **Drizzle ORM**: TypeScript-first ORM for PostgreSQL with migration support
- **PostgreSQL**: Primary database (Neon Database for cloud hosting)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components for accessibility and functionality
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Static type checking across the entire stack
- **ESBuild**: Production bundling for server-side code

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Font APIs**: Google Fonts integration for typography
- **Replit Integration**: Development environment specific tooling and error overlays

The architecture supports easy scaling from development to production, with the storage layer designed to seamlessly transition from in-memory mock data to full PostgreSQL integration.