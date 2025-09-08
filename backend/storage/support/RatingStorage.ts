import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { ratings, users } from '../../shared/schema';
import { 
  Rating, 
  CreateRatingData, 
  ServiceType,
  ModerationAction,
  User 
} from '../types';

export interface IRatingStorage {
  // Rating operations
  createRating(data: CreateRatingData): Promise<Rating>;
  getRatingsByUser(userId: string, type: 'given' | 'received'): Promise<Rating[]>;
  updateUserRatingAverage(userId: string): Promise<void>;
  
  // Service ratings
  getRatingsForService(serviceId: string, serviceType: ServiceType): Promise<Rating[]>;
  getAverageRating(targetId: string, serviceType: ServiceType): Promise<number>;
  
  // Rating management
  getRating(ratingId: string): Promise<Rating | undefined>;
  deleteRating(ratingId: string): Promise<void>;
  
  // Moderation
  flagInappropriateRating(ratingId: string, reason: string): Promise<void>;
  moderateRating(ratingId: string, action: ModerationAction): Promise<Rating>;
  
  // Analytics
  getRatingStatistics(userId?: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }>;
}

export class DatabaseRatingStorage implements IRatingStorage {
  
  // ===== RATING OPERATIONS =====
  
  async createRating(data: CreateRatingData): Promise<Rating> {
    try {
      const [rating] = await db
        .insert(ratings)
        .values({
          fromUserId: data.fromUserId,
          toUserId: data.toUserId,
          rating: data.rating,
          comment: data.comment,
          serviceType: data.serviceType,
          bookingId: data.bookingId,
        })
        .returning();
      
      // Update the target user's average rating
      await this.updateUserRatingAverage(data.toUserId);
      
      return {
        id: rating.id,
        fromUserId: rating.fromUserId!,
        toUserId: rating.toUserId!,
        rating: rating.rating,
        comment: rating.comment,
        serviceType: rating.serviceType as ServiceType,
        bookingId: rating.bookingId,
        serviceId: data.serviceId,
        createdAt: rating.createdAt!,
        updatedAt: rating.createdAt!,
      } as Rating;
    } catch (error) {
      console.error('Error creating rating:', error);
      throw new Error('Failed to create rating');
    }
  }

  async getRatingsByUser(userId: string, type: 'given' | 'received'): Promise<Rating[]> {
    try {
      const field = type === 'given' ? ratings.fromUserId : ratings.toUserId;
      const otherField = type === 'given' ? ratings.toUserId : ratings.fromUserId;
      
      const ratingList = await db
        .select({
          id: ratings.id,
          fromUserId: ratings.fromUserId,
          toUserId: ratings.toUserId,
          rating: ratings.rating,
          comment: ratings.comment,
          serviceType: ratings.serviceType,
          bookingId: ratings.bookingId,
          createdAt: ratings.createdAt,
          // Other user info
          otherUser: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          },
        })
        .from(ratings)
        .leftJoin(users, eq(otherField, users.id))
        .where(eq(field, userId))
        .orderBy(desc(ratings.createdAt));

      return ratingList.map(rating => ({
        id: rating.id,
        fromUserId: rating.fromUserId!,
        toUserId: rating.toUserId!,
        rating: rating.rating,
        comment: rating.comment,
        serviceType: rating.serviceType as ServiceType,
        bookingId: rating.bookingId,
        createdAt: rating.createdAt!,
        updatedAt: rating.createdAt!,
        otherUser: rating.otherUser as User,
      })) as Rating[];
    } catch (error) {
      console.error('Error fetching ratings by user:', error);
      return [];
    }
  }

  async updateUserRatingAverage(userId: string): Promise<void> {
    try {
      // Calculate average rating for the user
      const [avgResult] = await db
        .select({
          avg: sql`AVG(${ratings.rating})`,
          count: sql`COUNT(${ratings.rating})`,
        })
        .from(ratings)
        .where(eq(ratings.toUserId, userId));

      const averageRating = Number(avgResult.avg) || 0;
      const totalReviews = Number(avgResult.count) || 0;

      // Update user's rating and review count
      await db
        .update(users)
        .set({
          rating: averageRating.toFixed(2),
          totalReviews,
        })
        .where(eq(users.id, userId));
    } catch (error) {
      console.error('Error updating user rating average:', error);
      throw new Error('Failed to update user rating average');
    }
  }

  // ===== SERVICE RATINGS =====
  
  async getRatingsForService(serviceId: string, serviceType: ServiceType): Promise<Rating[]> {
    try {
      // Since we don't have a direct serviceId field, we'll use bookingId as a proxy
      const ratingList = await db
        .select({
          id: ratings.id,
          fromUserId: ratings.fromUserId,
          toUserId: ratings.toUserId,
          rating: ratings.rating,
          comment: ratings.comment,
          serviceType: ratings.serviceType,
          bookingId: ratings.bookingId,
          createdAt: ratings.createdAt,
          // From user info
          fromUser: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          },
        })
        .from(ratings)
        .leftJoin(users, eq(ratings.fromUserId, users.id))
        .where(and(
          eq(ratings.serviceType, serviceType),
          eq(ratings.bookingId, serviceId)
        ))
        .orderBy(desc(ratings.createdAt));

      return ratingList.map(rating => ({
        id: rating.id,
        fromUserId: rating.fromUserId!,
        toUserId: rating.toUserId!,
        rating: rating.rating,
        comment: rating.comment,
        serviceType: rating.serviceType as ServiceType,
        bookingId: rating.bookingId,
        serviceId,
        createdAt: rating.createdAt!,
        updatedAt: rating.createdAt!,
        fromUser: rating.fromUser as User,
      })) as Rating[];
    } catch (error) {
      console.error('Error fetching ratings for service:', error);
      return [];
    }
  }

  async getAverageRating(targetId: string, serviceType: ServiceType): Promise<number> {
    try {
      const [avgResult] = await db
        .select({ avg: sql`AVG(${ratings.rating})` })
        .from(ratings)
        .where(and(
          eq(ratings.toUserId, targetId),
          eq(ratings.serviceType, serviceType)
        ));

      return Number(avgResult.avg) || 0;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return 0;
    }
  }

  // ===== RATING MANAGEMENT =====
  
  async getRating(ratingId: string): Promise<Rating | undefined> {
    try {
      const [rating] = await db
        .select({
          id: ratings.id,
          fromUserId: ratings.fromUserId,
          toUserId: ratings.toUserId,
          rating: ratings.rating,
          comment: ratings.comment,
          serviceType: ratings.serviceType,
          bookingId: ratings.bookingId,
          createdAt: ratings.createdAt,
          // User info
          fromUser: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
          },
        })
        .from(ratings)
        .leftJoin(users, eq(ratings.fromUserId, users.id))
        .where(eq(ratings.id, ratingId));

      if (!rating) return undefined;

      return {
        id: rating.id,
        fromUserId: rating.fromUserId!,
        toUserId: rating.toUserId!,
        rating: rating.rating,
        comment: rating.comment,
        serviceType: rating.serviceType as ServiceType,
        bookingId: rating.bookingId,
        createdAt: rating.createdAt!,
        updatedAt: rating.createdAt!,
        fromUser: rating.fromUser as User,
      } as Rating;
    } catch (error) {
      console.error('Error fetching rating:', error);
      return undefined;
    }
  }

  async deleteRating(ratingId: string): Promise<void> {
    try {
      const rating = await this.getRating(ratingId);
      if (!rating) throw new Error('Rating not found');

      await db.delete(ratings).where(eq(ratings.id, ratingId));
      
      // Update the target user's average rating
      await this.updateUserRatingAverage(rating.toUserId);
    } catch (error) {
      console.error('Error deleting rating:', error);
      throw new Error('Failed to delete rating');
    }
  }

  // ===== MODERATION =====
  
  async flagInappropriateRating(ratingId: string, reason: string): Promise<void> {
    try {
      // TODO: Implement when moderation table is added to schema
      console.log(`Rating ${ratingId} flagged for: ${reason}`);
    } catch (error) {
      console.error('Error flagging rating:', error);
      throw new Error('Failed to flag rating');
    }
  }

  async moderateRating(ratingId: string, action: ModerationAction): Promise<Rating> {
    try {
      const rating = await this.getRating(ratingId);
      if (!rating) throw new Error('Rating not found');

      // TODO: Implement moderation actions when moderation table is added
      console.log(`Moderating rating ${ratingId} with action:`, action);
      
      if (action.action === 'remove') {
        await this.deleteRating(ratingId);
      }

      return rating;
    } catch (error) {
      console.error('Error moderating rating:', error);
      throw error;
    }
  }

  // ===== ANALYTICS =====
  
  async getRatingStatistics(userId?: string): Promise<{
    totalRatings: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      const baseCondition = userId ? eq(ratings.toUserId, userId) : sql`1=1`;

      const [totalResult] = await db
        .select({
          count: sql`count(*)`,
          avg: sql`AVG(${ratings.rating})`,
        })
        .from(ratings)
        .where(baseCondition);

      // Get rating distribution
      const distributionData = await db
        .select({
          rating: ratings.rating,
          count: sql`count(*)`,
        })
        .from(ratings)
        .where(baseCondition)
        .groupBy(ratings.rating);

      const ratingDistribution: { [key: number]: number } = {};
      for (let i = 1; i <= 5; i++) {
        ratingDistribution[i] = 0;
      }

      distributionData.forEach(item => {
        ratingDistribution[item.rating] = Number(item.count);
      });

      return {
        totalRatings: Number(totalResult.count),
        averageRating: Number(totalResult.avg) || 0,
        ratingDistribution,
      };
    } catch (error) {
      console.error('Error fetching rating statistics:', error);
      return {
        totalRatings: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }
  }

  // ===== UTILITY METHODS =====
  
  async hasUserRatedService(fromUserId: string, toUserId: string, serviceType: ServiceType, bookingId?: string): Promise<boolean> {
    try {
      const conditions = [
        eq(ratings.fromUserId, fromUserId),
        eq(ratings.toUserId, toUserId),
        eq(ratings.serviceType, serviceType),
      ];

      if (bookingId) {
        conditions.push(eq(ratings.bookingId, bookingId));
      }

      const [result] = await db
        .select({ count: sql`count(*)` })
        .from(ratings)
        .where(and(...conditions));

      return Number(result.count) > 0;
    } catch (error) {
      console.error('Error checking if user rated service:', error);
      return false;
    }
  }

  async getTopRatedUsers(serviceType: ServiceType, limit: number = 10): Promise<User[]> {
    try {
      const topUsers = await db
        .select({
          userId: ratings.toUserId,
          avgRating: sql`AVG(${ratings.rating})`,
          totalRatings: sql`COUNT(${ratings.rating})`,
          user: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
          },
        })
        .from(ratings)
        .leftJoin(users, eq(ratings.toUserId, users.id))
        .where(eq(ratings.serviceType, serviceType))
        .groupBy(ratings.toUserId, users.id)
        .having(sql`COUNT(${ratings.rating}) >= 5`) // Minimum 5 ratings
        .orderBy(desc(sql`AVG(${ratings.rating})`))
        .limit(limit);

      return topUsers.map(item => item.user as User);
    } catch (error) {
      console.error('Error fetching top rated users:', error);
      return [];
    }
  }
}

export const ratingStorage = new DatabaseRatingStorage();