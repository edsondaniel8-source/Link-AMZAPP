import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';
import { db } from '../../db';
import { users, rides, accommodations, bookings, ratings } from '../../shared/schema';
import { 
  AnalyticsData,
  TimePeriod,
  DateRange 
} from '../types';

export interface IAnalyticsStorage {
  // User analytics
  getUserMetrics(dateRange?: DateRange): Promise<{
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    verifiedUsers: number;
    usersByRole: { [role: string]: number };
  }>;
  
  // Business analytics
  getBusinessMetrics(dateRange?: DateRange): Promise<{
    totalRides: number;
    totalAccommodations: number;
    totalBookings: number;
    totalRevenue: number;
    conversionRate: number;
  }>;
  
  // Performance analytics
  getPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    systemUptime: number;
    errorRate: number;
  }>;
  
  // Geographic analytics
  getGeographicData(): Promise<{
    topCities: Array<{ city: string; count: number }>;
    ridesByLocation: Array<{ location: string; rides: number }>;
  }>;
  
  // Revenue analytics
  getRevenueAnalytics(period: TimePeriod): Promise<{
    totalRevenue: number;
    revenueByService: { [service: string]: number };
    monthlyTrend: Array<{ month: string; revenue: number }>;
  }>;
  
  // Growth analytics
  getGrowthMetrics(period: TimePeriod): Promise<{
    userGrowthRate: number;
    bookingGrowthRate: number;
    revenueGrowthRate: number;
  }>;
}

export class DatabaseAnalyticsStorage implements IAnalyticsStorage {
  
  // ===== USER ANALYTICS =====
  
  async getUserMetrics(dateRange?: DateRange): Promise<{
    totalUsers: number;
    activeUsers: number;
    newRegistrations: number;
    verifiedUsers: number;
    usersByRole: { [role: string]: number };
  }> {
    try {
      // Total users
      const [totalUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users);

      // Verified users
      const [verifiedUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(eq(users.isVerified, true));

      // New registrations in date range
      let newRegistrationsQuery = db
        .select({ count: sql`count(*)` })
        .from(users);

      if (dateRange) {
        newRegistrationsQuery = newRegistrationsQuery.where(and(
          gte(users.createdAt, dateRange.from),
          lte(users.createdAt, dateRange.to)
        ));
      } else {
        // Default to last 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        newRegistrationsQuery = newRegistrationsQuery.where(
          gte(users.createdAt, thirtyDaysAgo)
        );
      }

      const [newRegistrations] = await newRegistrationsQuery;

      // Active users (users with bookings in the last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const [activeUsers] = await db
        .select({ count: sql`count(DISTINCT ${bookings.passengerId})` })
        .from(bookings)
        .where(gte(bookings.createdAt, thirtyDaysAgo));

      // Users by role
      const roleData = await db
        .select({
          userType: users.userType,
          count: sql`count(*)`,
        })
        .from(users)
        .groupBy(users.userType);

      const usersByRole: { [role: string]: number } = {};
      roleData.forEach(item => {
        if (item.userType) {
          usersByRole[item.userType] = Number(item.count);
        }
      });

      return {
        totalUsers: Number(totalUsers.count),
        activeUsers: Number(activeUsers.count),
        newRegistrations: Number(newRegistrations.count),
        verifiedUsers: Number(verifiedUsers.count),
        usersByRole,
      };
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newRegistrations: 0,
        verifiedUsers: 0,
        usersByRole: {},
      };
    }
  }

  // ===== BUSINESS ANALYTICS =====
  
  async getBusinessMetrics(dateRange?: DateRange): Promise<{
    totalRides: number;
    totalAccommodations: number;
    totalBookings: number;
    totalRevenue: number;
    conversionRate: number;
  }> {
    try {
      // Total rides
      const [totalRides] = await db
        .select({ count: sql`count(*)` })
        .from(rides);

      // Total accommodations
      const [totalAccommodations] = await db
        .select({ count: sql`count(*)` })
        .from(accommodations);

      // Total bookings
      let bookingsQuery = db
        .select({ 
          count: sql`count(*)`,
          revenue: sql`SUM(CAST(${bookings.totalPrice} AS DECIMAL))`,
        })
        .from(bookings);

      if (dateRange) {
        bookingsQuery = bookingsQuery.where(and(
          gte(bookings.createdAt, dateRange.from),
          lte(bookings.createdAt, dateRange.to)
        ));
      }

      const [bookingData] = await bookingsQuery;

      // Calculate conversion rate (bookings vs rides created)
      const [rideViews] = await db
        .select({ count: sql`count(*)` })
        .from(rides)
        .where(dateRange ? and(
          gte(rides.createdAt, dateRange.from),
          lte(rides.createdAt, dateRange.to)
        ) : sql`1=1`);

      const conversionRate = Number(rideViews.count) > 0 
        ? (Number(bookingData.count) / Number(rideViews.count)) * 100 
        : 0;

      return {
        totalRides: Number(totalRides.count),
        totalAccommodations: Number(totalAccommodations.count),
        totalBookings: Number(bookingData.count),
        totalRevenue: Number(bookingData.revenue) || 0,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    } catch (error) {
      console.error('Error fetching business metrics:', error);
      return {
        totalRides: 0,
        totalAccommodations: 0,
        totalBookings: 0,
        totalRevenue: 0,
        conversionRate: 0,
      };
    }
  }

  // ===== PERFORMANCE ANALYTICS =====
  
  async getPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    systemUptime: number;
    errorRate: number;
  }> {
    try {
      // These would typically come from monitoring systems
      // For now, return mock data
      return {
        averageResponseTime: 150, // ms
        systemUptime: 99.9, // percentage
        errorRate: 0.1, // percentage
      };
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      return {
        averageResponseTime: 0,
        systemUptime: 0,
        errorRate: 0,
      };
    }
  }

  // ===== GEOGRAPHIC ANALYTICS =====
  
  async getGeographicData(): Promise<{
    topCities: Array<{ city: string; count: number }>;
    ridesByLocation: Array<{ location: string; rides: number }>;
  }> {
    try {
      // Top cities by ride origin
      const topCities = await db
        .select({
          city: rides.fromLocation,
          count: sql`count(*)`,
        })
        .from(rides)
        .groupBy(rides.fromLocation)
        .orderBy(desc(sql`count(*)`))
        .limit(10);

      // Rides by location
      const ridesByLocation = await db
        .select({
          location: rides.fromLocation,
          rides: sql`count(*)`,
        })
        .from(rides)
        .groupBy(rides.fromLocation)
        .orderBy(desc(sql`count(*)`));

      return {
        topCities: topCities.map(item => ({
          city: item.city,
          count: Number(item.count),
        })),
        ridesByLocation: ridesByLocation.map(item => ({
          location: item.location,
          rides: Number(item.rides),
        })),
      };
    } catch (error) {
      console.error('Error fetching geographic data:', error);
      return {
        topCities: [],
        ridesByLocation: [],
      };
    }
  }

  // ===== REVENUE ANALYTICS =====
  
  async getRevenueAnalytics(period: TimePeriod): Promise<{
    totalRevenue: number;
    revenueByService: { [service: string]: number };
    monthlyTrend: Array<{ month: string; revenue: number }>;
  }> {
    try {
      // Total revenue in period
      const [totalRevenue] = await db
        .select({ revenue: sql`SUM(CAST(${bookings.totalPrice} AS DECIMAL))` })
        .from(bookings)
        .where(and(
          eq(bookings.status, 'completed'),
          gte(bookings.createdAt, period.startDate),
          lte(bookings.createdAt, period.endDate)
        ));

      // Revenue by service (for now, all bookings are rides)
      const revenueByService = {
        rides: Number(totalRevenue.revenue) || 0,
        accommodations: 0,
        events: 0,
      };

      // Monthly trend
      const monthlyTrend: Array<{ month: string; revenue: number }> = [];
      const months = this.getMonthsBetween(period.startDate, period.endDate);

      for (const month of months) {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const [monthRevenue] = await db
          .select({ revenue: sql`SUM(CAST(${bookings.totalPrice} AS DECIMAL))` })
          .from(bookings)
          .where(and(
            eq(bookings.status, 'completed'),
            gte(bookings.createdAt, startOfMonth),
            lte(bookings.createdAt, endOfMonth)
          ));

        monthlyTrend.push({
          month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
          revenue: Number(monthRevenue.revenue) || 0,
        });
      }

      return {
        totalRevenue: Number(totalRevenue.revenue) || 0,
        revenueByService,
        monthlyTrend,
      };
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return {
        totalRevenue: 0,
        revenueByService: { rides: 0, accommodations: 0, events: 0 },
        monthlyTrend: [],
      };
    }
  }

  // ===== GROWTH ANALYTICS =====
  
  async getGrowthMetrics(period: TimePeriod): Promise<{
    userGrowthRate: number;
    bookingGrowthRate: number;
    revenueGrowthRate: number;
  }> {
    try {
      const periodDays = Math.ceil((period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const previousPeriodStart = new Date(period.startDate.getTime() - periodDays * 24 * 60 * 60 * 1000);
      const previousPeriodEnd = period.startDate;

      // User growth
      const [currentUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(and(
          gte(users.createdAt, period.startDate),
          lte(users.createdAt, period.endDate)
        ));

      const [previousUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(and(
          gte(users.createdAt, previousPeriodStart),
          lte(users.createdAt, previousPeriodEnd)
        ));

      const userGrowthRate = Number(previousUsers.count) > 0
        ? ((Number(currentUsers.count) - Number(previousUsers.count)) / Number(previousUsers.count)) * 100
        : 0;

      // Booking growth
      const [currentBookings] = await db
        .select({ count: sql`count(*)` })
        .from(bookings)
        .where(and(
          gte(bookings.createdAt, period.startDate),
          lte(bookings.createdAt, period.endDate)
        ));

      const [previousBookings] = await db
        .select({ count: sql`count(*)` })
        .from(bookings)
        .where(and(
          gte(bookings.createdAt, previousPeriodStart),
          lte(bookings.createdAt, previousPeriodEnd)
        ));

      const bookingGrowthRate = Number(previousBookings.count) > 0
        ? ((Number(currentBookings.count) - Number(previousBookings.count)) / Number(previousBookings.count)) * 100
        : 0;

      // Revenue growth
      const [currentRevenue] = await db
        .select({ revenue: sql`SUM(CAST(${bookings.totalPrice} AS DECIMAL))` })
        .from(bookings)
        .where(and(
          eq(bookings.status, 'completed'),
          gte(bookings.createdAt, period.startDate),
          lte(bookings.createdAt, period.endDate)
        ));

      const [previousRevenue] = await db
        .select({ revenue: sql`SUM(CAST(${bookings.totalPrice} AS DECIMAL))` })
        .from(bookings)
        .where(and(
          eq(bookings.status, 'completed'),
          gte(bookings.createdAt, previousPeriodStart),
          lte(bookings.createdAt, previousPeriodEnd)
        ));

      const revenueGrowthRate = Number(previousRevenue.revenue) > 0
        ? ((Number(currentRevenue.revenue) - Number(previousRevenue.revenue)) / Number(previousRevenue.revenue)) * 100
        : 0;

      return {
        userGrowthRate: Math.round(userGrowthRate * 100) / 100,
        bookingGrowthRate: Math.round(bookingGrowthRate * 100) / 100,
        revenueGrowthRate: Math.round(revenueGrowthRate * 100) / 100,
      };
    } catch (error) {
      console.error('Error calculating growth metrics:', error);
      return {
        userGrowthRate: 0,
        bookingGrowthRate: 0,
        revenueGrowthRate: 0,
      };
    }
  }

  // ===== COMPREHENSIVE ANALYTICS =====
  
  async getComprehensiveAnalytics(dateRange?: DateRange): Promise<AnalyticsData> {
    try {
      const userMetrics = await this.getUserMetrics(dateRange);
      const businessMetrics = await this.getBusinessMetrics(dateRange);
      const performanceMetrics = await this.getPerformanceMetrics();

      return {
        userMetrics,
        businessMetrics,
        performanceMetrics,
      };
    } catch (error) {
      console.error('Error fetching comprehensive analytics:', error);
      return {
        userMetrics: {
          totalUsers: 0,
          activeUsers: 0,
          newRegistrations: 0,
          verifiedUsers: 0,
        },
        businessMetrics: {
          totalRides: 0,
          totalAccommodations: 0,
          totalBookings: 0,
          totalRevenue: 0,
        },
        performanceMetrics: {
          averageResponseTime: 0,
          systemUptime: 0,
          errorRate: 0,
        },
      };
    }
  }

  // ===== UTILITY METHODS =====
  
  private getMonthsBetween(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  async getPopularRoutes(limit: number = 10): Promise<Array<{ route: string; count: number }>> {
    try {
      const routes = await db
        .select({
          route: sql`${rides.fromLocation} || ' → ' || ${rides.toLocation}`,
          count: sql`count(*)`,
        })
        .from(rides)
        .groupBy(rides.fromLocation, rides.toLocation)
        .orderBy(desc(sql`count(*)`))
        .limit(limit);

      return routes.map(item => ({
        route: item.route as string,
        count: Number(item.count),
      }));
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      return [];
    }
  }

  async getUserRetentionRate(days: number = 30): Promise<number> {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      // Users who registered in the period
      const [newUsers] = await db
        .select({ count: sql`count(*)` })
        .from(users)
        .where(gte(users.createdAt, startDate));

      // Users who made a booking after registration
      const [activeUsers] = await db
        .select({ count: sql`count(DISTINCT ${users.id})` })
        .from(users)
        .leftJoin(bookings, eq(users.id, bookings.passengerId))
        .where(and(
          gte(users.createdAt, startDate),
          sql`${bookings.createdAt} > ${users.createdAt}`
        ));

      return Number(newUsers.count) > 0
        ? (Number(activeUsers.count) / Number(newUsers.count)) * 100
        : 0;
    } catch (error) {
      console.error('Error calculating user retention rate:', error);
      return 0;
    }
  }
}

export const analyticsStorage = new DatabaseAnalyticsStorage();