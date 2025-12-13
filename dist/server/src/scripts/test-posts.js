"use strict";
/**
 * Posts API Test Script
 * Tests: CRUD operations, filtering, search, permissions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.runPostTests = runPostTests;
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
async function testGetAllPosts() {
    console.log('\n📋 Testing Get All Posts...');
    // Test 1: Get all posts (public)
    try {
        const { status, data } = await makeRequest('GET', '/posts?page=1&limit=10');
        if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
            logTest('Get all posts (public)', true);
        }
        else {
            logTest('Get all posts (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get all posts (public)', false, error.message);
    }
    // Test 2: Get posts with pagination
    try {
        const { status, data } = await makeRequest('GET', '/posts?page=1&limit=1');
        if (status === 200 && data.pagination && data.pagination.limit === 1) {
            logTest('Get posts with pagination', true);
        }
        else {
            logTest('Get posts with pagination', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get posts with pagination', false, error.message);
    }
    // Test 3: Get posts with status filter (admin)
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    if (adminToken) {
        try {
            const { status, data } = await makeRequest('GET', '/posts?status=DRAFT&page=1&limit=10', undefined, adminToken);
            if (status === 200 && Array.isArray(data.data)) {
                logTest('Get posts with status filter', true);
            }
            else {
                logTest('Get posts with status filter', false, `Status: ${status}`);
            }
        }
        catch (error) {
            logTest('Get posts with status filter', false, error.message);
        }
    }
    // Test 4: Search posts
    try {
        const { status, data } = await makeRequest('GET', '/posts?search=Welcome&page=1&limit=10');
        if (status === 200 && Array.isArray(data.data)) {
            logTest('Search posts', true);
        }
        else {
            logTest('Search posts', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Search posts', false, error.message);
    }
}
async function testGetPostBySlug() {
    console.log('\n🔍 Testing Get Post By Slug...');
    // Test 1: Get post by slug (public)
    try {
        const { status, data } = await makeRequest('GET', '/posts/welcome-to-terra-industries-blog');
        if (status === 200 && data.data && data.data.slug === 'welcome-to-terra-industries-blog') {
            logTest('Get post by slug (public)', true);
        }
        else {
            logTest('Get post by slug (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get post by slug (public)', false, error.message);
    }
    // Test 2: Get non-existent post
    try {
        const { status, data } = await makeRequest('GET', '/posts/non-existent-post');
        if (status === 404 && data.error?.code === 'POST_NOT_FOUND') {
            logTest('Get non-existent post (should fail)', true);
        }
        else {
            logTest('Get non-existent post (should fail)', false, `Expected 404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get non-existent post (should fail)', false, error.message);
    }
}
async function testCreatePost() {
    console.log('\n➕ Testing Create Post...');
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (!authorToken) {
        logTest('Create post (skipped - no author token)', false, 'No author token available');
        return null;
    }
    const testSlug = `test-post-${Date.now()}`;
    // Test 1: Create post as author
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: 'Test Post Title',
            slug: testSlug,
            excerpt: 'This is a test post excerpt',
            content: 'This is the full content of the test post.',
            status: 'DRAFT',
        }, authorToken);
        if (status === 201 && data.data && data.data.slug === testSlug) {
            logTest('Create post as author', true);
            return data.data.id;
        }
        else {
            logTest('Create post as author', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Create post as author', false, error.message);
    }
    // Test 2: Create post without token (should fail)
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: 'Test Post',
            slug: `test-post-2-${Date.now()}`,
            content: 'Content',
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Create post without token (should fail)', true);
        }
        else {
            logTest('Create post without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create post without token (should fail)', false, error.message);
    }
    // Test 3: Create post with duplicate slug
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: 'Test Post 2',
            slug: testSlug,
            content: 'Content',
        }, authorToken);
        if (status === 409 && data.error?.code === 'SLUG_EXISTS') {
            logTest('Create post with duplicate slug (should fail)', true);
        }
        else {
            logTest('Create post with duplicate slug (should fail)', false, `Expected 409, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create post with duplicate slug (should fail)', false, error.message);
    }
    // Test 4: Create post with invalid data
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: '', // Invalid: empty title
            slug: 'test-slug',
            content: 'Content',
        }, authorToken);
        if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Create post with invalid data (should fail)', true);
        }
        else {
            logTest('Create post with invalid data (should fail)', false, `Expected 400, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create post with invalid data (should fail)', false, error.message);
    }
    return null;
}
async function testUpdatePost(postId) {
    console.log('\n✏️ Testing Update Post...');
    if (!postId) {
        logTest('Update post (skipped)', false, 'No post ID available');
        return;
    }
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (!authorToken) {
        logTest('Update post (skipped - no author token)', false, 'No author token available');
        return;
    }
    // Test 1: Update post as author
    try {
        const { status, data } = await makeRequest('PUT', `/posts/${postId}`, {
            title: 'Updated Post Title',
            excerpt: 'Updated excerpt',
        }, authorToken);
        if (status === 200 && data.data && data.data.title === 'Updated Post Title') {
            logTest('Update post as author', true);
        }
        else {
            logTest('Update post as author', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Update post as author', false, error.message);
    }
    // Test 2: Update post with invalid ID
    try {
        const { status } = await makeRequest('PUT', '/posts/invalid-id', { title: 'Test' }, authorToken);
        if (status === 404 || status === 400) {
            logTest('Update post with invalid ID (should fail)', true);
        }
        else {
            logTest('Update post with invalid ID (should fail)', false, `Expected 404/400, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update post with invalid ID (should fail)', false, error.message);
    }
    // Test 3: Update post without token (should fail)
    try {
        const { status, data } = await makeRequest('PUT', `/posts/${postId}`, {
            title: 'Test',
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Update post without token (should fail)', true);
        }
        else {
            logTest('Update post without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update post without token (should fail)', false, error.message);
    }
}
async function testDeletePost() {
    console.log('\n🗑️ Testing Delete Post...');
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (!authorToken) {
        logTest('Delete post (skipped - no author token)', false, 'No author token available');
        return;
    }
    // Create a test post to delete
    const testSlug = `delete-test-${Date.now()}`;
    let postId = null;
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: 'Delete Test Post',
            slug: testSlug,
            content: 'This post will be deleted',
            status: 'DRAFT',
        }, authorToken);
        if (status === 201 && data.data) {
            postId = data.data.id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (!postId) {
        logTest('Delete post (skipped)', false, 'Could not create test post');
        return;
    }
    // Test 1: Delete post as author
    try {
        const { status, data } = await makeRequest('DELETE', `/posts/${postId}`, undefined, authorToken);
        if (status === 200 && data.message) {
            logTest('Delete post as author', true);
        }
        else {
            logTest('Delete post as author', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Delete post as author', false, error.message);
    }
    // Test 2: Delete post without token (should fail)
    // Create another test post
    const testSlug2 = `delete-test-2-${Date.now()}`;
    let postId2 = null;
    try {
        const { status, data } = await makeRequest('POST', '/posts', {
            title: 'Delete Test Post 2',
            slug: testSlug2,
            content: 'This post will be deleted',
            status: 'DRAFT',
        }, authorToken);
        if (status === 201 && data.data) {
            postId2 = data.data.id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (postId2) {
        try {
            const { status, data } = await makeRequest('DELETE', `/posts/${postId2}`);
            if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
                logTest('Delete post without token (should fail)', true);
            }
            else {
                logTest('Delete post without token (should fail)', false, `Expected 401, got ${status}`);
            }
        }
        catch (error) {
            logTest('Delete post without token (should fail)', false, error.message);
        }
    }
}
async function runPostTests() {
    console.log('🧪 Starting Posts API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    await testGetAllPosts();
    await testGetPostBySlug();
    const postId = await testCreatePost();
    await testUpdatePost(postId);
    await testDeletePost();
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
    runPostTests()
        .then((summary) => {
        process.exit(summary.failed > 0 ? 1 : 0);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-posts.js.map