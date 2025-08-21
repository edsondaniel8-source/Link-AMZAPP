# Link-A Mz - Transportation & Accommodations Platform

## Overview
Link-A Mz is a comprehensive travel booking platform for the Mozambique market, unifying ride-sharing, accommodation, and restaurant meal services. It provides a seamless booking experience with real-time search, interactive maps focused on Mozambique, booking management, "Deal of the Day" promotions, pre-booking chat, user rating, and advance ordering for restaurant meal stops. The platform aims to be a unified solution for travel and dining needs within Mozambique.

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

## System Architecture

### Frontend Architecture
Built with React and TypeScript, featuring a modular component architecture, state management using React Query, styling with Tailwind CSS and shadcn/ui, and Wouter for routing. Forms are handled with React Hook Form and Zod for validation.

### Backend Architecture
An Express.js REST API layer handles requests. It uses an interface-based storage abstraction with Drizzle ORM for PostgreSQL and includes centralized error handling. Development is supported by Vite for hot module replacement.

### Data Architecture
The application uses a PostgreSQL-compatible schema with Drizzle ORM, encompassing over 15 tables for users, rides, accommodations, bookings, ratings, chat messages, restaurants, and a comprehensive partnership system. It includes enhanced user management with verification and types, a comprehensive rating system, chat functionality, and full restaurant integration. Type safety is ensured across the stack via shared TypeScript types from Drizzle.

### Authentication & Session Management
A mandatory, comprehensive authentication system supports email and Mozambique phone number login. It includes `LoginModal`, `ProtectedRoute`, and `AuthRequiredMessage` components, with authentication state managed via a `useAuth` hook and localStorage. Session persistence is managed using a PostgreSQL session store. Service offerings are restricted to verified users, integrating with a document verification system.

### Admin System
Provides an admin panel for user management (blocking, penalizing, removing users, drivers, accommodations), price regulation, and a penalty system. An admin dashboard offers statistics, reports, and platform configuration, with all actions tracked in PostgreSQL for audit.

### Payment System
Features an integrated payment processor with a 10% transaction fee. Supports multiple payment methods (credit cards, M-Pesa, bank transfers), dynamic pricing with partnership discounts, and detailed transaction history tracking. Dedicated API endpoints handle payment processing and refunds.

### Partnership System (Optional for Accommodations)
Allows hosts to opt-in to driver partnerships, offering discounts via a 4-tier system (Bronze, Silver, Gold, Platinum). Qualification is based on driver performance, and hosts can configure discount rates and minimum ride requirements. Partnership badges are visually integrated when enabled by hosts.

### Notifications System
Includes a comprehensive `NotificationCenter` component supporting multiple notification types (rides, stays, events, payments, loyalty, system) with priority levels and visual indicators.

### Loyalty Program System
Features a `LoyaltyProgram` component with a 4-tier membership system, a point earning system based on platform activities, a rewards catalog with tier-based restrictions, and points history tracking.

### Events & Fairs Management System
A dedicated events section includes search, filtering, booking, and partnership integration. It supports creating both free and paid events with integrated payment processing and ticket management, including QR codes and validation. An approval workflow is in place for all created events.

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