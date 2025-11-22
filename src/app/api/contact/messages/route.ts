import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { contactFormSchema } from '@/lib/validation';
import EmailService from '@/server/services/emailService';
import { ContactService } from '@/services/contactService';
import { createRateLimit } from '@/lib/rate-limit';

const emailService = new EmailService();

// Rate limiter: 5 requests per 15 minutes for contact form
const rateLimit = createRateLimit({
  limit: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

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
    const status = searchParams.get('status') || undefined;

    const result = await ContactService.getMessages({
        page,
        limit,
      status,
    });

    return createSuccessResponse(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/contact/messages - Submit contact message
 */
export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.allowed) {
      return createErrorResponse(
        'Too many requests. Please try again later.',
        429
      );
    }

    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const message = await ContactService.createMessage({
        ...validatedData,
        status: 'new',
      source: 'website',
    } as any);

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

