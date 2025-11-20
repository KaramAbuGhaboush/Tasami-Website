import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { contactFormSchema, paginationSchema } from '@/lib/validation';
import EmailService from '@/server/services/emailService';

const emailService = new EmailService();

/**
 * GET /api/contact/messages - Get all messages (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { requireAdmin } = await import('@/lib/auth');
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const status = searchParams.get('status');
    const service = searchParams.get('service');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (service) where.service = service;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.contactMessage.count({ where })
    ]);

    return createSuccessResponse({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/contact/messages - Submit contact message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const message = await prisma.contactMessage.create({
      data: {
        ...validatedData,
        status: 'new',
        source: 'website'
      }
    });

    // Send email notification
    try {
      await emailService.sendContactNotification({
        ...validatedData,
        createdAt: message.createdAt
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return createSuccessResponse(
      { contactMessage: message },
      'Message submitted successfully',
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

