import { Router } from "express";
const router = Router();
// Process payment
router.post("/process", async (req, res) => {
    try {
        const { bookingId, serviceType, subtotal, platformFee, total, paymentMethod, cardDetails, mpesaNumber, bankAccount, } = req.body;
        // Validate required fields
        if (!bookingId || !serviceType || !subtotal || !paymentMethod) {
            return res.status(400).json({
                error: "Missing required payment information"
            });
        }
        // Mock payment processing
        const paymentReference = `PAY_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        // Simulate payment processing based on method
        let paymentStatus = "completed";
        let processingMessage = "";
        switch (paymentMethod) {
            case "card":
                if (!cardDetails?.number || !cardDetails?.cvv) {
                    return res.status(400).json({ error: "Invalid card details" });
                }
                processingMessage = "Card payment processed successfully";
                break;
            case "mpesa":
                if (!mpesaNumber) {
                    return res.status(400).json({ error: "M-Pesa number required" });
                }
                processingMessage = "M-Pesa payment initiated. Please check your phone for confirmation.";
                break;
            case "bank":
                if (!bankAccount) {
                    return res.status(400).json({ error: "Bank account details required" });
                }
                paymentStatus = "pending";
                processingMessage = "Bank transfer initiated. Payment will be processed within 1-3 business days.";
                break;
            default:
                return res.status(400).json({ error: "Invalid payment method" });
        }
        // Mock transaction creation
        const transaction = {
            id: `trans_${Date.now()}`,
            bookingId,
            userId: "user_123", // Would get from session in real app
            serviceType,
            subtotal: Number(subtotal),
            platformFee: Number(platformFee),
            total: Number(total),
            paymentMethod,
            paymentStatus,
            paymentReference,
            paidAt: paymentStatus === "completed" ? new Date() : null,
            createdAt: new Date(),
        };
        console.log("Payment processed:", transaction);
        res.json({
            success: true,
            transaction,
            message: processingMessage,
        });
    }
    catch (error) {
        console.error("Payment processing error:", error);
        res.status(500).json({
            error: "Failed to process payment"
        });
    }
});
// Get payment methods for user
router.get("/methods", async (req, res) => {
    try {
        // Mock payment methods
        const paymentMethods = [
            {
                id: "pm_1",
                type: "card",
                cardLast4: "1234",
                cardBrand: "visa",
                isDefault: true,
                isActive: true,
            },
            {
                id: "pm_2",
                type: "mpesa",
                mpesaNumber: "+258 84 ***4567",
                isDefault: false,
                isActive: true,
            },
        ];
        res.json(paymentMethods);
    }
    catch (error) {
        console.error("Error fetching payment methods:", error);
        res.status(500).json({
            error: "Failed to fetch payment methods"
        });
    }
});
// Get transaction history
router.get("/transactions", async (req, res) => {
    try {
        const { page = 1, limit = 20, serviceType } = req.query;
        // Mock transaction history
        const transactions = [
            {
                id: "trans_1",
                bookingId: "booking_1",
                serviceType: "ride",
                serviceName: "Maputo → Matola",
                subtotal: 15000, // 150.00 MZN
                platformFee: 1500, // 15.00 MZN  
                total: 16500, // 165.00 MZN
                paymentMethod: "card",
                paymentStatus: "completed",
                paidAt: new Date("2024-08-20"),
                createdAt: new Date("2024-08-20"),
            },
            {
                id: "trans_2",
                bookingId: "booking_2",
                serviceType: "accommodation",
                serviceName: "Hotel Costa do Sol - 2 noites",
                subtotal: 80000, // 800.00 MZN
                platformFee: 8000, // 80.00 MZN
                total: 88000, // 880.00 MZN
                paymentMethod: "mpesa",
                paymentStatus: "completed",
                paidAt: new Date("2024-08-18"),
                createdAt: new Date("2024-08-18"),
            },
        ];
        // Apply filters
        let filteredTransactions = transactions;
        if (serviceType && serviceType !== 'all') {
            filteredTransactions = transactions.filter(t => t.serviceType === serviceType);
        }
        // Pagination
        const startIndex = (Number(page) - 1) * Number(limit);
        const endIndex = startIndex + Number(limit);
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);
        res.json({
            transactions: paginatedTransactions,
            total: filteredTransactions.length,
            page: Number(page),
            totalPages: Math.ceil(filteredTransactions.length / Number(limit)),
        });
    }
    catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            error: "Failed to fetch transactions"
        });
    }
});
// Refund transaction
router.post("/refund", async (req, res) => {
    try {
        const { transactionId, reason } = req.body;
        if (!transactionId || !reason) {
            return res.status(400).json({
                error: "Transaction ID and reason are required"
            });
        }
        // Mock refund processing
        const refund = {
            id: `refund_${Date.now()}`,
            transactionId,
            reason,
            status: "processing",
            refundedAt: null,
            createdAt: new Date(),
        };
        console.log("Refund initiated:", refund);
        res.json({
            success: true,
            refund,
            message: "Refund request has been initiated and will be processed within 3-5 business days.",
        });
    }
    catch (error) {
        console.error("Refund processing error:", error);
        res.status(500).json({
            error: "Failed to process refund"
        });
    }
});
export default router;
