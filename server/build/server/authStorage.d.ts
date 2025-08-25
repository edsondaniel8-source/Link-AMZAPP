import { type User, type UpsertUser } from "@shared/schema";
export interface IAuthStorage {
    getUser(id: string): Promise<User | undefined>;
    getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
    createUser(userData: any): Promise<User>;
    upsertUser(user: UpsertUser): Promise<User>;
}
export declare class DatabaseAuthStorage implements IAuthStorage {
    getUser(id: string): Promise<User | undefined>;
    getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
    createUser(userData: any): Promise<User>;
    upsertUser(userData: UpsertUser): Promise<User>;
}
export declare const authStorage: DatabaseAuthStorage;
//# sourceMappingURL=authStorage.d.ts.map