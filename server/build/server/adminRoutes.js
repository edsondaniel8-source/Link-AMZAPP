import { Router } from "express";
const router = Router();
// Get all users for admin management
router.get("/users", async (req, res) => {
    try {
        const { search, status, userType, page = 1, limit = 20 } = req.query;
        // Mock data for demonstration
        const mockUsers = [
            {
                id: "u1",
                username: "joao_silva",
                firstName: "João",
                lastName: "Silva",
                email: "joao@email.com",
                userType: "driver",
                rating: "4.80",
                totalReviews: 245,
                isVerified: true,
                isBlocked: false,
                createdAt: new Date("2023-01-15"),
            },
            {
                id: "u2",
                username: "maria_santos",
                firstName: "Maria",
                lastName: "Santos",
                email: "maria@email.com",
                userType: "host",
                rating: "4.20",
                totalReviews: 89,
                isVerified: false,
                isBlocked: false,
                createdAt: new Date("2023-03-22"),
            },
            {
                id: "u3",
                username: "pedro_machado",
                firstName: "Pedro",
                lastName: "Machado",
                email: "pedro@email.com",
                userType: "user",
                rating: "3.80",
                totalReviews: 12,
                isVerified: true,
                isBlocked: true,
                createdAt: new Date("2023-06-10"),
            }
        ];
        // Apply filters to mock data
        let filteredUsers = mockUsers;
        if (search) {
            const searchTerm = search.toLowerCase();
            filteredUsers = filteredUsers.filter(user => user.firstName.toLowerCase().includes(searchTerm) ||
                user.lastName.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm));
        }
        if (userType && userType !== 'all') {
            filteredUsers = filteredUsers.filter(user => user.userType === userType);
        }
        if (status && status !== 'all') {
            if (status === 'blocked') {
                filteredUsers = filteredUsers.filter(user => user.isBlocked);
            }
            else if (status === 'active') {
                filteredUsers = filteredUsers.filter(user => !user.isBlocked);
            }
        }
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
        res.json({
            users: paginatedUsers,
            total: filteredUsers.length,
            page: Number(page),
            totalPages: Math.ceil(filteredUsers.length / Number(limit))
        });
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
// Apply admin action to user
router.post("/users/:userId/actions", async (req, res) => {
    try {
        const { userId } = req.params;
        const { action, reason, duration, notes, adminId } = req.body;
        if (!action || !reason) {
            return res.status(400).json({ error: "Action and reason are required" });
        }
        // Mock admin action creation
        const adminAction = {
            id: `action-${Date.now()}`,
            adminId: adminId || "admin-1",
            targetUserId: userId,
            action,
            reason,
            duration: duration ? Number(duration) : null,
            notes,
            isActive: true,
            createdAt: new Date(),
        };
        // In real implementation, this would update the user in the database
        console.log(`Admin action applied: ${action} to user ${userId} for reason: ${reason}`);
        res.json({ success: true, adminAction });
    }
    catch (error) {
        console.error("Error applying admin action:", error);
        res.status(500).json({ error: "Failed to apply admin action" });
    }
});
// Get user's admin action history
router.get("/users/:userId/actions", async (req, res) => {
    try {
        const { userId } = req.params;
        // Mock action history
        const actions = [
            {
                id: "action-1",
                adminId: "admin-1",
                targetUserId: userId,
                action: "warning",
                reason: "Late cancellation",
                createdAt: new Date("2024-08-15"),
                isActive: true
            }
        ];
        res.json(actions);
    }
    catch (error) {
        console.error("Error fetching user actions:", error);
        res.status(500).json({ error: "Failed to fetch user actions" });
    }
});
// Get all price regulations
router.get("/price-regulations", async (req, res) => {
    try {
        // Mock price regulations
        const regulations = [
            {
                id: "p1",
                rideType: "Economy",
                minPricePerKm: "15.00",
                maxPricePerKm: "25.00",
                baseFare: "50.00",
                isActive: true,
                createdAt: new Date("2024-08-01"),
                updatedAt: new Date("2024-08-20")
            },
            {
                id: "p2",
                rideType: "Comfort",
                minPricePerKm: "20.00",
                maxPricePerKm: "35.00",
                baseFare: "75.00",
                isActive: true,
                createdAt: new Date("2024-08-01"),
                updatedAt: new Date("2024-08-20")
            },
            {
                id: "p3",
                rideType: "Premium",
                minPricePerKm: "30.00",
                maxPricePerKm: "50.00",
                baseFare: "100.00",
                isActive: true,
                createdAt: new Date("2024-08-01"),
                updatedAt: new Date("2024-08-20")
            }
        ];
        res.json(regulations);
    }
    catch (error) {
        console.error("Error fetching price regulations:", error);
        res.status(500).json({ error: "Failed to fetch price regulations" });
    }
});
// Update price regulation
router.put("/price-regulations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // Convert price values to proper format if needed
        if (updates.minPricePerKm) {
            updates.minPricePerKm = Number(updates.minPricePerKm);
        }
        if (updates.maxPricePerKm) {
            updates.maxPricePerKm = Number(updates.maxPricePerKm);
        }
        if (updates.baseFare) {
            updates.baseFare = Number(updates.baseFare);
        }
        updates.updatedAt = new Date();
        // Mock update
        const updatedRegulation = {
            id,
            ...updates,
            updatedAt: new Date()
        };
        console.log(`Price regulation ${id} updated:`, updates);
        res.json(updatedRegulation);
    }
    catch (error) {
        console.error("Error updating price regulation:", error);
        res.status(500).json({ error: "Failed to update price regulation" });
    }
});
// Create new price regulation
router.post("/price-regulations", async (req, res) => {
    try {
        const { rideType, minPricePerKm, maxPricePerKm, baseFare, isActive = true } = req.body;
        if (!rideType || !minPricePerKm || !maxPricePerKm || !baseFare) {
            return res.status(400).json({ error: "All price fields are required" });
        }
        // Mock creation
        const newRegulation = {
            id: `p-${Date.now()}`,
            rideType,
            minPricePerKm: String(minPricePerKm),
            maxPricePerKm: String(maxPricePerKm),
            baseFare: String(baseFare),
            isActive,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        res.json(newRegulation);
    }
    catch (error) {
        console.error("Error creating price regulation:", error);
        res.status(500).json({ error: "Failed to create price regulation" });
    }
});
// Get admin dashboard stats
router.get("/stats", async (req, res) => {
    try {
        // Mock stats from sample data
        const mockUsers = [
            { isBlocked: false, isVerified: true, userType: "driver" },
            { isBlocked: false, isVerified: false, userType: "host" },
            { isBlocked: true, isVerified: true, userType: "user" },
        ];
        const totalUsers = mockUsers;
        const blockedUsers = totalUsers.filter(user => user.isBlocked);
        const verifiedUsers = totalUsers.filter(user => user.isVerified);
        const recentActions = [];
        const stats = {
            totalUsers: totalUsers.length,
            activeUsers: totalUsers.length - blockedUsers.length,
            blockedUsers: blockedUsers.length,
            verifiedUsers: verifiedUsers.length,
            recentActions: recentActions.length,
            usersByType: {
                users: totalUsers.filter(u => u.userType === 'user').length,
                drivers: totalUsers.filter(u => u.userType === 'driver').length,
                hosts: totalUsers.filter(u => u.userType === 'host').length,
                restaurants: totalUsers.filter(u => u.userType === 'restaurant').length,
            }
        };
        res.json(stats);
    }
    catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ error: "Failed to fetch admin stats" });
    }
});
export default router;
