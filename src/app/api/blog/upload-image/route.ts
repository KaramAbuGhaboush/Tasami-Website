import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { handleFileUpload } from '@/lib/upload';

/**
 * POST /api/blog/upload-image - Upload blog image (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const fileInfo = await handleFileUpload(request, 'image');

    if (!fileInfo) {
      return createErrorResponse('No file provided', 400);
    }

    return createSuccessResponse({
      filename: fileInfo.filename,
      url: fileInfo.url
    }, 'Image uploaded successfully', 201);
  } catch (error) {
    return handleError(error);
  }
}

