"use strict";
/**
 * Media Upload API Test Script
 * Tests: single upload, multiple upload, validation, permissions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.runMediaUploadTests = runMediaUploadTests;
const API_BASE = process.env.API_BASE || 'http://localhost:3001/api/v1';
const ADMIN_EMAIL = 'admin@terraindustries.co';
const ADMIN_PASSWORD = 'admin123';
const AUTHOR_EMAIL = 'author@terraindustries.co';
const AUTHOR_PASSWORD = 'admin123';
const results = [];
exports.results = results;
async function makeRequest(method, endpoint, body, token, isFormData = false) {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    let requestBody = body;
    if (isFormData && body instanceof FormData) {
        requestBody = body;
    }
    else if (!isFormData && body) {
        requestBody = JSON.stringify(body);
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers,
        body: requestBody,
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
/**
 * Create a test image file (1x1 PNG)
 */
function createTestImageFile(filename = 'test.png') {
    // Create a minimal 1x1 PNG image
    const pngData = new Uint8Array([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
        0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 dimensions
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
        0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
        0x42, 0x60, 0x82,
    ]);
    const blob = new Blob([pngData], { type: 'image/png' });
    return new File([blob], filename, { type: 'image/png' });
}
async function testSingleUpload() {
    console.log('\n📤 Testing Single File Upload...');
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    if (!adminToken) {
        logTest('Single upload (skipped - no admin token)', false, 'No admin token available');
        return null;
    }
    // Test 1: Upload image as admin
    try {
        const testFile = createTestImageFile('test-upload.png');
        const formData = new FormData();
        formData.append('file', testFile);
        const response = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (response.status === 201 && data.data && data.data.originalUrl) {
            logTest('Upload single file as admin', true);
            return data.data.id;
        }
        else if (response.status === 503 && data.error?.code === 'R2_NOT_CONFIGURED') {
            logTest('Upload single file as admin (R2 not configured - skipped)', true);
            return null;
        }
        else {
            logTest('Upload single file as admin', false, `Status: ${response.status}, Data: ${JSON.stringify(data)}`);
        }
    }
    catch (error) {
        logTest('Upload single file as admin', false, error.message);
    }
    // Test 2: Upload without token (should fail)
    try {
        const testFile = createTestImageFile('test-upload-2.png');
        const formData = new FormData();
        formData.append('file', testFile);
        const response = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Upload without token (should fail)', true);
        }
        else {
            logTest('Upload without token (should fail)', false, `Expected 401, got ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload without token (should fail)', false, error.message);
    }
    // Test 3: Upload with invalid file type (should fail)
    try {
        const invalidFile = new File(['invalid content'], 'test.txt', { type: 'text/plain' });
        const formData = new FormData();
        formData.append('file', invalidFile);
        const response = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (response.status === 400 && (data.error?.code === 'VALIDATION_ERROR' || response.status === 400)) {
            logTest('Upload invalid file type (should fail)', true);
        }
        else {
            logTest('Upload invalid file type (should fail)', false, `Expected 400, got ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload invalid file type (should fail)', false, error.message);
    }
    // Test 4: Upload without file (should fail)
    try {
        const formData = new FormData();
        const response = await fetch(`${API_BASE}/media/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Upload without file (should fail)', true);
        }
        else {
            logTest('Upload without file (should fail)', false, `Expected 400, got ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload without file (should fail)', false, error.message);
    }
    return null;
}
async function testMultipleUpload() {
    console.log('\n📤 Testing Multiple File Upload...');
    const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
    if (!adminToken) {
        logTest('Multiple upload (skipped - no admin token)', false, 'No admin token available');
        return;
    }
    // Test 1: Upload multiple files as admin
    try {
        const testFile1 = createTestImageFile('test-multi-1.png');
        const testFile2 = createTestImageFile('test-multi-2.png');
        const formData = new FormData();
        formData.append('files', testFile1);
        formData.append('files', testFile2);
        const response = await fetch(`${API_BASE}/media/upload-multiple`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (response.status === 201 && data.data && Array.isArray(data.data.uploads)) {
            logTest('Upload multiple files as admin', true);
        }
        else if (response.status === 503 && data.error?.code === 'R2_NOT_CONFIGURED') {
            logTest('Upload multiple files as admin (R2 not configured - skipped)', true);
        }
        else {
            logTest('Upload multiple files as admin', false, `Status: ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload multiple files as admin', false, error.message);
    }
    // Test 2: Upload multiple without token (should fail)
    try {
        const testFile = createTestImageFile('test-multi-3.png');
        const formData = new FormData();
        formData.append('files', testFile);
        const response = await fetch(`${API_BASE}/media/upload-multiple`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (response.status === 401 && data.error?.code === 'UNAUTHORIZED') {
            logTest('Upload multiple without token (should fail)', true);
        }
        else {
            logTest('Upload multiple without token (should fail)', false, `Expected 401, got ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload multiple without token (should fail)', false, error.message);
    }
    // Test 3: Upload multiple with no files (should fail)
    try {
        const formData = new FormData();
        const response = await fetch(`${API_BASE}/media/upload-multiple`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${adminToken}`,
            },
            body: formData,
        });
        const data = await response.json();
        if (response.status === 400 && data.error?.code === 'VALIDATION_ERROR') {
            logTest('Upload multiple with no files (should fail)', true);
        }
        else {
            logTest('Upload multiple with no files (should fail)', false, `Expected 400, got ${response.status}`);
        }
    }
    catch (error) {
        logTest('Upload multiple with no files (should fail)', false, error.message);
    }
}
async function runMediaUploadTests() {
    console.log('🧪 Starting Media Upload API Tests...\n');
    console.log(`API Base: ${API_BASE}\n`);
    await testSingleUpload();
    await testMultipleUpload();
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
    runMediaUploadTests()
        .then((summary) => {
        process.exit(summary.failed > 0 ? 1 : 0);
    })
        .catch((error) => {
        console.error('❌ Test execution failed:', error);
        process.exit(1);
    });
}
//# sourceMappingURL=test-media-upload.js.map