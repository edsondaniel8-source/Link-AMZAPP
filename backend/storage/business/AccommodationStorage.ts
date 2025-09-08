import { eq, and, or, gte, lte, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { accommodations, users } from '../../shared/schema';
import { 
  Accommodation, 
  CreateAccommodationData, 
  UpdateAccommodationData, 
  AccommodationSearchCriteria,
  PartnershipProgram,
  User 
} from '../types';

export interface IAccommodationStorage {
  // Accommodation management
  createAccommodation(data: CreateAccommodationData): Promise<Accommodation>;
  updateAccommodation(id: string, data: UpdateAccommodationData): Promise<Accommodation>;
  deleteAccommodation(id: string): Promise<void>;
  getAccommodation(id: string): Promise<Accommodation | undefined>;
  
  // Search and discovery
  searchAccommodations(criteria: AccommodationSearchCriteria): Promise<Accommodation[]>;
  getAccommodationsByHost(hostId: string): Promise<Accommodation[]>;
  getAvailableAccommodations(checkIn?: Date, checkOut?: Date): Promise<Accommodation[]>;
  getFeaturedAccommodations(limit?: number): Promise<Accommodation[]>;
  
  // Partnership features
  updatePartnershipProgram(id: string, program: PartnershipProgram): Promise<Accommodation>;
  getPartnerAccommodations(): Promise<Accommodation[]>;
  getDriverDiscountEligible(accommodationId: string, driverLevel: string): Promise<boolean>;
  
  // Availability management
  updateAccommodationAvailability(id: string, isAvailable: boolean): Promise<Accommodation>;
  
  // Analytics
  getAccommodationStatistics(hostId?: string): Promise<{
    totalAccommodations: number;
    activeAccommodations: number;
    partnerAccommodations: number;
    averagePrice: number;
  }>;
}

export class DatabaseAccommodationStorage implements IAccommodationStorage {
  
  // ===== ACCOMMODATION MANAGEMENT =====
  
  async createAccommodation(data: CreateAccommodationData): Promise<Accommodation> {
    try {
      const [accommodation] = await db
        .insert(accommodations)
        .values({
          ...data,
          pricePerNight: data.pricePerNight.toString(),
          lat: data.lat?.toString(),
          lng: data.lng?.toString(),
          images: data.images || [],
          amenities: data.amenities || [],
          rating: '0.0',
          reviewCount: 0,
          distanceFromCenter: '0.0',
          isAvailable: true,
          offerDriverDiscounts: data.offerDriverDiscounts || false,
          driverDiscountRate: (data.driverDiscountRate || 10).toString(),
          minimumDriverLevel: 'bronze',
          partnershipBadgeVisible: false,
        })
        .returning();
      
      return accommodation as Accommodation;
    } catch (error) {
      console.error('Error creating accommodation:', error);
      throw new Error('Failed to create accommodation');
    }
  }

  async updateAccommodation(id: string, data: UpdateAccommodationData): Promise<Accommodation> {
    try {
      const updateData: any = { ...data };
      
      if (data.pricePerNight !== undefined) {
        updateData.pricePerNight = data.pricePerNight.toString();
      }
      if (data.driverDiscountRate !== undefined) {
        updateData.driverDiscountRate = data.driverDiscountRate.toString();
      }

      const [accommodation] = await db
        .update(accommodations)
        .set(updateData)
        .where(eq(accommodations.id, id))
        .returning();
      
      return accommodation as Accommodation;
    } catch (error) {
      console.error('Error updating accommodation:', error);
      throw new Error('Failed to update accommodation');
    }
  }

  async deleteAccommodation(id: string): Promise<void> {
    try {
      await db.delete(accommodations).where(eq(accommodations.id, id));
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      throw new Error('Failed to delete accommodation');
    }
  }

  async getAccommodation(id: string): Promise<Accommodation | undefined> {
    try {
      const [accommodation] = await db
        .select({
          id: accommodations.id,
          name: accommodations.name,
          type: accommodations.type,
          hostId: accommodations.hostId,
          address: accommodations.address,
          lat: accommodations.lat,
          lng: accommodations.lng,
          pricePerNight: accommodations.pricePerNight,
          rating: accommodations.rating,
          reviewCount: accommodations.reviewCount,
          images: accommodations.images,
          amenities: accommodations.amenities,
          description: accommodations.description,
          distanceFromCenter: accommodations.distanceFromCenter,
          isAvailable: accommodations.isAvailable,
          offerDriverDiscounts: accommodations.offerDriverDiscounts,
          driverDiscountRate: accommodations.driverDiscountRate,
          minimumDriverLevel: accommodations.minimumDriverLevel,
          partnershipBadgeVisible: accommodations.partnershipBadgeVisible,
          createdAt: sql`NULL`,
          updatedAt: sql`NULL`,
          // Host information
          host: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
            isVerified: users.isVerified,
          },
        })
        .from(accommodations)
        .leftJoin(users, eq(accommodations.hostId, users.id))
        .where(eq(accommodations.id, id));
      
      return accommodation ? {
        ...accommodation,
        host: accommodation.host as User,
      } as Accommodation : undefined;
    } catch (error) {
      console.error('Error fetching accommodation:', error);
      return undefined;
    }
  }

  // ===== SEARCH AND DISCOVERY =====
  
  async searchAccommodations(criteria: AccommodationSearchCriteria): Promise<Accommodation[]> {
    try {
      let query = db
        .select({
          id: accommodations.id,
          name: accommodations.name,
          type: accommodations.type,
          hostId: accommodations.hostId,
          address: accommodations.address,
          lat: accommodations.lat,
          lng: accommodations.lng,
          pricePerNight: accommodations.pricePerNight,
          rating: accommodations.rating,
          reviewCount: accommodations.reviewCount,
          images: accommodations.images,
          amenities: accommodations.amenities,
          description: accommodations.description,
          distanceFromCenter: accommodations.distanceFromCenter,
          isAvailable: accommodations.isAvailable,
          offerDriverDiscounts: accommodations.offerDriverDiscounts,
          driverDiscountRate: accommodations.driverDiscountRate,
          minimumDriverLevel: accommodations.minimumDriverLevel,
          partnershipBadgeVisible: accommodations.partnershipBadgeVisible,
          createdAt: sql`NULL`,
          updatedAt: sql`NULL`,
          host: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
            isVerified: users.isVerified,
          },
        })
        .from(accommodations)
        .leftJoin(users, eq(accommodations.hostId, users.id));

      const conditions = [eq(accommodations.isAvailable, true)];

      if (criteria.location) {
        conditions.push(sql`${accommodations.address} ILIKE ${`%${criteria.location}%`}`);
      }

      if (criteria.type) {
        conditions.push(eq(accommodations.type, criteria.type));
      }

      if (criteria.maxPrice) {
        conditions.push(sql`CAST(${accommodations.pricePerNight} AS DECIMAL) <= ${criteria.maxPrice}`);
      }

      if (criteria.amenities && criteria.amenities.length > 0) {
        conditions.push(sql`${accommodations.amenities} && ${criteria.amenities}`);
      }

      if (criteria.hostId) {
        conditions.push(eq(accommodations.hostId, criteria.hostId));
      }

      const accommodationList = await query
        .where(and(...conditions))
        .orderBy(desc(accommodations.rating))
        .limit(50);

      return accommodationList.map(accommodation => ({
        ...accommodation,
        host: accommodation.host as User,
      })) as Accommodation[];
    } catch (error) {
      console.error('Error searching accommodations:', error);
      return [];
    }
  }

  async getAccommodationsByHost(hostId: string): Promise<Accommodation[]> {
    try {
      const accommodationList = await db
        .select()
        .from(accommodations)
        .where(eq(accommodations.hostId, hostId))
        .orderBy(desc(accommodations.rating));
      
      return accommodationList as Accommodation[];
    } catch (error) {
      console.error('Error fetching accommodations by host:', error);
      return [];
    }
  }

  async getAvailableAccommodations(checkIn?: Date, checkOut?: Date): Promise<Accommodation[]> {
    try {
      // TODO: Implement availability checking with booking dates when booking system is complete
      const accommodationList = await db
        .select({
          id: accommodations.id,
          name: accommodations.name,
          type: accommodations.type,
          hostId: accommodations.hostId,
          address: accommodations.address,
          lat: accommodations.lat,
          lng: accommodations.lng,
          pricePerNight: accommodations.pricePerNight,
          rating: accommodations.rating,
          reviewCount: accommodations.reviewCount,
          images: accommodations.images,
          amenities: accommodations.amenities,
          description: accommodations.description,
          distanceFromCenter: accommodations.distanceFromCenter,
          isAvailable: accommodations.isAvailable,
          offerDriverDiscounts: accommodations.offerDriverDiscounts,
          driverDiscountRate: accommodations.driverDiscountRate,
          minimumDriverLevel: accommodations.minimumDriverLevel,
          partnershipBadgeVisible: accommodations.partnershipBadgeVisible,
          createdAt: sql`NULL`,
          updatedAt: sql`NULL`,
          host: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
            isVerified: users.isVerified,
          },
        })
        .from(accommodations)
        .leftJoin(users, eq(accommodations.hostId, users.id))
        .where(eq(accommodations.isAvailable, true))
        .orderBy(desc(accommodations.rating))
        .limit(100);

      return accommodationList.map(accommodation => ({
        ...accommodation,
        host: accommodation.host as User,
      })) as Accommodation[];
    } catch (error) {
      console.error('Error fetching available accommodations:', error);
      return [];
    }
  }

  async getFeaturedAccommodations(limit: number = 10): Promise<Accommodation[]> {
    try {
      const accommodationList = await db
        .select({
          id: accommodations.id,
          name: accommodations.name,
          type: accommodations.type,
          hostId: accommodations.hostId,
          address: accommodations.address,
          lat: accommodations.lat,
          lng: accommodations.lng,
          pricePerNight: accommodations.pricePerNight,
          rating: accommodations.rating,
          reviewCount: accommodations.reviewCount,
          images: accommodations.images,
          amenities: accommodations.amenities,
          description: accommodations.description,
          distanceFromCenter: accommodations.distanceFromCenter,
          isAvailable: accommodations.isAvailable,
          offerDriverDiscounts: accommodations.offerDriverDiscounts,
          driverDiscountRate: accommodations.driverDiscountRate,
          minimumDriverLevel: accommodations.minimumDriverLevel,
          partnershipBadgeVisible: accommodations.partnershipBadgeVisible,
          createdAt: sql`NULL`,
          updatedAt: sql`NULL`,
          host: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
            isVerified: users.isVerified,
          },
        })
        .from(accommodations)
        .leftJoin(users, eq(accommodations.hostId, users.id))
        .where(and(
          eq(accommodations.isAvailable, true),
          sql`CAST(${accommodations.rating} AS DECIMAL) >= 4.0`
        ))
        .orderBy(desc(accommodations.rating), desc(accommodations.reviewCount))
        .limit(limit);

      return accommodationList.map(accommodation => ({
        ...accommodation,
        host: accommodation.host as User,
      })) as Accommodation[];
    } catch (error) {
      console.error('Error fetching featured accommodations:', error);
      return [];
    }
  }

  // ===== PARTNERSHIP FEATURES =====
  
  async updatePartnershipProgram(id: string, program: PartnershipProgram): Promise<Accommodation> {
    try {
      return this.updateAccommodation(id, {
        offerDriverDiscounts: program.offerDriverDiscounts,
        driverDiscountRate: program.driverDiscountRate,
        partnershipBadgeVisible: program.partnershipBadgeVisible,
      });
    } catch (error) {
      console.error('Error updating partnership program:', error);
      throw error;
    }
  }

  async getPartnerAccommodations(): Promise<Accommodation[]> {
    try {
      const accommodationList = await db
        .select({
          id: accommodations.id,
          name: accommodations.name,
          type: accommodations.type,
          hostId: accommodations.hostId,
          address: accommodations.address,
          lat: accommodations.lat,
          lng: accommodations.lng,
          pricePerNight: accommodations.pricePerNight,
          rating: accommodations.rating,
          reviewCount: accommodations.reviewCount,
          images: accommodations.images,
          amenities: accommodations.amenities,
          description: accommodations.description,
          distanceFromCenter: accommodations.distanceFromCenter,
          isAvailable: accommodations.isAvailable,
          offerDriverDiscounts: accommodations.offerDriverDiscounts,
          driverDiscountRate: accommodations.driverDiscountRate,
          minimumDriverLevel: accommodations.minimumDriverLevel,
          partnershipBadgeVisible: accommodations.partnershipBadgeVisible,
          createdAt: sql`NULL`,
          updatedAt: sql`NULL`,
          host: {
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            profileImageUrl: users.profileImageUrl,
            rating: users.rating,
            totalReviews: users.totalReviews,
            isVerified: users.isVerified,
          },
        })
        .from(accommodations)
        .leftJoin(users, eq(accommodations.hostId, users.id))
        .where(and(
          eq(accommodations.isAvailable, true),
          eq(accommodations.offerDriverDiscounts, true)
        ))
        .orderBy(desc(accommodations.driverDiscountRate));

      return accommodationList.map(accommodation => ({
        ...accommodation,
        host: accommodation.host as User,
      })) as Accommodation[];
    } catch (error) {
      console.error('Error fetching partner accommodations:', error);
      return [];
    }
  }

  async getDriverDiscountEligible(accommodationId: string, driverLevel: string): Promise<boolean> {
    try {
      const accommodation = await this.getAccommodation(accommodationId);
      if (!accommodation || !accommodation.offerDriverDiscounts) return false;

      const levelOrder = ['bronze', 'silver', 'gold', 'platinum'];
      const requiredLevel = levelOrder.indexOf(accommodation.minimumDriverLevel);
      const driverLevelIndex = levelOrder.indexOf(driverLevel);

      return driverLevelIndex >= requiredLevel;
    } catch (error) {
      console.error('Error checking driver discount eligibility:', error);
      return false;
    }
  }

  // ===== AVAILABILITY MANAGEMENT =====
  
  async updateAccommodationAvailability(id: string, isAvailable: boolean): Promise<Accommodation> {
    try {
      return this.updateAccommodation(id, { isAvailable });
    } catch (error) {
      console.error('Error updating accommodation availability:', error);
      throw error;
    }
  }

  // ===== ANALYTICS =====
  
  async getAccommodationStatistics(hostId?: string): Promise<{
    totalAccommodations: number;
    activeAccommodations: number;
    partnerAccommodations: number;
    averagePrice: number;
  }> {
    try {
      const baseCondition = hostId ? eq(accommodations.hostId, hostId) : sql`1=1`;

      const [totalAccommodations] = await db
        .select({ count: sql`count(*)` })
        .from(accommodations)
        .where(baseCondition);

      const [activeAccommodations] = await db
        .select({ count: sql`count(*)` })
        .from(accommodations)
        .where(and(baseCondition, eq(accommodations.isAvailable, true)));

      const [partnerAccommodations] = await db
        .select({ count: sql`count(*)` })
        .from(accommodations)
        .where(and(baseCondition, eq(accommodations.offerDriverDiscounts, true)));

      const [averagePrice] = await db
        .select({ avg: sql`AVG(CAST(${accommodations.pricePerNight} AS DECIMAL))` })
        .from(accommodations)
        .where(baseCondition);

      return {
        totalAccommodations: Number(totalAccommodations.count),
        activeAccommodations: Number(activeAccommodations.count),
        partnerAccommodations: Number(partnerAccommodations.count),
        averagePrice: Number(averagePrice.avg) || 0,
      };
    } catch (error) {
      console.error('Error fetching accommodation statistics:', error);
      return {
        totalAccommodations: 0,
        activeAccommodations: 0,
        partnerAccommodations: 0,
        averagePrice: 0,
      };
    }
  }
}

export const accommodationStorage = new DatabaseAccommodationStorage();