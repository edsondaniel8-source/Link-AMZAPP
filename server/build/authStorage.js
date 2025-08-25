import { users, } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
export class DatabaseAuthStorage {
    async getUser(id) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }
    async getUserByFirebaseUid(firebaseUid) {
        const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
        return user;
    }
    async createUser(userData) {
        const [user] = await db
            .insert(users)
            .values(userData)
            .returning();
        return user;
    }
    async upsertUser(userData) {
        const [user] = await db
            .insert(users)
            .values(userData)
            .onConflictDoUpdate({
            target: users.id,
            set: {
                ...userData,
                updatedAt: new Date(),
            },
        })
            .returning();
        return user;
    }
}
export const authStorage = new DatabaseAuthStorage();
//# sourceMappingURL=authStorage.js.map