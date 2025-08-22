# Link-A Mz - Transportation & Accommodations Platform

## Overview
Link-A is a streamlined travel booking platform for the Mozambique market, focusing on ride-sharing and accommodation services. It provides a seamless booking experience with real-time search, interactive maps focused on Mozambique, booking management, "Deal of the Day" promotions, pre-booking chat, user ratings, and event management. The platform aims to be a unified solution for transportation and accommodation needs within Mozambique, with optimized mobile experience.

## User Preferences
- Preferred communication style: Simple, everyday language
- Target market: Mozambique with Portuguese as main language
- Currency: Mozambique Metical (MZN) for all pricing
- Map restriction: Limited to Mozambique territory only with Portuguese labels
- Features: 
  - "Deal of the Day" promotional offers combining rides and accommodations
  - Pre-booking chat system between users, drivers, and hosts
  - Comprehensive user rating system for drivers and hosts
  - Event management with ticket booking and QR codes
  - Seat selection for rides with available seat display
  - Multi-person booking capability for accommodations
  - Integrated payment system with 10% platform fee for all transactions
  - Logo updated to "Link-A" (removed "Mz") with larger size
  - Date format standardized to dd/mm/yyyy throughout application with custom DateInput component
  - Enhanced location search with 200+ Mozambican locations including neighborhoods, beaches, landmarks, transport hubs
  - Mobile-optimized responsive design

## System Architecture

### Frontend Architecture
Built with React and TypeScript, featuring a modular component architecture, state management using React Query, styling with Tailwind CSS and shadcn/ui, and Wouter for routing. Forms are handled with React Hook Form and Zod for validation. Comprehensive booking confirmation system with two-way approval workflow implemented with real-time status tracking and Portuguese language support. Enhanced location search with comprehensive Mozambican database including 200+ locations covering neighborhoods, transport hubs, landmarks, beaches across all provinces with intelligent search ranking and Portuguese localization.

### Backend Architecture
An Express.js REST API layer handles requests. It uses an interface-based storage abstraction with Drizzle ORM for PostgreSQL and includes centralized error handling. Development is supported by Vite for hot module replacement.

### Data Architecture
The application uses an optimized PostgreSQL schema with Drizzle ORM, streamlined from 29 to 19 tables through systematic consolidation. Core tables include users, rides, accommodations, bookings (unified for rides/stays/events), ratings, chat messages, and a simplified partnership system. Restaurant functionality has been eliminated to focus on transportation and accommodation. Major optimizations: events system consolidated into main bookings table, partnership system simplified with direct accommodation discount fields, and payments system unified. **NEW**: Comprehensive booking confirmation system implemented with enhanced booking status tracking (pending_approval, approved, confirmed, rejected, completed), provider approval workflow, customer confirmation process, and real-time notification system. Type safety is ensured across the stack via shared TypeScript types from Drizzle.

### Authentication & Session Management
A mandatory, comprehensive authentication system supports email and Mozambique phone number login. It includes `LoginModal`, `ProtectedRoute`, and `AuthRequiredMessage` components, with authentication state managed via a `useAuth` hook and localStorage. Session persistence is managed using a PostgreSQL session store. Service offerings are restricted to verified users, integrating with a document verification system.

### Admin System
Provides an admin panel for user management (blocking, penalizing, removing users, drivers, accommodations), price regulation, and a penalty system. An admin dashboard offers statistics, reports, and platform configuration, with all actions tracked in PostgreSQL for audit.

### Payment System
Features an integrated payment processor with a 10% transaction fee. Supports multiple payment methods (credit cards, M-Pesa, bank transfers), dynamic pricing with partnership discounts, and detailed transaction history tracking. Dedicated API endpoints handle payment processing and refunds.

### Partnership System (Simplified)
Streamlined system where accommodations can offer driver discounts through simple fields: `offerDriverDiscounts`, `driverDiscountRate`, and `minimumDriverLevel`. Driver qualifications tracked in `driverStats` table with bronze/silver/gold/platinum levels based on performance. Partnership badges shown when enabled by hosts for visual recognition.

### Notifications System
Includes a comprehensive `NotificationCenter` component supporting multiple notification types (rides, stays, events, payments, loyalty, system) with priority levels and visual indicators.

### Loyalty Program System
Features a `LoyaltyProgram` component with a 4-tier membership system, a point earning system based on platform activities, a rewards catalog with tier-based restrictions, and points history tracking.

### Events & Fairs Management System (Optimized)
Events management integrated into main booking system for streamlined operations. Supports creating free and paid events with ticket management through unified bookings table. Event booking includes QR codes, ticket numbers, and partnership discounts. All event bookings processed through the main bookings table with event-specific fields (eventId, ticketQuantity, ticketNumbers array).

## External Dependencies

### Core Technologies
- **React**: Frontend framework
- **Express.js**: Node.js web server framework
- **Drizzle ORM**: TypeScript ORM for PostgreSQL
- **PostgreSQL**: Primary database (Neon Database for cloud hosting)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Headless UI components
- **shadcn/ui**: Component library
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESBuild**: Production bundling

### Third-party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Google Fonts**: Font APIs
- **Replit Integration**: Development environment tooling