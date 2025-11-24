import { NextRequest } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { validateFileUpload } from './validation';

/**
 * Handle file upload from FormData
 */
export async function handleFileUpload(
  request: NextRequest,
  fieldName: string = 'image',
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): Promise<{ filename: string; url: string; path: string } | null> {
  try {
    const formData = await request.formData();
    const file = formData.get(fieldName) as File | null;

    if (!file) {
      return null;
    }

    // Validate file
    const validation = validateFileUpload(file, allowedTypes, maxSize);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.name.split('.').pop() || '';
    const filename = `blog-${uniqueSuffix}.${extension}`;

    // Determine upload directory
    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads', 'images');
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return file info
    const url = `/uploads/images/${filename}`;
    
    return {
      filename,
      url,
      path: filePath
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const { unlink } = await import('fs/promises');
    const uploadDir = process.env.UPLOAD_DIR || join(process.cwd(), 'public', 'uploads', 'images');
    const filePath = join(uploadDir, filename);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch (error) {
    console.error('File deletion error:', error);
    // Don't throw - file deletion is not critical
  }
}

