"use strict";
/**
 * Categories API Test Script
 * Tests: CRUD operations, permissions, validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.runCategoryTests = runCategoryTests;
const API_BASE = process.env.API_BASE || 'http://localhost:3001/api/v1';
const ADMIN_EMAIL = 'admin@terraindustries.co';
const ADMIN_PASSWORD = 'admin123';
const AUTHOR_EMAIL = 'author@terraindustries.co';
const AUTHOR_PASSWORD = 'admin123';
const results = [];
exports.results = results;
async function makeRequest(method, endpoint, body, token) {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return { status: response.status, data };
}
function logTest(name, passed, error, data) {
    results.push({ name, passed, error, data });
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${name}`);
    if (error) {
        console.log(`   Error: ${error}`);
    }
}
async function getToken(email, password) {
    try {
        const { status, data } = await makeRequest('POST', '/auth/login', {
            email,
            password,
        });
        if (status === 200 && data.data?.token) {
            return data.data.token;
        }
    }
    catch (error) {
        // Ignore
    }
    return null;
}
async function testGetAllCategories() {
    console.log('\n📋 Testing Get All Categories...');
    // Test 1: Get all categories (public)
    try {
        const { status, data } = await makeRequest('GET', '/categories?page=1&limit=10');
        if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
            logTest('Get all categories (public)', true);
        }
        else {
            logTest('Get all categories (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get all categories (public)', false, error.message);
    }
    // Test 2: Get categories with pagination
    try {
        const { status, data } = await makeRequest('GET', '/categories?page=1&limit=1');
        if (status === 200 && data.pagination && data.pagination.limit === 1) {
            logTest('Get categories with pagination', true);
        }
        else {
            logTest('Get categories with pagination', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get categories with pagination', false, error.message);
    }
    // Test 3: Search categories
    try {
        const { status, data } = await makeRequest('GET', '/categories?search=Technology');
        if (status === 200 && Array.isArray(data.data)) {
            logTest('Search categories', true);
        }
        else {
            logTest('Search categories', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Search categories', false, error.message);
    }
}
async function testGetCategoryBySlug() {
    console.log('\n🔍 Testing Get Category By Slug...');
    // Test 1: Get category by slug (public)
    try {
        const { status, data } = await makeRequest('GET', '/categories/technology-innovation');
        if (status === 200 && data.data && data.data.slug === 'technology-innovation') {
            logTest('Get category by slug (public)', true);
        }
        else {
            logTest('Get category by slug (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get category by slug (public)', false, error.message);
    }
    // Test 2: Get non-existent category
    try {
        const { status, data } = await makeRequest('GET', '/categories/non-existent-category');
        if (status === 404 && data.error?.code === 'CATEGORY_NOT_FOUND') {
            logTest('Get non-existent category (should fail)', true);
        }
        else {
            logTest('Get non-existent category (should fail)', false, `Expected 404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get non-existent category (should fail)', false, error.message);
    }
}
async function testCreateCategory() {
    console.log('\n➕ Testing Create Category...');
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    if (!adminToken) {
        logTest('Create category (skipped - no admin token)', false, 'No admin token available');
        return null;
    }
    const testSlug = `test-category-${Date.now()}`;
    const testName = `Test Category ${Date.now()}`;
    // Test 1: Create category as admin
    try {
        const { status, data } = await makeRequest('POST', '/categories', {
            name: testName,
            slug: testSlug,
            description: 'Test category description',
        }, adminToken);
        if (status === 201 && data.data && data.data.slug === testSlug) {
            logTest('Create category as admin', true);
            return data.data.id;
        }
        else {
            logTest('Create category as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Create category as admin', false, error.message);
    }
    // Test 2: Create category as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        try {
            const { status, data } = await makeRequest('POST', '/categories', {
                name: 'Test Category 2',
                slug: `test-category-2-${Date.now()}`,
            }, authorToken);
            if (status === 403 && data.error?.code === 'FORBIDDEN') {
                logTest('Create category as author (should fail)', true);
            }
            else {
                logTest('Create category as author (should fail)', false, `Expected 403, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create category as author (should fail)', false, error.message);
        }
    }
    // Test 3: Create category without token (should fail)
    try {
        const { status, data } = await makeRequest('POST', '/categories', {
            name: 'Test Category 3',
            slug: `test-category-3-${Date.now()}`,
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Create category without token (should fail)', true);
        }
        else {
            logTest('Create category without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create category without token (should fail)', false, error.message);
    }
    // Test 4: Create category with duplicate name (use the name we just created)
    if (testName) {
        try {
            const { status, data } = await makeRequest('POST', '/categories', {
                name: testName,
                slug: `test-category-4-${Date.now()}`,
            }, adminToken);
            if (status === 409 && data.error?.code === 'CATEGORY_NAME_EXISTS') {
                logTest('Create category with duplicate name (should fail)', true);
            }
            else {
                logTest('Create category with duplicate name (should fail)', false, `Expected 409, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create category with duplicate name (should fail)', false, error.message);
        }
    }
    // Test 5: Create category with duplicate slug (use the slug we just created)
    if (testSlug) {
        try {
            const { status, data } = await makeRequest('POST', '/categories', {
                name: `Test Category 5 ${Date.now()}`,
                slug: testSlug,
            }, adminToken);
            if (status === 409 && data.error?.code === 'CATEGORY_SLUG_EXISTS') {
                logTest('Create category with duplicate slug (should fail)', true);
            }
            else {
                logTest('Create category with duplicate slug (should fail)', false, `Expected 409, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create category with duplicate slug (should fail)', false, error.message);
        }
    }
    // Test 6: Create category with invalid slug format
    try {
        const { status, data } = await makeRequest('POST', '/categories', {
            name: 'Test Category 6',
            slug: 'Invalid Slug Format!',
        }, adminToken);
        if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Create category with invalid slug format (should fail)', true);
        }
        else {
            logTest('Create category with invalid slug format (should fail)', false, `Expected 400, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create category with invalid slug format (should fail)', false, error.message);
    }
    return null;
}
async function testUpdateCategory(adminToken, categoryId) {
    console.log('\n✏️ Testing Update Category...');
    if (!adminToken || !categoryId) {
        logTest('Update category (skipped)', false, 'No admin token or category ID available');
        return;
    }
    // Test 1: Update category as admin
    try {
        const { status, data } = await makeRequest('PUT', `/categories/${categoryId}`, {
            description: 'Updated description',
        }, adminToken);
        if (status === 200 && data.data && data.data.description === 'Updated description') {
            logTest('Update category as admin', true);
        }
        else {
            logTest('Update category as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Update category as admin', false, error.message);
    }
    // Test 2: Update category with invalid ID
    try {
        const { status } = await makeRequest('PUT', '/categories/invalid-id', { name: 'Test' }, adminToken);
        if (status === 400 || status === 404) {
            logTest('Update category with invalid ID (should fail)', true);
        }
        else {
            logTest('Update category with invalid ID (should fail)', false, `Expected 400/404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update category with invalid ID (should fail)', false, error.message);
    }
    // Test 3: Update category without token (should fail)
    try {
        const { status, data } = await makeRequest('PUT', `/categories/${categoryId}`, {
            description: 'Test',
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Update category without token (should fail)', true);
        }
        else {
            logTest('Update category without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update category without token (should fail)', false, error.message);
    }
}
async function testDeleteCategory(adminToken) {
    console.log('\n🗑️ Testing Delete Category...');
    if (!adminToken) {
        logTest('Delete category (skipped - no admin token)', false, 'No admin token available');
        return;
    }
    // Create a test category to delete
    const testSlug = `delete-test-${Date.now()}`;
    let categoryId = null;
    try {
        const { status, data } = await makeRequest('POST', '/categories', {
            name: 'Delete Test Category',
            slug: testSlug,
            description: 'This category will be deleted',
        }, adminToken);
        if (status === 201 && data.data) {
            categoryId = data.data.id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (!categoryId) {
        logTest('Delete category (skipped)', false, 'Could not create test category');
        return;
    }
    // Test 1: Delete category as admin
    try {
        const { status, data } = await makeRequest('DELETE', `/categories/${categoryId}`, undefined, adminToken);
        if (status === 200 && data.message) {
            logTest('Delete category as admin', true);
        }
        else {
            logTest('Delete category as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Delete category as admin', false, error.message);
    }
    // Test 2: Delete category as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        // Create another test category
        const testSlug2 = `delete-test-2-${Date.now()}`;
        let categoryId2 = null;
        try {
            const { status, data } = await makeRequest('POST', '/categories', {
                name: 'Delete Test Category 2',
                slug: testSlug2,
            }, adminToken);
            if (status === 201 && data.data) {
                categoryId2 = data.data.id;
            }
        }
        catch (error) {
            // Ignore
        }
        if (categoryId2) {
            try {
                const { status, data } = await makeRequest('DELETE', `/categories/${categoryId2}`, undefined, authorToken);
                if (status === 403 && data.error?.code === 'FORBIDDEN') {
                    logTest('Delete category as author (should fail)', true);
                }
                else {
                    logTest('Delete category as author (should fail)', false, `Expected 403, got ${status}`);
                }
            }
            catch (error) {
                logTest('Delete category as author (should fail)', false, error.message);
            }
        }
    }
    // Test 3: Delete category with posts (should fail)
    // Try to delete a category that has posts (technology-innovation)
    try {
        const { status, data } = await makeRequest('GET', '/categories/technology-innovation');
        if (status === 200 && data.data) {
            const categoryWithPostsId = data.data.id;
            const deleteResponse = await makeRequest('DELETE', `/categories/${categoryWithPostsId}`, undefined, adminToken);
            if (deleteResponse.status === 409 && deleteResponse.data.error?.code === 'CATEGORY_HAS_POSTS') {
                logTest('Delete category with posts (should fail)', true);
            }
            else {
                logTest('Delete category with posts (should fail)', false, `Expected 409, got ${deleteResponse.status}`);
            }
        }
    }
    catch (error) {
        logTest('Delete category with posts (should fail)', false, error.message);
    }
}
async function runCategoryTests() {
    console.log('🧪 Starting Categories API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    await testGetAllCategories();
    await testGetCategoryBySlug();
    const categoryId = await testCreateCategory();
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    await testUpdateCategory(adminToken, categoryId);
    await testDeleteCategory(adminToken);
    // Summary
    const passed = results.filter((r) => r.passed).length;
    const total = results.length;
    const failed = total - passed;
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
    return { passed, total, failed, results };
}
// Run tests if executed directly
if (require.main === module) {
    runCategoryTests()
        .then((summary) => {
        process.exit(summary.failed > 0 ? 1 : 0);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-categories.js.map