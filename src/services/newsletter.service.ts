/**
 * Newsletter Service
 * Handles newsletter subscriptions, confirmations, and preferences
 */

import prisma from '../lib/prisma';
import { AppError } from '../middleware/error.middleware';
import { SubscriberStatus } from '@prisma/client';
import crypto from 'crypto';

export interface SubscribeData {
  email: string;
  preferences?: Record<string, boolean>;
}

export interface UpdatePreferencesData {
  preferences: Record<string, boolean>;
}

export interface NewsletterQueryParams {
  page?: number;
  limit?: number;
  status?: SubscriberStatus;
  search?: string;
}

class NewsletterService {
  /**
   * Generate confirmation token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Subscribe to newsletter
   */
  async subscribe(data: SubscribeData): Promise<{ message: string; requiresConfirmation: boolean }> {
    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      if (existing.status === SubscriberStatus.CONFIRMED) {
        throw new AppError('ALREADY_SUBSCRIBED', 'Email is already subscribed', 409);
      }
      if (existing.status === SubscriberStatus.UNSUBSCRIBED) {
        // Resubscribe
        await prisma.newsletterSubscriber.update({
          where: { email: data.email },
          data: {
            status: SubscriberStatus.PENDING,
            unsubscribedAt: null,
            preferences: data.preferences || undefined,
          },
        });
        return {
          message: 'Please check your email to confirm your subscription',
          requiresConfirmation: true,
        };
      }
      // Already pending
      throw new AppError('PENDING_CONFIRMATION', 'Please check your email to confirm your subscription', 409);
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        status: SubscriberStatus.PENDING,
        preferences: data.preferences || undefined,
      },
    });

    // TODO: Send confirmation email
    // In production, send email with confirmation link

    return {
      message: 'Please check your email to confirm your subscription',
      requiresConfirmation: true,
    };
  }

  /**
   * Confirm subscription (double opt-in)
   */
  async confirm(email: string): Promise<{ message: string }> {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      throw new AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
    }

    if (subscriber.status === SubscriberStatus.CONFIRMED) {
      return { message: 'Email is already confirmed' };
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        status: SubscriberStatus.CONFIRMED,
        confirmedAt: new Date(),
      },
    });

    return { message: 'Subscription confirmed successfully' };
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(email: string): Promise<{ message: string }> {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      throw new AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
    }

    if (subscriber.status === SubscriberStatus.UNSUBSCRIBED) {
      return { message: 'Email is already unsubscribed' };
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        status: SubscriberStatus.UNSUBSCRIBED,
        unsubscribedAt: new Date(),
      },
    });

    return { message: 'Successfully unsubscribed' };
  }

  /**
   * Update preferences
   */
  async updatePreferences(email: string, data: UpdatePreferencesData) {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      throw new AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
    }

    if (subscriber.status !== SubscriberStatus.CONFIRMED) {
      throw new AppError('NOT_CONFIRMED', 'Please confirm your subscription first', 400);
    }

    const updated = await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        preferences: data.preferences,
      },
    });

    return updated;
  }

  /**
   * Get all subscribers (admin only)
   */
  async getAll(params: NewsletterQueryParams) {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.status) {
      where.status = params.status;
    }

    if (params.search) {
      where.email = { contains: params.search, mode: 'insensitive' };
    }

    const [subscribers, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.newsletterSubscriber.count({ where }),
    ]);

    return {
      data: subscribers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get subscriber by email
   */
  async getByEmail(email: string) {
    const subscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      throw new AppError('SUBSCRIBER_NOT_FOUND', 'Subscriber not found', 404);
    }

    return subscriber;
  }
}

export const newsletterService = new NewsletterService();

