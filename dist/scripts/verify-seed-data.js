"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../lib/prisma");
async function verifySeedData() {
    try {
        console.log('🔍 Verifying seed data...\n');
        // Check users
        const users = await prisma_1.prisma.user.findMany({
            select: {
                email: true,
                name: true,
                role: true,
                slug: true,
            },
        });
        console.log(`✅ Users (${users.length}):`);
        users.forEach(user => {
            console.log(`   - ${user.email} (${user.role}) - slug: ${user.slug || 'N/A'}`);
        });
        // Check categories
        const categories = await prisma_1.prisma.category.findMany({
            select: {
                name: true,
                slug: true,
            },
        });
        console.log(`\n✅ Categories (${categories.length}):`);
        categories.forEach(cat => {
            console.log(`   - ${cat.name} (${cat.slug})`);
        });
        // Check tags
        const tags = await prisma_1.prisma.tag.findMany({
            select: {
                name: true,
                slug: true,
            },
        });
        console.log(`\n✅ Tags (${tags.length}):`);
        tags.forEach(tag => {
            console.log(`   - ${tag.name} (${tag.slug})`);
        });
        // Check products
        const products = await prisma_1.prisma.product.findMany({
            select: {
                name: true,
                slug: true,
            },
        });
        console.log(`\n✅ Products (${products.length}):`);
        products.forEach(product => {
            console.log(`   - ${product.name} (${product.slug})`);
        });
        // Check posts
        const posts = await prisma_1.prisma.post.findMany({
            select: {
                title: true,
                slug: true,
                status: true,
                author: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        console.log(`\n✅ Posts (${posts.length}):`);
        posts.forEach(post => {
            console.log(`   - ${post.title} (${post.status}) - by ${post.author.email}`);
        });
        console.log('\n✅ All seed data verified!');
    }
    catch (error) {
        console.error('❌ Error verifying seed data:', error);
        process.exit(1);
    }
    finally {
        await prisma_1.prisma.$disconnect();
    }
}
verifySeedData();
//# sourceMappingURL=verify-seed-data.js.map