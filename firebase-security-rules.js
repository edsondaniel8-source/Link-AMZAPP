// Firebase Security Rules for Link-A Platform
// These rules should be deployed to your Firebase project

// FIRESTORE SECURITY RULES
// Copy this to Firebase Console > Firestore > Rules tab

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserId() {
      return request.auth.uid;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function getUserRoles() {
      return request.auth.token.roles;
    }
    
    function hasRole(role) {
      return role in getUserRoles();
    }
    
    function isAdmin() {
      return hasRole('admin');
    }
    
    function isDriver() {
      return hasRole('driver');
    }
    
    function isHotelManager() {
      return hasRole('hotel_manager');
    }
    
    function isClient() {
      return hasRole('client');
    }
    
    function isOwner(userId) {
      return getUserId() == userId;
    }
    
    function isVerifiedUser() {
      return request.auth.token.verified == true;
    }

    // USERS COLLECTION
    match /users/{userId} {
      // Users can read their own profile and admins can read all
      allow read: if isOwner(userId) || isAdmin();
      
      // Users can create their own profile during registration
      allow create: if isAuthenticated() && isOwner(userId);
      
      // Users can update their own profile, admins can update any
      allow update: if (isOwner(userId) && isAuthenticated()) || isAdmin();
      
      // Only admins can delete users
      allow delete: if isAdmin();
      
      // User verification documents (sub-collection)
      match /verification/{docId} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
      
      // User roles history (sub-collection)
      match /roleHistory/{historyId} {
        allow read: if isOwner(userId) || isAdmin();
        allow create, update: if isAdmin();
      }
    }

    // RIDES COLLECTION
    match /rides/{rideId} {
      // Anyone can read public ride listings
      allow read: if true;
      
      // Only verified drivers can create rides
      allow create: if isAuthenticated() && isDriver() && isVerifiedUser();
      
      // Only ride owner (driver) can update their rides
      allow update: if isAuthenticated() && 
                     (resource.data.driverId == getUserId() || isAdmin());
      
      // Only ride owner or admin can delete rides
      allow delete: if isAuthenticated() && 
                     (resource.data.driverId == getUserId() || isAdmin());
    }

    // ACCOMMODATIONS COLLECTION
    match /accommodations/{accommodationId} {
      // Anyone can read public accommodation listings
      allow read: if true;
      
      // Only verified hotel managers can create accommodations
      allow create: if isAuthenticated() && isHotelManager() && isVerifiedUser();
      
      // Only accommodation owner can update their properties
      allow update: if isAuthenticated() && 
                     (resource.data.managerId == getUserId() || isAdmin());
      
      // Only property owner or admin can delete accommodations
      allow delete: if isAuthenticated() && 
                     (resource.data.managerId == getUserId() || isAdmin());
    }

    // BOOKINGS COLLECTION
    match /bookings/{bookingId} {
      // Users can read bookings they're involved in, admins can read all
      allow read: if isAuthenticated() && 
                   (resource.data.customerId == getUserId() || 
                    resource.data.providerId == getUserId() || 
                    isAdmin());
      
      // Authenticated users can create bookings
      allow create: if isAuthenticated() && request.resource.data.customerId == getUserId();
      
      // Customers and service providers can update their bookings
      allow update: if isAuthenticated() && 
                     (resource.data.customerId == getUserId() || 
                      resource.data.providerId == getUserId() || 
                      isAdmin());
      
      // Only admins can delete bookings (for data integrity)
      allow delete: if isAdmin();
    }

    // CHAT MESSAGES COLLECTION
    match /chatMessages/{messageId} {
      // Users can read messages from chats they participate in
      allow read: if isAuthenticated() && 
                   (resource.data.senderId == getUserId() || 
                    resource.data.recipientId == getUserId() ||
                    getUserId() in resource.data.participants ||
                    isAdmin());
      
      // Users can create messages in chats they participate in
      allow create: if isAuthenticated() && 
                     (request.resource.data.senderId == getUserId());
      
      // Users can update their own messages (for editing)
      allow update: if isAuthenticated() && 
                     (resource.data.senderId == getUserId() || isAdmin());
      
      // Messages generally shouldn't be deleted for audit purposes
      allow delete: if isAdmin();
    }

    // CHAT ROOMS COLLECTION
    match /chatRooms/{roomId} {
      // Users can read chat rooms they're participants in
      allow read: if isAuthenticated() && 
                   (getUserId() in resource.data.participants || isAdmin());
      
      // Users can create chat rooms when booking
      allow create: if isAuthenticated() && 
                     (getUserId() in request.resource.data.participants);
      
      // Participants can update room metadata
      allow update: if isAuthenticated() && 
                     (getUserId() in resource.data.participants || isAdmin());
      
      // Only admins can delete chat rooms
      allow delete: if isAdmin();
    }

    // RATINGS COLLECTION
    match /ratings/{ratingId} {
      // Anyone can read ratings (they're public)
      allow read: if true;
      
      // Only authenticated users who completed a booking can create ratings
      allow create: if isAuthenticated() && request.resource.data.userId == getUserId();
      
      // Users can update their own ratings
      allow update: if isAuthenticated() && 
                     (resource.data.userId == getUserId() || isAdmin());
      
      // Only admins can delete ratings
      allow delete: if isAdmin();
    }

    // PARTNERSHIPS COLLECTION
    match /partnerships/{partnershipId} {
      // Anyone can read active partnerships
      allow read: if resource.data.status == 'active';
      
      // Hotel managers and drivers can read their partnership details
      allow read: if isAuthenticated() && 
                   (resource.data.hotelId == getUserId() || 
                    resource.data.driverId == getUserId() ||
                    isAdmin());
      
      // Only hotel managers can create partnerships
      allow create: if isAuthenticated() && isHotelManager() && isVerifiedUser();
      
      // Partners can update their partnerships
      allow update: if isAuthenticated() && 
                     (resource.data.hotelId == getUserId() || 
                      resource.data.driverId == getUserId() ||
                      isAdmin());
      
      // Only admins can delete partnerships
      allow delete: if isAdmin();
    }

    // EVENTS COLLECTION
    match /events/{eventId} {
      // Anyone can read public events
      allow read: if true;
      
      // Only admins can create, update, and delete events
      allow write: if isAdmin();
    }

    // ADMIN LOGS COLLECTION (Security auditing)
    match /adminLogs/{logId} {
      // Only admins can read admin logs
      allow read: if isAdmin();
      
      // System can create logs (via server functions)
      allow create: if true;
      
      // Logs should never be updated or deleted for audit integrity
      allow update, delete: if false;
    }

    // NOTIFICATIONS COLLECTION
    match /notifications/{notificationId} {
      // Users can read their own notifications
      allow read: if isAuthenticated() && resource.data.userId == getUserId();
      
      // System can create notifications (via server functions)
      allow create: if true;
      
      // Users can mark their notifications as read
      allow update: if isAuthenticated() && 
                     resource.data.userId == getUserId() &&
                     request.resource.data.keys().hasOnly(['read', 'readAt']);
      
      // Users can delete their own notifications
      allow delete: if isAuthenticated() && resource.data.userId == getUserId();
    }

    // SYSTEM CONFIGURATION (Admin only)
    match /systemConfig/{configId} {
      allow read, write: if isAdmin();
    }

    // ANALYTICS COLLECTION (Read-only for admins)
    match /analytics/{analyticsId} {
      allow read: if isAdmin();
      allow create: if true; // Server functions can create analytics
      allow update, delete: if false; // Analytics should be immutable
    }
  }
}

// FIREBASE STORAGE SECURITY RULES
// Copy this to Firebase Console > Storage > Rules tab

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserId() {
      return request.auth.uid;
    }
    
    function isAdmin() {
      return 'admin' in request.auth.token.roles;
    }
    
    function isVerifiedUser() {
      return request.auth.token.verified == true;
    }

    // User profile images
    match /profiles/{userId}/{fileName} {
      // Users can read their own profile images, others can read if public
      allow read: if true; // Profile images are generally public
      
      // Users can upload their own profile images
      allow write: if isAuthenticated() && 
                    request.auth.uid == userId &&
                    request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                    request.resource.contentType.matches('image/.*');
      
      // Users can delete their own profile images
      allow delete: if isAuthenticated() && 
                     (request.auth.uid == userId || isAdmin());
    }

    // Document verification images (ID documents, etc.)
    match /verification/{userId}/{fileName} {
      // Only the user and admins can access verification documents
      allow read: if isAuthenticated() && 
                   (request.auth.uid == userId || isAdmin());
      
      // Users can upload their verification documents
      allow write: if isAuthenticated() && 
                    request.auth.uid == userId &&
                    request.resource.size < 10 * 1024 * 1024 && // 10MB limit
                    request.resource.contentType.matches('image/.*');
      
      // Only admins can delete verification documents (for audit purposes)
      allow delete: if isAdmin();
    }

    // Ride/accommodation images
    match /listings/{listingType}/{listingId}/{fileName} {
      // Anyone can view listing images
      allow read: if true;
      
      // Only verified users can upload listing images
      allow write: if isAuthenticated() && 
                    isVerifiedUser() &&
                    request.resource.size < 8 * 1024 * 1024 && // 8MB limit
                    request.resource.contentType.matches('image/.*');
      
      // Listing owners and admins can delete images
      allow delete: if isAuthenticated() && isAdmin(); // More complex owner check would need Firestore lookup
    }

    // Chat attachments
    match /chat/{roomId}/{fileName} {
      // Only chat participants can access attachments
      allow read: if isAuthenticated(); // Would need more complex participant check
      
      // Chat participants can upload attachments
      allow write: if isAuthenticated() &&
                    request.resource.size < 20 * 1024 * 1024; // 20MB limit for documents/images
      
      // Only admins can delete chat attachments (for audit purposes)
      allow delete: if isAdmin();
    }

    // System assets (logos, etc.)
    match /system/{fileName} {
      // Anyone can read system assets
      allow read: if true;
      
      // Only admins can manage system assets
      allow write, delete: if isAdmin();
    }

    // Temporary uploads
    match /temp/{userId}/{fileName} {
      // Users can access their own temporary uploads
      allow read, write, delete: if isAuthenticated() && 
                                   request.auth.uid == userId;
    }
  }
}

// FIREBASE REAL-TIME DATABASE RULES (for chat presence)
// Copy this to Firebase Console > Realtime Database > Rules tab

{
  "rules": {
    "presence": {
      "$userId": {
        ".read": true,
        ".write": "$userId === auth.uid"
      }
    },
    "chatTyping": {
      "$roomId": {
        "$userId": {
          ".read": true,
          ".write": "$userId === auth.uid"
        }
      }
    },
    "onlineUsers": {
      ".read": true,
      "$userId": {
        ".write": "$userId === auth.uid"
      }
    }
  }
}