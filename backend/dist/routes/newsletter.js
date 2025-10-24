"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const emailService_1 = __importDefault(require("../services/emailService"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const emailService = new emailService_1.default();
router.post('/subscribe', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });
        if (existingSubscriber) {
            if (existingSubscriber.status === 'active') {
                return res.status(409).json({
                    success: false,
                    message: 'Email is already subscribed to newsletter'
                });
            }
            else {
                const reactivatedSubscriber = await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: {
                        status: 'active',
                        name: name || existingSubscriber.name,
                        subscribedAt: new Date(),
                        unsubscribedAt: null
                    }
                });
                return res.status(201).json({
                    success: true,
                    message: 'Successfully resubscribed to newsletter',
                    data: { subscriber: reactivatedSubscriber }
                });
            }
        }
        const subscriber = await prisma.newsletterSubscriber.create({
            data: {
                email,
                name: name || null,
                status: 'active',
                source: 'website'
            }
        });
        setImmediate(async () => {
            try {
                await emailService.sendWelcomeEmail({
                    email: subscriber.email,
                    name: subscriber.name || 'Subscriber'
                });
                console.log('Welcome email sent to:', subscriber.email);
            }
            catch (emailError) {
                console.error('Failed to send welcome email:', emailError);
            }
        });
        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter',
            data: { subscriber }
        });
    }
    catch (error) {
        console.error('Newsletter subscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/unsubscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });
        if (!subscriber) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in newsletter subscribers'
            });
        }
        if (subscriber.status === 'unsubscribed') {
            return res.status(200).json({
                success: true,
                message: 'Email was already unsubscribed'
            });
        }
        await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
                status: 'unsubscribed',
                unsubscribedAt: new Date()
            }
        });
        return res.status(200).json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
        });
    }
    catch (error) {
        console.error('Newsletter unsubscription error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/status', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }
        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email: email }
        });
        if (!subscriber) {
            return res.status(200).json({
                success: true,
                data: {
                    isSubscribed: false,
                    status: null,
                    subscribedAt: null
                }
            });
        }
        return res.status(200).json({
            success: true,
            data: {
                isSubscribed: subscriber.status === 'active',
                status: subscriber.status,
                subscribedAt: subscriber.subscribedAt
            }
        });
    }
    catch (error) {
        console.error('Newsletter status check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/subscribers', async (req, res) => {
    try {
        const { status = 'all', page = 1, limit = 50 } = req.query;
        const pageNum = parseInt(page);
        const limitNum = Math.min(parseInt(limit), 100);
        const skip = (pageNum - 1) * limitNum;
        const where = status === 'all' ? {} : { status: status };
        const [subscribers, totalCount, activeCount, unsubscribedCount] = await Promise.all([
            prisma.newsletterSubscriber.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { subscribedAt: 'desc' }
            }),
            prisma.newsletterSubscriber.count({ where }),
            prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
            prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } })
        ]);
        return res.status(200).json({
            success: true,
            data: {
                subscribers,
                total: totalCount,
                active: activeCount,
                unsubscribed: unsubscribedCount,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalCount / limitNum)
            }
        });
    }
    catch (error) {
        console.error('Get subscribers error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/stats', async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        const [totalSubscribers, activeSubscribers, unsubscribed, thisMonthSubscriptions, lastMonthSubscriptions] = await Promise.all([
            prisma.newsletterSubscriber.count(),
            prisma.newsletterSubscriber.count({ where: { status: 'active' } }),
            prisma.newsletterSubscriber.count({ where: { status: 'unsubscribed' } }),
            prisma.newsletterSubscriber.count({
                where: {
                    subscribedAt: { gte: startOfMonth }
                }
            }),
            prisma.newsletterSubscriber.count({
                where: {
                    subscribedAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth
                    }
                }
            })
        ]);
        const growthThisMonth = thisMonthSubscriptions;
        const growthRate = lastMonthSubscriptions > 0
            ? ((thisMonthSubscriptions - lastMonthSubscriptions) / lastMonthSubscriptions) * 100
            : 0;
        return res.status(200).json({
            success: true,
            data: {
                totalSubscribers,
                activeSubscribers,
                unsubscribed,
                growthThisMonth,
                growthRate: Math.round(growthRate * 100) / 100
            }
        });
    }
    catch (error) {
        console.error('Get newsletter stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=newsletter.js.map