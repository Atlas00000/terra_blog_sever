import { PostStatus, CommentStatus, ContactStatus } from '@prisma/client';

/**
 * Test data factories
 */
export const testData = {
  user: {
    admin: {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'test123456',
      role: 'ADMIN' as const,
    },
    editor: {
      name: 'Editor User',
      email: 'editor@test.com',
      password: 'test123456',
      role: 'EDITOR' as const,
    },
    author: {
      name: 'Author User',
      email: 'author@test.com',
      password: 'test123456',
      role: 'AUTHOR' as const,
    },
  },

  post: {
    draft: {
      title: 'Draft Post',
      slug: 'draft-post',
      excerpt: 'This is a draft post',
      content: 'This is the content of a draft post with enough words to calculate reading time.',
      status: PostStatus.DRAFT,
    },
    published: {
      title: 'Published Post',
      slug: 'published-post',
      excerpt: 'This is a published post',
      content: 'This is the content of a published post with enough words to calculate reading time properly.',
      status: PostStatus.PUBLISHED,
    },
  },

  category: {
    basic: {
      name: 'Technology',
      slug: 'technology',
      description: 'Technology related posts',
    },
  },

  tag: {
    basic: {
      name: 'JavaScript',
      slug: 'javascript',
      description: 'JavaScript related posts',
    },
  },

  product: {
    basic: {
      name: 'Terra Platform',
      slug: 'terra-platform',
      description: 'The Terra platform product',
      features: ['Feature 1', 'Feature 2'],
      specifications: { version: '1.0.0' },
    },
  },

  comment: {
    approved: {
      content: 'This is an approved comment',
      authorName: 'John Doe',
      authorEmail: 'john@test.com',
      status: CommentStatus.APPROVED,
    },
    pending: {
      content: 'This is a pending comment',
      authorName: 'Jane Doe',
      authorEmail: 'jane@test.com',
      status: CommentStatus.PENDING,
    },
  },

  newsletter: {
    subscriber: {
      email: 'subscriber@test.com',
      name: 'Newsletter Subscriber',
      preferences: {
        weekly: true,
        productUpdates: true,
        blogPosts: true,
      },
    },
  },

  contact: {
    submission: {
      name: 'Contact User',
      email: 'contact@test.com',
      subject: 'Test Subject',
      message: 'This is a test contact message',
      status: ContactStatus.PENDING,
    },
  },

  press: {
    release: {
      title: 'Test Press Release',
      slug: 'test-press-release',
      content: 'This is a test press release content',
      featured: false,
    },
  },
};

