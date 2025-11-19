"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const localization_1 = require("../utils/localization");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.get('/jobs', async (req, res) => {
    try {
        const { page = 1, limit = 10, department, location, type, status, locale } = req.query;
        const normalizedLocale = (0, localization_1.normalizeLocale)(locale);
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (status) {
            where.status = status;
        }
        else if (!req.headers.authorization) {
            where.status = 'active';
        }
        const andConditions = [];
        if (department) {
            andConditions.push({
                OR: [
                    { department: department },
                    { departmentAr: department }
                ]
            });
        }
        if (location) {
            andConditions.push({
                OR: [
                    { location: { contains: location } },
                    { locationAr: { contains: location } }
                ]
            });
        }
        if (type) {
            andConditions.push({
                OR: [
                    { type: type },
                    { typeAr: type }
                ]
            });
        }
        if (andConditions.length > 0) {
            where.AND = andConditions;
        }
        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.job.count({ where })
        ]);
        const transformedJobs = (0, localization_1.transformJobsByLocale)(jobs, normalizedLocale);
        return res.json({
            success: true,
            data: {
                jobs: transformedJobs,
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
        const { locale } = req.query;
        const normalizedLocale = (0, localization_1.normalizeLocale)(locale);
        const job = await prisma.job.findUnique({
            where: { id }
        });
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        const transformedJob = (0, localization_1.transformJobByLocale)(job, normalizedLocale);
        return res.json({
            success: true,
            data: { job: transformedJob }
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
                titleAr: jobData.titleAr || null,
                department: jobData.department,
                departmentAr: jobData.departmentAr || null,
                location: jobData.location,
                locationAr: jobData.locationAr || null,
                type: jobData.type,
                typeAr: jobData.typeAr || null,
                experience: jobData.experience,
                experienceAr: jobData.experienceAr || null,
                description: jobData.description,
                descriptionAr: jobData.descriptionAr || null,
                requirements: jobData.requirements || [],
                requirementsAr: jobData.requirementsAr || null,
                benefits: jobData.benefits || [],
                benefitsAr: jobData.benefitsAr || null,
                status: jobData.status || 'active',
                postedDate: new Date(),
                salary: jobData.salary,
                salaryAr: jobData.salaryAr || null,
                team: jobData.team,
                teamAr: jobData.teamAr || null,
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
        const existingJob = await prisma.job.findUnique({
            where: { id }
        });
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        const existingJobWithAr = existingJob;
        const job = await prisma.job.update({
            where: { id },
            data: {
                title: jobData.title !== undefined ? jobData.title : existingJob.title,
                titleAr: jobData.titleAr !== undefined ? jobData.titleAr : existingJobWithAr.titleAr,
                department: jobData.department !== undefined ? jobData.department : existingJob.department,
                departmentAr: jobData.departmentAr !== undefined ? jobData.departmentAr : existingJobWithAr.departmentAr,
                location: jobData.location !== undefined ? jobData.location : existingJob.location,
                locationAr: jobData.locationAr !== undefined ? jobData.locationAr : existingJobWithAr.locationAr,
                type: jobData.type !== undefined ? jobData.type : existingJob.type,
                typeAr: jobData.typeAr !== undefined ? jobData.typeAr : existingJobWithAr.typeAr,
                experience: jobData.experience !== undefined ? jobData.experience : existingJob.experience,
                experienceAr: jobData.experienceAr !== undefined ? jobData.experienceAr : existingJobWithAr.experienceAr,
                description: jobData.description !== undefined ? jobData.description : existingJob.description,
                descriptionAr: jobData.descriptionAr !== undefined ? jobData.descriptionAr : existingJobWithAr.descriptionAr,
                requirements: jobData.requirements !== undefined ? jobData.requirements : existingJob.requirements,
                requirementsAr: jobData.requirementsAr !== undefined ? jobData.requirementsAr : existingJobWithAr.requirementsAr,
                benefits: jobData.benefits !== undefined ? jobData.benefits : existingJob.benefits,
                benefitsAr: jobData.benefitsAr !== undefined ? jobData.benefitsAr : existingJobWithAr.benefitsAr,
                status: jobData.status !== undefined ? jobData.status : existingJob.status,
                salary: jobData.salary !== undefined ? jobData.salary : existingJob.salary,
                salaryAr: jobData.salaryAr !== undefined ? jobData.salaryAr : existingJobWithAr.salaryAr,
                team: jobData.team !== undefined ? jobData.team : existingJob.team,
                teamAr: jobData.teamAr !== undefined ? jobData.teamAr : existingJobWithAr.teamAr,
                applicationDeadline: jobData.applicationDeadline !== undefined
                    ? (jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null)
                    : existingJob.applicationDeadline
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