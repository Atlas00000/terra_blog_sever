/**
 * Media Management API Test Script
 * Tests: list, get, delete, permissions
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api/v1';
const ADMIN_EMAIL = 'admin@terraindustries.co';
const ADMIN_PASSWORD = 'admin123';
const AUTHOR_EMAIL = 'author@terraindustries.co';
const AUTHOR_PASSWORD = 'admin123';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  data?: any;
}

const results: TestResult[] = [];

async function makeRequest(
  method: string,
  endpoint: string,
  body?: any,
  token?: string
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
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

function logTest(name: string, passed: boolean, error?: string, data?: any) {
  results.push({ name, passed, error, data });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
}

async function getToken(email: string, password: string): Promise<string | null> {
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email,
      password,
    });
    if (status === 200 && data.data?.token) {
      return data.data.token;
    }
  } catch (error) {
    // Ignore
  }
  return null;
}

/**
 * Create a test image file
 */
function createTestImageFile(filename: string = 'test.png'): File {
  const pngData = new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
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

async function uploadTestFile(token: string): Promise<string | null> {
  try {
    const testFile = createTestImageFile(`test-${Date.now()}.png`);
    const formData = new FormData();
    formData.append('file', testFile);

    const response = await fetch(`${API_BASE}/media/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (response.status === 201 && data.data) {
      return data.data.id;
    }
  } catch (error) {
    // Ignore
  }
  return null;
}

async function testGetAllMedia() {
  console.log('\n📋 Testing Get All Media...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);

  // Test 1: Get all media as admin
  if (adminToken) {
    try {
      const { status, data } = await makeRequest('GET', '/media?page=1&limit=10', undefined, adminToken);
      
      if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
        logTest('Get all media as admin', true);
      } else {
        logTest('Get all media as admin', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Get all media as admin', false, error.message);
    }
  }

  // Test 2: Get all media as author (should fail - only admin/editor can view all)
  if (authorToken) {
    try {
      const { status, data } = await makeRequest('GET', '/media?page=1&limit=10', undefined, authorToken);
      
      if (status === 403 && data.error?.code === 'FORBIDDEN') {
        logTest('Get all media as author (should fail)', true);
      } else {
        logTest('Get all media as author (should fail)', false, `Expected 403, got ${status}`);
      }
    } catch (error: any) {
      logTest('Get all media as author (should fail)', false, error.message);
    }
  }

  // Test 3: Get all media without token (should fail)
  try {
    const { status, data } = await makeRequest('GET', '/media');
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Get all media without token (should fail)', true);
    } else {
      logTest('Get all media without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get all media without token (should fail)', false, error.message);
  }

  // Test 4: Get media with pagination
  if (adminToken) {
    try {
      const { status, data } = await makeRequest('GET', '/media?page=1&limit=1', undefined, adminToken);
      
      if (status === 200 && data.pagination && data.pagination.limit === 1) {
        logTest('Get media with pagination', true);
      } else {
        logTest('Get media with pagination', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Get media with pagination', false, error.message);
    }
  }
}

async function testGetMediaById() {
  console.log('\n🔍 Testing Get Media By ID...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Get media by ID (skipped - no admin token)', false, 'No admin token available');
    return null;
  }

  // Upload a test file first
  const mediaId = await uploadTestFile(adminToken);
  if (!mediaId) {
    // Check if R2 is not configured
    try {
      const testFile = createTestImageFile('test.png');
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
      if (response.status === 503 && data.error?.code === 'R2_NOT_CONFIGURED') {
        logTest('Get media by ID (skipped - R2 not configured)', true);
        return null;
      }
    } catch (error) {
      // Ignore
    }
    logTest('Get media by ID (skipped)', false, 'Could not upload test file');
    return null;
  }

  // Test 1: Get media by ID as admin
  try {
    const { status, data } = await makeRequest('GET', `/media/${mediaId}`, undefined, adminToken);
    
    if (status === 200 && data.data && data.data.id === mediaId) {
      logTest('Get media by ID as admin', true);
    } else {
      logTest('Get media by ID as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get media by ID as admin', false, error.message);
  }

  // Test 2: Get media with invalid ID
  try {
    const { status } = await makeRequest('GET', '/media/invalid-id', undefined, adminToken);
    
    if (status === 404 || status === 400) {
      logTest('Get media with invalid ID (should fail)', true);
    } else {
      logTest('Get media with invalid ID (should fail)', false, `Expected 404/400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get media with invalid ID (should fail)', false, error.message);
  }

  return mediaId;
}

async function testDeleteMedia() {
  console.log('\n🗑️ Testing Delete Media...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);

  if (!adminToken) {
    logTest('Delete media (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Delete media as admin
  const mediaId = await uploadTestFile(adminToken);
  if (mediaId) {
    try {
      const { status, data } = await makeRequest('DELETE', `/media/${mediaId}`, undefined, adminToken);
      
      if (status === 200 && data.message) {
        logTest('Delete media as admin', true);
      } else {
        logTest('Delete media as admin', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Delete media as admin', false, error.message);
    }
  }

  // Test 2: Delete media without token (should fail)
  const mediaId2 = await uploadTestFile(adminToken);
  if (mediaId2) {
    try {
      const { status, data } = await makeRequest('DELETE', `/media/${mediaId2}`);
      
      if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
        logTest('Delete media without token (should fail)', true);
      } else {
        logTest('Delete media without token (should fail)', false, `Expected 401, got ${status}`);
      }
    } catch (error: any) {
      logTest('Delete media without token (should fail)', false, error.message);
    }
  }

  // Test 3: Delete media with invalid ID
  try {
    const { status } = await makeRequest('DELETE', '/media/invalid-id', undefined, adminToken);
    
    if (status === 404 || status === 400) {
      logTest('Delete media with invalid ID (should fail)', true);
    } else {
      logTest('Delete media with invalid ID (should fail)', false, `Expected 404/400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Delete media with invalid ID (should fail)', false, error.message);
  }
}

async function runMediaManagementTests() {
  console.log('🧪 Starting Media Management API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testGetAllMedia();
  await testGetMediaById();
  await testDeleteMedia();

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
  runMediaManagementTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runMediaManagementTests, results };

