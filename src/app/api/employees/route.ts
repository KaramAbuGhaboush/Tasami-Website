import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { createErrorResponse, createSuccessResponse, handleError } from '@/lib/errors';
import { employeeSchema, paginationSchema } from '@/lib/validation';
import bcrypt from 'bcryptjs';

/**
 * GET /api/employees - Get all employees (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (department) where.department = department;
    if (status) where.isActive = status === 'active';
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          weeklyGoal: true,
          department: true,
          phone: true,
          createdAt: true
        }
      }),
      prisma.user.count({ where })
    ]);

    return createSuccessResponse({
      items,
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
 * POST /api/employees - Create employee (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin(request);
    
    if (!user) {
      return createErrorResponse('Access denied. Admin privileges required.', 403);
    }

    const body = await request.json();
    const validatedData = employeeSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return createErrorResponse('User with this email already exists', 400);
    }

    // Hash password if provided
    let hashedPassword = '';
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    } else {
      // Generate a random password if not provided
      hashedPassword = await bcrypt.hash(Math.random().toString(36), 12);
    }

    const employee = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        password: hashedPassword,
        role: validatedData.role,
        isActive: validatedData.isActive,
        weeklyGoal: validatedData.weeklyGoal,
        department: validatedData.department,
        phone: validatedData.phone
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        weeklyGoal: true,
        department: true,
        phone: true,
        createdAt: true
      }
    });

    return createSuccessResponse(
      { employee },
      'Employee created successfully',
      201
    );
  } catch (error) {
    return handleError(error);
  }
}

