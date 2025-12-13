"use strict";
/**
 * User Management API Test Script
 * Tests: CRUD operations, permissions, pagination
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.runUserTests = runUserTests;
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
async function testGetAllUsers() {
    console.log('\n📋 Testing Get All Users...');
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    // Test 1: Get all users as admin
    if (adminToken) {
        try {
            const { status, data } = await makeRequest('GET', '/users?page=1&limit=10', undefined, adminToken);
            if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
                logTest('Get all users as admin', true);
            }
            else {
                logTest('Get all users as admin', false, `Status: ${status}`);
            }
        }
        catch (error) {
            logTest('Get all users as admin', false, error.message);
        }
    }
    // Test 2: Get all users as author (should fail)
    if (authorToken) {
        try {
            const { status, data } = await makeRequest('GET', '/users', undefined, authorToken);
            if (status === 403 && data.error?.code === 'FORBIDDEN') {
                logTest('Get all users as author (should fail)', true);
            }
            else {
                logTest('Get all users as author (should fail)', false, `Expected 403, got ${status}`);
            }
        }
        catch (error) {
            logTest('Get all users as author (should fail)', false, error.message);
        }
    }
    // Test 3: Get all users without token (should fail)
    try {
        const { status, data } = await makeRequest('GET', '/users');
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Get all users without token (should fail)', true);
        }
        else {
            logTest('Get all users without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get all users without token (should fail)', false, error.message);
    }
    // Test 4: Pagination
    if (adminToken) {
        try {
            const { status, data } = await makeRequest('GET', '/users?page=1&limit=1', undefined, adminToken);
            if (status === 200 && data.pagination && data.pagination.limit === 1) {
                logTest('Get users with pagination', true);
            }
            else {
                logTest('Get users with pagination', false, `Status: ${status}`);
            }
        }
        catch (error) {
            logTest('Get users with pagination', false, error.message);
        }
    }
    return adminToken;
}
async function testGetUserById(adminToken) {
    console.log('\n🔍 Testing Get User By ID...');
    if (!adminToken) {
        logTest('Get user by ID (skipped - no admin token)', false, 'No admin token available');
        return null;
    }
    // First, get a user ID
    let userId = null;
    try {
        const { status, data } = await makeRequest('GET', '/users?page=1&limit=1', undefined, adminToken);
        if (status === 200 && data.data && data.data.length > 0) {
            userId = data.data[0].id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (!userId) {
        logTest('Get user by ID (skipped)', false, 'No user ID available');
        return null;
    }
    // Test 1: Get user by ID as admin
    try {
        const { status, data } = await makeRequest('GET', `/users/${userId}`, undefined, adminToken);
        if (status === 200 && data.data && data.data.id === userId) {
            logTest('Get user by ID as admin', true);
        }
        else {
            logTest('Get user by ID as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get user by ID as admin', false, error.message);
    }
    // Test 2: Get user by invalid ID
    try {
        const { status, data } = await makeRequest('GET', '/users/invalid-id', undefined, adminToken);
        if (status === 400 || status === 404) {
            logTest('Get user by invalid ID (should fail)', true);
        }
        else {
            logTest('Get user by invalid ID (should fail)', false, `Expected 400/404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get user by invalid ID (should fail)', false, error.message);
    }
    return userId;
}
async function testGetUserBySlug() {
    console.log('\n🔍 Testing Get User By Slug...');
    // Test 1: Get user by slug (public endpoint)
    try {
        const { status, data } = await makeRequest('GET', '/users/slug/test-author');
        if (status === 200 && data.data && data.data.slug === 'test-author') {
            logTest('Get user by slug (public)', true);
        }
        else {
            logTest('Get user by slug (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get user by slug (public)', false, error.message);
    }
    // Test 2: Get user by non-existent slug
    try {
        const { status, data } = await makeRequest('GET', '/users/slug/non-existent-slug');
        if (status === 404 && data.error?.code === 'USER_NOT_FOUND') {
            logTest('Get user by non-existent slug (should fail)', true);
        }
        else {
            logTest('Get user by non-existent slug (should fail)', false, `Expected 404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get user by non-existent slug (should fail)', false, error.message);
    }
}
async function testCreateUser(adminToken) {
    console.log('\n➕ Testing Create User...');
    if (!adminToken) {
        logTest('Create user (skipped - no admin token)', false, 'No admin token available');
        return null;
    }
    const testEmail = `test-user-${Date.now()}@example.com`;
    // Test 1: Create user as admin
    try {
        const { status, data } = await makeRequest('POST', '/users', {
            email: testEmail,
            password: 'test12345',
            name: 'Test User',
            role: 'AUTHOR',
        }, adminToken);
        if (status === 201 && data.data && data.data.email === testEmail) {
            logTest('Create user as admin', true);
            return data.data.id;
        }
        else {
            logTest('Create user as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Create user as admin', false, error.message);
    }
    // Test 2: Create user as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        try {
            const { status, data } = await makeRequest('POST', '/users', {
                email: `test-user-2-${Date.now()}@example.com`,
                password: 'test12345',
                name: 'Test User 2',
            }, authorToken);
            if (status === 403 && data.error?.code === 'FORBIDDEN') {
                logTest('Create user as author (should fail)', true);
            }
            else {
                logTest('Create user as author (should fail)', false, `Expected 403, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create user as author (should fail)', false, error.message);
        }
    }
    // Test 3: Create user with duplicate email
    try {
        const { status, data } = await makeRequest('POST', '/users', {
            email: testEmail,
            password: 'test12345',
            name: 'Duplicate User',
        }, adminToken);
        if (status === 409 && data.error?.code === 'USER_EXISTS') {
            logTest('Create user with duplicate email (should fail)', true);
        }
        else {
            logTest('Create user with duplicate email (should fail)', false, `Expected 409, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create user with duplicate email (should fail)', false, error.message);
    }
    return null;
}
async function testUpdateUser(adminToken, userId) {
    console.log('\n✏️ Testing Update User...');
    if (!adminToken || !userId) {
        logTest('Update user (skipped)', false, 'No admin token or user ID available');
        return;
    }
    // Test 1: Update user as admin
    try {
        const { status, data } = await makeRequest('PUT', `/users/${userId}`, {
            name: 'Updated Name',
            bio: 'Updated bio',
        }, adminToken);
        if (status === 200 && data.data && data.data.name === 'Updated Name') {
            logTest('Update user as admin', true);
        }
        else {
            logTest('Update user as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Update user as admin', false, error.message);
    }
    // Test 2: Update user with invalid ID
    try {
        const { status } = await makeRequest('PUT', '/users/invalid-id', { name: 'Test' }, adminToken);
        if (status === 400 || status === 404) {
            logTest('Update user with invalid ID (should fail)', true);
        }
        else {
            logTest('Update user with invalid ID (should fail)', false, `Expected 400/404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update user with invalid ID (should fail)', false, error.message);
    }
}
async function testDeleteUser(adminToken) {
    console.log('\n🗑️ Testing Delete User...');
    if (!adminToken) {
        logTest('Delete user (skipped - no admin token)', false, 'No admin token available');
        return;
    }
    // Create a test user to delete
    const testEmail = `delete-test-${Date.now()}@example.com`;
    let userId = null;
    try {
        const { status, data } = await makeRequest('POST', '/users', {
            email: testEmail,
            password: 'test12345',
            name: 'Delete Test User',
        }, adminToken);
        if (status === 201 && data.data) {
            userId = data.data.id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (!userId) {
        logTest('Delete user (skipped)', false, 'Could not create test user');
        return;
    }
    // Test 1: Delete user as admin
    try {
        const { status, data } = await makeRequest('DELETE', `/users/${userId}`, undefined, adminToken);
        if (status === 200 && data.message) {
            logTest('Delete user as admin', true);
        }
        else {
            logTest('Delete user as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Delete user as admin', false, error.message);
    }
    // Test 2: Delete user as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        // Create another test user
        const testEmail2 = `delete-test-2-${Date.now()}@example.com`;
        let userId2 = null;
        try {
            const { status, data } = await makeRequest('POST', '/users', {
                email: testEmail2,
                password: 'test12345',
                name: 'Delete Test User 2',
            }, adminToken);
            if (status === 201 && data.data) {
                userId2 = data.data.id;
            }
        }
        catch (error) {
            // Ignore
        }
        if (userId2) {
            try {
                const { status, data } = await makeRequest('DELETE', `/users/${userId2}`, undefined, authorToken);
                if (status === 403 && data.error?.code === 'FORBIDDEN') {
                    logTest('Delete user as author (should fail)', true);
                }
                else {
                    logTest('Delete user as author (should fail)', false, `Expected 403, got ${status}`);
                }
            }
            catch (error) {
                logTest('Delete user as author (should fail)', false, error.message);
            }
        }
    }
}
async function runUserTests() {
    console.log('🧪 Starting User Management API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    const adminToken = await testGetAllUsers();
    const userId = await testGetUserById(adminToken);
    await testGetUserBySlug();
    const createdUserId = await testCreateUser(adminToken);
    await testUpdateUser(adminToken, userId || createdUserId);
    await testDeleteUser(adminToken);
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
    runUserTests()
        .then((summary) => {
        process.exit(summary.failed > 0 ? 1 : 0);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-users.js.map