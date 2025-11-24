import { NextResponse } from 'next/server';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number = 500,
  errors?: Array<{ field?: string; message: string; value?: any }>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors })
    },
    { status: statusCode }
  );
}

/**
 * Handle and format errors
 */
export function handleError(error: unknown): NextResponse {
  // Log error
  console.error('Error:', error);

  // Handle known error types
  if (error instanceof Error) {
    // JWT errors
    if (error.name === 'JsonWebTokenError') {
      return createErrorResponse('Invalid token', 401);
    }

    if (error.name === 'TokenExpiredError') {
      return createErrorResponse('Token expired', 401);
    }

    // Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as any;
      
      // Unique constraint violation
      if (prismaError.code === 'P2002') {
        return createErrorResponse('Duplicate field value entered', 400);
      }
      
      // Record not found
      if (prismaError.code === 'P2025') {
        return createErrorResponse('Resource not found', 404);
      }
    }

    // Validation errors
    if (error.name === 'ZodError') {
      const zodError = error as any;
      const errors = zodError.errors?.map((err: any) => ({
        field: err.path?.join('.'),
        message: err.message,
        value: err.input
      }));
      return createErrorResponse('Validation failed', 400, errors);
    }

    // Custom AppError
    if ('statusCode' in error) {
      const appError = error as AppError;
      return createErrorResponse(
        appError.message || 'An error occurred',
        appError.statusCode || 500
      );
    }
  }

  // Default error response
  return createErrorResponse(
    process.env.NODE_ENV === 'development' 
      ? (error instanceof Error ? error.message : 'Server Error')
      : 'Internal server error',
    500
  );
}

/**
 * Success response helper
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      ...(message && { message }),
      data
    },
    { status: statusCode }
  );
}

