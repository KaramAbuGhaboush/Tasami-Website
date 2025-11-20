import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { employeeSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

/**
 * GET /api/employees/[id] - Get employee by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;

    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        weeklyGoal: true,
        department: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!employee) {
      return createErrorResponse('Employee not found', 404);
    }

    return createSuccessResponse({ employee });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/employees/[id] - Update employee (admin only)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = employeeSchema.partial().parse(body);

    const updateData: any = { ...validatedData };
    
    // Hash password if provided
    if (validatedData.password) {
      updateData.password = await bcrypt.hash(validatedData.password, 12);
    } else {
      delete updateData.password;
    }

    const employee = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        weeklyGoal: true,
        department: true,
        phone: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return createSuccessResponse({ employee }, 'Employee updated successfully');
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/employees/[id] - Delete employee (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { id } = await params;

    await prisma.user.delete({
      where: { id }
    });

    return createSuccessResponse(null, 'Employee deleted successfully');
  } catch (error) {
    return handleError(error);
  }
}

