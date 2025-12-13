/**
 * Contact Service
 * Handles contact form submissions
 */

import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { ContactStatus } from '@prisma/client';

export interface SubmitContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactQueryParams {
  page?: number;
  limit?: number;
  status?: ContactStatus;
  search?: string;
}

class ContactService {
  /**
   * Submit contact form
   */
  async submit(data: SubmitContactData) {
    const submission = await prisma.contactSubmission.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: ContactStatus.PENDING,
      },
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to user

    return submission;
  }

  /**
   * Get all submissions (admin only)
   */
  async getAll(params: ContactQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { subject: { contains: params.search, mode: 'insensitive' } },
        { message: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [submissions, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    return {
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get submission by ID
   */
  async getById(id: string) {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
    }

    return submission;
  }

  /**
   * Update submission status
   */
  async updateStatus(id: string, status: ContactStatus) {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
    }

    const updateData: any = { status };

    // Set respondedAt if marking as responded
    if (status === ContactStatus.RESPONDED && !submission.respondedAt) {
      updateData.respondedAt = new Date();
    }

    const updated = await prisma.contactSubmission.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Delete submission
   */
  async delete(id: string) {
    const submission = await prisma.contactSubmission.findUnique({
      where: { id },
    });

    if (!submission) {
      throw new AppError('SUBMISSION_NOT_FOUND', 'Contact submission not found', 404);
    }

    await prisma.contactSubmission.delete({
      where: { id },
    });

    return { message: 'Contact submission deleted successfully' };
  }
}

export const contactService = new ContactService();

