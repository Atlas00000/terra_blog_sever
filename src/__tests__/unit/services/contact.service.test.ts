import { contactService } from '../../../services/contact.service';
import { AppError } from '../../../middleware/error.middleware';
import { cleanDatabase } from '../../helpers/db.helper';
import { ContactStatus } from '@prisma/client';

describe('ContactService', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('submit', () => {
    it('should submit contact form', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@test.com',
        subject: 'Test Subject',
        message: 'This is a test message',
      };

      const submission = await contactService.submit(data);

      expect(submission).toBeDefined();
      expect(submission.name).toBe(data.name);
      expect(submission.email).toBe(data.email);
      expect(submission.subject).toBe(data.subject);
      expect(submission.message).toBe(data.message);
      expect(submission.status).toBe(ContactStatus.PENDING);
    });
  });

  describe('getAll', () => {
    it('should return paginated submissions', async () => {
      await global.prisma.contactSubmission.createMany({
        data: [
          {
            name: 'User 1',
            email: 'user1@test.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: ContactStatus.PENDING,
          },
          {
            name: 'User 2',
            email: 'user2@test.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: ContactStatus.RESPONDED,
          },
        ],
      });

      const result = await contactService.getAll({ page: 1, limit: 10 });

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.pagination.total).toBe(2);
    });

    it('should filter by status', async () => {
      await global.prisma.contactSubmission.createMany({
        data: [
          {
            name: 'User 1',
            email: 'user1@test.com',
            subject: 'Subject 1',
            message: 'Message 1',
            status: ContactStatus.PENDING,
          },
          {
            name: 'User 2',
            email: 'user2@test.com',
            subject: 'Subject 2',
            message: 'Message 2',
            status: ContactStatus.RESPONDED,
          },
        ],
      });

      const result = await contactService.getAll({
        status: ContactStatus.PENDING,
      });

      expect(result.data.every((s) => s.status === ContactStatus.PENDING)).toBe(true);
    });

    it('should search submissions', async () => {
      await global.prisma.contactSubmission.createMany({
        data: [
          {
            name: 'John Doe',
            email: 'john@test.com',
            subject: 'Test Subject',
            message: 'Test message',
            status: ContactStatus.PENDING,
          },
          {
            name: 'Jane Smith',
            email: 'jane@test.com',
            subject: 'Another Subject',
            message: 'Another message',
            status: ContactStatus.PENDING,
          },
        ],
      });

      const result = await contactService.getAll({ search: 'John' });

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data.some((s) => s.name.includes('John'))).toBe(true);
    });
  });

  describe('getById', () => {
    it('should get submission by ID', async () => {
      const submission = await global.prisma.contactSubmission.create({
        data: {
          name: 'John Doe',
          email: 'john@test.com',
          subject: 'Test Subject',
          message: 'Test message',
          status: ContactStatus.PENDING,
        },
      });

      const result = await contactService.getById(submission.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(submission.id);
    });

    it('should throw error if submission not found', async () => {
      await expect(contactService.getById('non-existent-id')).rejects.toThrow(AppError);
    });
  });

  describe('updateStatus', () => {
    it('should update submission status', async () => {
      const submission = await global.prisma.contactSubmission.create({
        data: {
          name: 'John Doe',
          email: 'john@test.com',
          subject: 'Test Subject',
          message: 'Test message',
          status: ContactStatus.PENDING,
        },
      });

      const updated = await contactService.updateStatus(submission.id, ContactStatus.RESPONDED);

      expect(updated.status).toBe(ContactStatus.RESPONDED);
    });

    it('should throw error if submission not found', async () => {
      await expect(
        contactService.updateStatus('non-existent-id', ContactStatus.RESPONDED)
      ).rejects.toThrow(AppError);
    });
  });

  describe('delete', () => {
    it('should delete submission', async () => {
      const submission = await global.prisma.contactSubmission.create({
        data: {
          name: 'John Doe',
          email: 'john@test.com',
          subject: 'Test Subject',
          message: 'Test message',
          status: ContactStatus.PENDING,
        },
      });

      await contactService.delete(submission.id);

      const deleted = await global.prisma.contactSubmission.findUnique({
        where: { id: submission.id },
      });

      expect(deleted).toBeNull();
    });

    it('should throw error if submission not found', async () => {
      await expect(contactService.delete('non-existent-id')).rejects.toThrow(AppError);
    });
  });
});

