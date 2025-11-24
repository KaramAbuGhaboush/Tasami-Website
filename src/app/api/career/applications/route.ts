import { NextRequest } from 'next/server';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { z } from 'zod';

const applicationSchema = z.object({
  jobId: z.string().min(1, 'Job ID is required'),
  applicantName: z.string().trim().min(2, 'Name is required'),
  applicantEmail: z.string().email('Valid email is required'),
  applicantPhone: z.string().trim().optional(),
  applicantLocation: z.string().trim().optional(),
  resume: z.string().optional(),
  coverLetter: z.string().trim().optional()
});

/**
 * POST /api/career/applications - Submit job application
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = applicationSchema.parse(body);

    // In a real application, you would save this to a database
    // For now, we'll just return success
    // You can create an Application model in Prisma if needed

    return createSuccessResponse(
      { application: validatedData },
      'Application submitted successfully',
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

