"use strict";
/**
 * Products API Test Script
 * Tests: CRUD operations, permissions, validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.runProductTests = runProductTests;
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
async function testGetAllProducts() {
    console.log('\n📋 Testing Get All Products...');
    // Test 1: Get all products (public)
    try {
        const { status, data } = await makeRequest('GET', '/products?page=1&limit=10');
        if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
            logTest('Get all products (public)', true);
        }
        else {
            logTest('Get all products (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get all products (public)', false, error.message);
    }
    // Test 2: Get products with pagination
    try {
        const { status, data } = await makeRequest('GET', '/products?page=1&limit=1');
        if (status === 200 && data.pagination && data.pagination.limit === 1) {
            logTest('Get products with pagination', true);
        }
        else {
            logTest('Get products with pagination', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get products with pagination', false, error.message);
    }
    // Test 3: Search products
    try {
        const { status, data } = await makeRequest('GET', '/products?search=Artemis');
        if (status === 200 && Array.isArray(data.data)) {
            logTest('Search products', true);
        }
        else {
            logTest('Search products', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Search products', false, error.message);
    }
}
async function testGetProductBySlug() {
    console.log('\n🔍 Testing Get Product By Slug...');
    // Test 1: Get product by slug (public)
    try {
        const { status, data } = await makeRequest('GET', '/products/artemis');
        if (status === 200 && data.data && data.data.slug === 'artemis') {
            logTest('Get product by slug (public)', true);
        }
        else {
            logTest('Get product by slug (public)', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Get product by slug (public)', false, error.message);
    }
    // Test 2: Get non-existent product
    try {
        const { status, data } = await makeRequest('GET', '/products/non-existent-product');
        if (status === 404 && data.error?.code === 'PRODUCT_NOT_FOUND') {
            logTest('Get non-existent product (should fail)', true);
        }
        else {
            logTest('Get non-existent product (should fail)', false, `Expected 404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Get non-existent product (should fail)', false, error.message);
    }
}
async function testCreateProduct() {
    console.log('\n➕ Testing Create Product...');
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    if (!adminToken) {
        logTest('Create product (skipped - no admin token)', false, 'No admin token available');
        return null;
    }
    const testSlug = `test-product-${Date.now()}`;
    const testName = `Test Product ${Date.now()}`;
    // Test 1: Create product as admin
    try {
        const { status, data } = await makeRequest('POST', '/products', {
            name: testName,
            slug: testSlug,
            description: 'Test product description',
            features: ['Feature 1', 'Feature 2'],
            specifications: {
                range: '10km',
                responseTime: '< 1 second',
            },
            images: [],
            videos: [],
        }, adminToken);
        if (status === 201 && data.data && data.data.slug === testSlug) {
            logTest('Create product as admin', true);
            return data.data.id;
        }
        else {
            logTest('Create product as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Create product as admin', false, error.message);
    }
    // Test 2: Create product as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        try {
            const { status, data } = await makeRequest('POST', '/products', {
                name: 'Test Product 2',
                slug: `test-product-2-${Date.now()}`,
                description: 'Test description',
                features: ['Feature 1'],
            }, authorToken);
            if (status === 403 && data.error?.code === 'FORBIDDEN') {
                logTest('Create product as author (should fail)', true);
            }
            else {
                logTest('Create product as author (should fail)', false, `Expected 403, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create product as author (should fail)', false, error.message);
        }
    }
    // Test 3: Create product without token (should fail)
    try {
        const { status, data } = await makeRequest('POST', '/products', {
            name: 'Test Product 3',
            slug: `test-product-3-${Date.now()}`,
            description: 'Test description',
            features: ['Feature 1'],
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Create product without token (should fail)', true);
        }
        else {
            logTest('Create product without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create product without token (should fail)', false, error.message);
    }
    // Test 4: Create product with duplicate name (use the name we just created)
    if (testName) {
        try {
            const { status, data } = await makeRequest('POST', '/products', {
                name: testName,
                slug: `test-product-4-${Date.now()}`,
                description: 'Test description',
                features: ['Feature 1'],
            }, adminToken);
            if (status === 409 && data.error?.code === 'PRODUCT_NAME_EXISTS') {
                logTest('Create product with duplicate name (should fail)', true);
            }
            else {
                logTest('Create product with duplicate name (should fail)', false, `Expected 409, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create product with duplicate name (should fail)', false, error.message);
        }
    }
    // Test 5: Create product with duplicate slug (use the slug we just created)
    if (testSlug) {
        try {
            const { status, data } = await makeRequest('POST', '/products', {
                name: `Test Product 5 ${Date.now()}`,
                slug: testSlug,
                description: 'Test description',
                features: ['Feature 1'],
            }, adminToken);
            if (status === 409 && data.error?.code === 'PRODUCT_SLUG_EXISTS') {
                logTest('Create product with duplicate slug (should fail)', true);
            }
            else {
                logTest('Create product with duplicate slug (should fail)', false, `Expected 409, got ${status}`);
            }
        }
        catch (error) {
            logTest('Create product with duplicate slug (should fail)', false, error.message);
        }
    }
    // Test 6: Create product with invalid slug format
    try {
        const { status, data } = await makeRequest('POST', '/products', {
            name: 'Test Product 6',
            slug: 'Invalid Slug Format!',
            description: 'Test description',
            features: ['Feature 1'],
        }, adminToken);
        if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Create product with invalid slug format (should fail)', true);
        }
        else {
            logTest('Create product with invalid slug format (should fail)', false, `Expected 400, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create product with invalid slug format (should fail)', false, error.message);
    }
    // Test 7: Create product without required fields
    try {
        const { status, data } = await makeRequest('POST', '/products', {
            name: 'Test Product 7',
            slug: `test-product-7-${Date.now()}`,
            // Missing description and features
        }, adminToken);
        if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Create product without required fields (should fail)', true);
        }
        else {
            logTest('Create product without required fields (should fail)', false, `Expected 400, got ${status}`);
        }
    }
    catch (error) {
        logTest('Create product without required fields (should fail)', false, error.message);
    }
    return null;
}
async function testUpdateProduct(adminToken, productId) {
    console.log('\n✏️ Testing Update Product...');
    if (!adminToken || !productId) {
        logTest('Update product (skipped)', false, 'No admin token or product ID available');
        return;
    }
    // Test 1: Update product as admin
    try {
        const { status, data } = await makeRequest('PUT', `/products/${productId}`, {
            description: 'Updated description',
            features: ['Updated Feature 1', 'Updated Feature 2'],
        }, adminToken);
        if (status === 200 && data.data && data.data.description === 'Updated description') {
            logTest('Update product as admin', true);
        }
        else {
            logTest('Update product as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Update product as admin', false, error.message);
    }
    // Test 2: Update product with invalid ID
    try {
        const { status } = await makeRequest('PUT', '/products/invalid-id', { name: 'Test' }, adminToken);
        if (status === 400 || status === 404) {
            logTest('Update product with invalid ID (should fail)', true);
        }
        else {
            logTest('Update product with invalid ID (should fail)', false, `Expected 400/404, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update product with invalid ID (should fail)', false, error.message);
    }
    // Test 3: Update product without token (should fail)
    try {
        const { status, data } = await makeRequest('PUT', `/products/${productId}`, {
            description: 'Test',
        });
        if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Update product without token (should fail)', true);
        }
        else {
            logTest('Update product without token (should fail)', false, `Expected 401, got ${status}`);
        }
    }
    catch (error) {
        logTest('Update product without token (should fail)', false, error.message);
    }
}
async function testDeleteProduct(adminToken) {
    console.log('\n🗑️ Testing Delete Product...');
    if (!adminToken) {
        logTest('Delete product (skipped - no admin token)', false, 'No admin token available');
        return;
    }
    // Create a test product to delete
    const testSlug = `delete-test-${Date.now()}`;
    let productId = null;
    try {
        const { status, data } = await makeRequest('POST', '/products', {
            name: 'Delete Test Product',
            slug: testSlug,
            description: 'This product will be deleted',
            features: ['Feature 1'],
        }, adminToken);
        if (status === 201 && data.data) {
            productId = data.data.id;
        }
    }
    catch (error) {
        // Ignore
    }
    if (!productId) {
        logTest('Delete product (skipped)', false, 'Could not create test product');
        return;
    }
    // Test 1: Delete product as admin
    try {
        const { status, data } = await makeRequest('DELETE', `/products/${productId}`, undefined, adminToken);
        if (status === 200 && data.message) {
            logTest('Delete product as admin', true);
        }
        else {
            logTest('Delete product as admin', false, `Status: ${status}`);
        }
    }
    catch (error) {
        logTest('Delete product as admin', false, error.message);
    }
    // Test 2: Delete product as author (should fail)
    const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
    if (authorToken) {
        // Create another test product
        const testSlug2 = `delete-test-2-${Date.now()}`;
        let productId2 = null;
        try {
            const { status, data } = await makeRequest('POST', '/products', {
                name: 'Delete Test Product 2',
                slug: testSlug2,
                description: 'This product will be deleted',
                features: ['Feature 1'],
            }, adminToken);
            if (status === 201 && data.data) {
                productId2 = data.data.id;
            }
        }
        catch (error) {
            // Ignore
        }
        if (productId2) {
            try {
                const { status, data } = await makeRequest('DELETE', `/products/${productId2}`, undefined, authorToken);
                if (status === 403 && data.error?.code === 'FORBIDDEN') {
                    logTest('Delete product as author (should fail)', true);
                }
                else {
                    logTest('Delete product as author (should fail)', false, `Expected 403, got ${status}`);
                }
            }
            catch (error) {
                logTest('Delete product as author (should fail)', false, error.message);
            }
        }
    }
}
async function runProductTests() {
    console.log('🧪 Starting Products API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    await testGetAllProducts();
    await testGetProductBySlug();
    const productId = await testCreateProduct();
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    await testUpdateProduct(adminToken, productId);
    await testDeleteProduct(adminToken);
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
    runProductTests()
        .then((summary) => {
        process.exit(summary.failed > 0 ? 1 : 0);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-products.js.map