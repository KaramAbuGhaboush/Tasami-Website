/**
 * Contact Service Layer
 * Handles all contact-related business logic
 */

import { prisma } from '@/lib/prisma'
import { contactFormSchema } from '@/lib/validation'
import { z } from 'zod'

export interface CreateContactMessageData extends z.infer<typeof contactFormSchema> {}

export interface GetContactMessagesParams {
  page?: number
  limit?: number
  status?: string
}

export class ContactService {
  /**
   * Get all contact messages with pagination
   */
  static async getMessages(params: GetContactMessagesParams = {}) {
    const { page = 1, limit = 10, status } = params

    const skip = (page - 1) * limit

    const where: any = {}
    if (status) where.status = status

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ])

    return {
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get message by ID
   */
  static async getMessageById(id: string) {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    })

    return message
  }

  /**
   * Create contact message
   */
  static async createMessage(data: CreateContactMessageData) {
    const validatedData = contactFormSchema.parse(data)
    const message = await prisma.contactMessage.create({
      data: validatedData,
    })

    return message
  }

  /**
   * Update message status
   */
  static async updateMessageStatus(id: string, status: string) {
    const message = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    })

    return message
  }

  /**
   * Delete message
   */
  static async deleteMessage(id: string) {
    await prisma.contactMessage.delete({
      where: { id },
    })

    return { success: true }
  }
}

