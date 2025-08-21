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
  - Integrated payment system with 10% platform fee for all transactions
  - Logo updated to "Link-A" (removed "Mz") with larger size
  - Date-only selection for ride searches (time shown only in driver offers)

## Recent Changes (August 2025)

**Partnership System Redesign - Made Optional for Accommodations**
- Partnership system is now **optional** and controlled by accommodation hosts
- Only accommodations that opt-in will offer driver discounts
- Added `HostPartnershipSetup` component for hosts to configure their programs
- Updated database schema with `accommodation_partnership_programs` table
- Partnership badges only appear when hosts enable `partnershipBadgeVisible`
- Drivers only see partnerships from participating accommodations
- System respects host autonomy - no automatic enrollment in partnership programs

**Key Architecture Changes:**
- New table: `accommodation_partnership_programs` (host-controlled settings)
- Modified: `accommodations` table (added partnership flags)  
- Updated: `driver_hotel_partnerships` (now references host programs)
- Partnership visibility controlled at accommodation level
- Badge system only shows "Motoristas VIP" when hosts opt-in

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
- **Database Schema**: 15+ tables including users, rides, accommodations, bookings, ratings, chat messages, restaurants, and partnership system
- **User Management**: Enhanced user system with ratings, verification status, and user types (user, driver, host, restaurant)
- **Rating System**: Comprehensive rating and review system for all service providers
- **Chat System**: Pre-booking and post-booking chat functionality between users and service providers
- **Restaurant Integration**: Full restaurant database with menus, daily specials, and ordering capabilities
- **Partnership System**: Optional driver-accommodation partnerships with host-controlled programs and 4-tier qualification levels
- **Type Safety**: Shared TypeScript types generated from Drizzle schema ensuring consistency across frontend and backend
- **Validation**: Zod schemas for runtime validation derived from database schema

### Authentication & Session Management
- **Session Storage**: PostgreSQL session store with connect-pg-simple for persistent sessions
- **User Management**: Complete user authentication system with secure password handling

### Admin System
- **User Management**: Comprehensive admin panel for blocking, penalizing, and removing users, drivers, and accommodations
- **Price Regulation**: System for setting minimum and maximum price limits per kilometer for different ride types
- **Penalty System**: Warning, suspension, banning, and account removal capabilities with reason tracking
- **Admin Dashboard**: Statistics, reports, and platform configuration management
- **Database Integration**: Admin actions tracking with PostgreSQL storage for audit trails

### Payment System
- **Integrated Payment Processing**: 10% transaction fee applied to all platform services (rides, accommodations, restaurants)
- **Multiple Payment Methods**: Support for credit cards, M-Pesa, and bank transfers
- **Payment Modal**: Comprehensive payment interface with real-time fee calculation
- **Partnership Discounts**: Dynamic pricing with driver partnership discounts (10-25% off accommodations)
- **Transaction History**: Complete transaction tracking with detailed payment records
- **Payment Routes**: Dedicated API endpoints for payment processing, transaction history, and refunds
- **Database Schema**: Full transaction and payment method tracking with PostgreSQL integration

### Partnership System (Optional for Accommodations)
- **Host-Controlled**: Accommodations choose whether to participate in driver partnerships
- **4-Tier System**: Bronze (10%), Silver (15%), Gold (20%), Platinum (25%) discount levels
- **Qualification-Based**: Driver performance metrics determine partnership eligibility
- **Flexible Configuration**: Hosts set their own discount rates and minimum ride requirements
- **Visual Integration**: Partnership badges only appear when hosts enable visibility
- **Database Integration**: 4 dedicated tables for partnerships, benefits, stats, and discount tracking

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