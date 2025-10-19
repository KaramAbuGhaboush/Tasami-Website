"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, department, location, type } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = { status: 'active' };
        if (department)
            where.department = department;
        if (location)
            where.location = { contains: location };
        if (type)
            where.type = type;
        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.job.count({ where })
        ]);
        return res.json({
            success: true,
            data: {
                jobs,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get jobs error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.get('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id }
        });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        return res.json({
            success: true,
            data: { job }
        });
    }
    catch (error) {
        console.error('Get job error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/applications', async (req, res) => {
    try {
        const { jobId, applicantName, applicantEmail, applicantPhone, applicantLocation, resume, coverLetter } = req.body;
        const job = await prisma.job.findUnique({
            where: { id: jobId }
        });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully'
        });
    }
    catch (error) {
        console.error('Submit application error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.post('/jobs', async (req, res) => {
    try {
        const jobData = req.body;
        const job = await prisma.job.create({
            data: {
                title: jobData.title,
                department: jobData.department,
                location: jobData.location,
                type: jobData.type,
                experience: jobData.experience,
                description: jobData.description,
                requirements: jobData.requirements || [],
                benefits: jobData.benefits || [],
                skills: jobData.skills || [],
                status: jobData.status || 'active',
                postedDate: new Date(),
                salary: jobData.salary,
                applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null
            }
        });
        return res.status(201).json({
            success: true,
            data: { job }
        });
    }
    catch (error) {
        console.error('Create job error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.put('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const jobData = req.body;
        const job = await prisma.job.update({
            where: { id },
            data: {
                title: jobData.title,
                department: jobData.department,
                location: jobData.location,
                type: jobData.type,
                experience: jobData.experience,
                description: jobData.description,
                requirements: jobData.requirements || [],
                benefits: jobData.benefits || [],
                skills: jobData.skills || [],
                status: jobData.status || 'active',
                salary: jobData.salary,
                applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null
            }
        });
        return res.json({
            success: true,
            data: { job }
        });
    }
    catch (error) {
        console.error('Update job error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
router.delete('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.job.delete({
            where: { id }
        });
        return res.json({
            success: true,
            message: 'Job deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete job error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=career.js.map