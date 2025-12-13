import { PrismaClient, Role, PostStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@terraindustries.co' },
    update: {},
    create: {
      email: 'admin@terraindustries.co',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
      slug: 'admin',
      bio: 'System Administrator',
    },
  });

  // Create author user
  const author = await prisma.user.upsert({
    where: { email: 'author@terraindustries.co' },
    update: {},
    create: {
      email: 'author@terraindustries.co',
      name: 'Test Author',
      password: hashedPassword,
      role: Role.AUTHOR,
      slug: 'test-author',
      bio: 'Test Author for Terra Industries Blog',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/test-author',
        twitter: 'https://twitter.com/testauthor',
      },
    },
  });

  // Create categories
  const technologyCategory = await prisma.category.upsert({
    where: { slug: 'technology-innovation' },
    update: {},
    create: {
      name: 'Technology & Innovation',
      slug: 'technology-innovation',
      description: 'AI and autonomous systems, defense technology trends',
    },
  });

  const productCategory = await prisma.category.upsert({
    where: { slug: 'product-showcases' },
    update: {},
    create: {
      name: 'Product Showcases',
      slug: 'product-showcases',
      description: 'Features and deployments for our defense systems',
    },
  });

  // Create tags
  const aiTag = await prisma.tag.upsert({
    where: { slug: 'ai-autonomous' },
    update: {},
    create: {
      name: 'AI & Autonomous',
      slug: 'ai-autonomous',
    },
  });

  const infrastructureTag = await prisma.tag.upsert({
    where: { slug: 'infrastructure-protection' },
    update: {},
    create: {
      name: 'Infrastructure Protection',
      slug: 'infrastructure-protection',
    },
  });

  // Create products
  const artemis = await prisma.product.upsert({
    where: { slug: 'artemis' },
    update: {},
    create: {
      name: 'Artemis',
      slug: 'artemis',
      description: 'Autonomous defense system for critical infrastructure',
      features: [
        'AI-powered threat detection',
        'Autonomous response capabilities',
        'Real-time monitoring',
      ],
      specifications: {
        range: '5km',
        responseTime: '< 2 seconds',
      },
      images: [],
      videos: [],
    },
  });

  // Create sample post
  const samplePost = await prisma.post.upsert({
    where: { slug: 'welcome-to-terra-industries-blog' },
    update: {},
    create: {
      title: 'Welcome to Terra Industries Blog',
      slug: 'welcome-to-terra-industries-blog',
      excerpt: 'Introducing our new thought leadership platform',
      content: JSON.stringify({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Welcome to the Terra Industries blog, where we share insights on autonomous defense systems and critical infrastructure protection.',
              },
            ],
          },
        ],
      }),
      status: PostStatus.PUBLISHED,
      authorId: author.id,
      readingTime: 2,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: technologyCategory.id }],
      },
      tags: {
        connect: [{ id: aiTag.id }, { id: infrastructureTag.id }],
      },
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   - Admin user: ${admin.email}`);
  console.log(`   - Author user: ${author.email}`);
  console.log(`   - Categories: ${technologyCategory.name}, ${productCategory.name}`);
  console.log(`   - Products: ${artemis.name}`);
  console.log(`   - Sample post: ${samplePost.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

