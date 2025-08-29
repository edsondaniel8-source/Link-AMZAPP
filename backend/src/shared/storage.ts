// Tipos simplificados para desenvolvimento
export interface User {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: string;
  profileImageUrl: string | null;
  isVerified?: boolean;
  registrationCompleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpsertUser {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  userType?: string;
  profileImageUrl?: string | null;
  isVerified?: boolean;
  registrationCompleted?: boolean;
}

// Storage em memória para desenvolvimento
const memoryUsers = new Map<string, User>();

export interface IStorage {
  // User operations essenciais
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRoles(id: string, roles: string[]): Promise<User>;
}

export class MemoryStorage implements IStorage {
  // User operations (IMPORTANT: these user operations are mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    return memoryUsers.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = memoryUsers.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || existingUser?.email || null,
      firstName: userData.firstName || existingUser?.firstName || null,
      lastName: userData.lastName || existingUser?.lastName || null,
      userType: userData.userType || existingUser?.userType || 'user',
      profileImageUrl: userData.profileImageUrl || existingUser?.profileImageUrl || null,
      isVerified: userData.isVerified || existingUser?.isVerified || false,
      registrationCompleted: userData.registrationCompleted || existingUser?.registrationCompleted || false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date()
    };
    
    memoryUsers.set(userData.id, user);
    return user;
  }

  async updateUserRoles(id: string, roles: string[]): Promise<User> {
    const existingUser = await this.getUser(id);
    
    if (!existingUser) {
      throw new Error(`User with id ${id} not found`);
    }
    
    // Atualizar o userType com o primeiro role
    const primaryRole = roles.length > 0 ? roles[0] : 'user';
    
    const updatedUser = await this.upsertUser({
      id,
      userType: primaryRole,
      registrationCompleted: true
    });
    
    return updatedUser;
  }
}

export const storage = new MemoryStorage();