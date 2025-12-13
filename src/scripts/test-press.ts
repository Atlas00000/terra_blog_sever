/**
 * Press Releases API Test Script
 * Tests: CRUD operations
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001/api/v1';
const ADMIN_EMAIL = 'admin@terraindustries.co';
const ADMIN_PASSWORD = 'admin123';

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

async function testGetAllPressReleases() {
  console.log('\n📋 Testing Get All Press Releases...');

  // Test 1: Get all press releases (public)
  try {
    const { status, data } = await makeRequest('GET', '/press?page=1&limit=10');
    
    if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
      logTest('Get all press releases (public)', true);
    } else {
      logTest('Get all press releases (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get all press releases (public)', false, error.message);
  }

  // Test 2: Get featured press releases
  try {
    const { status, data } = await makeRequest('GET', '/press?featured=true');
    
    if (status === 200 && Array.isArray(data.data)) {
      logTest('Get featured press releases', true);
    } else {
      logTest('Get featured press releases', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get featured press releases', false, error.message);
  }

  // Test 3: Get press releases with pagination
  try {
    const { status, data } = await makeRequest('GET', '/press?page=1&limit=1');
    
    if (status === 200 && data.pagination && data.pagination.limit === 1) {
      logTest('Get press releases with pagination', true);
    } else {
      logTest('Get press releases with pagination', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get press releases with pagination', false, error.message);
  }
}

async function testGetPressReleaseBySlug() {
  console.log('\n🔍 Testing Get Press Release By Slug...');

  // Test 1: Get non-existent press release
  try {
    const { status, data } = await makeRequest('GET', '/press/non-existent-slug');
    
    if (status === 404 && data.error?.code === 'PRESS_RELEASE_NOT_FOUND') {
      logTest('Get non-existent press release (should fail)', true);
    } else {
      logTest('Get non-existent press release (should fail)', false, `Expected 404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get non-existent press release (should fail)', false, error.message);
  }
}

async function testCreatePressRelease() {
  console.log('\n➕ Testing Create Press Release...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Create press release (skipped - no admin token)', false, 'No admin token available');
    return null;
  }

  const testSlug = `test-press-release-${Date.now()}`;

  // Test 1: Create press release as admin
  try {
    const { status, data } = await makeRequest(
      'POST',
      '/press',
      {
        title: 'Test Press Release',
        slug: testSlug,
        excerpt: 'This is a test press release',
        content: 'This is the full content of the test press release.',
        publishedAt: new Date().toISOString(),
        featured: false,
      },
      adminToken
    );
    
    if (status === 201 && data.data && data.data.slug === testSlug) {
      logTest('Create press release as admin', true);
      return data.data.id;
    } else {
      logTest('Create press release as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Create press release as admin', false, error.message);
  }

  // Test 2: Create press release without token (should fail)
  try {
    const { status, data } = await makeRequest('POST', '/press', {
      title: 'Test Press Release 2',
      slug: `test-press-release-2-${Date.now()}`,
      content: 'Content',
      publishedAt: new Date().toISOString(),
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Create press release without token (should fail)', true);
    } else {
      logTest('Create press release without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create press release without token (should fail)', false, error.message);
  }

  // Test 3: Create press release with duplicate slug
  try {
    const { status, data } = await makeRequest(
      'POST',
      '/press',
      {
        title: 'Test Press Release 3',
        slug: testSlug,
        content: 'Content',
        publishedAt: new Date().toISOString(),
      },
      adminToken
    );
    
    if (status === 409 && data.error?.code === 'SLUG_EXISTS') {
      logTest('Create press release with duplicate slug (should fail)', true);
    } else {
      logTest('Create press release with duplicate slug (should fail)', false, `Expected 409, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create press release with duplicate slug (should fail)', false, error.message);
  }

  return null;
}

async function testUpdatePressRelease(pressReleaseId: string | null) {
  console.log('\n✏️ Testing Update Press Release...');

  if (!pressReleaseId) {
    logTest('Update press release (skipped)', false, 'No press release ID available');
    return;
  }

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Update press release (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Update press release as admin
  try {
    const { status, data } = await makeRequest(
      'PUT',
      `/press/${pressReleaseId}`,
      {
        featured: true,
      },
      adminToken
    );
    
    if (status === 200 && data.data && data.data.featured === true) {
      logTest('Update press release as admin', true);
    } else {
      logTest('Update press release as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Update press release as admin', false, error.message);
  }

  // Test 2: Update press release without token (should fail)
  try {
    const { status, data } = await makeRequest('PUT', `/press/${pressReleaseId}`, {
      featured: false,
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Update press release without token (should fail)', true);
    } else {
      logTest('Update press release without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Update press release without token (should fail)', false, error.message);
  }
}

async function testDeletePressRelease() {
  console.log('\n🗑️ Testing Delete Press Release...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Delete press release (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Create a test press release to delete
  const testSlug = `delete-test-${Date.now()}`;
  let pressReleaseId: string | null = null;

  try {
    const { status, data } = await makeRequest(
      'POST',
      '/press',
      {
        title: 'Delete Test Press Release',
        slug: testSlug,
        content: 'This press release will be deleted',
        publishedAt: new Date().toISOString(),
      },
      adminToken
    );
    
    if (status === 201 && data.data) {
      pressReleaseId = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (!pressReleaseId) {
    logTest('Delete press release (skipped)', false, 'Could not create test press release');
    return;
  }

  // Test 1: Delete press release as admin
  try {
    const { status, data } = await makeRequest('DELETE', `/press/${pressReleaseId}`, undefined, adminToken);
    
    if (status === 200 && data.message) {
      logTest('Delete press release as admin', true);
    } else {
      logTest('Delete press release as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Delete press release as admin', false, error.message);
  }

  // Test 2: Delete press release without token (should fail)
  // Create another test press release
  const testSlug2 = `delete-test-2-${Date.now()}`;
  let pressReleaseId2: string | null = null;

  try {
    const { status, data } = await makeRequest(
      'POST',
      '/press',
      {
        title: 'Delete Test Press Release 2',
        slug: testSlug2,
        content: 'This press release will be deleted',
        publishedAt: new Date().toISOString(),
      },
      adminToken
    );
    
    if (status === 201 && data.data) {
      pressReleaseId2 = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (pressReleaseId2) {
    try {
      const { status, data } = await makeRequest('DELETE', `/press/${pressReleaseId2}`);
      
      if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
        logTest('Delete press release without token (should fail)', true);
      } else {
        logTest('Delete press release without token (should fail)', false, `Expected 401, got ${status}`);
      }
    } catch (error: any) {
      logTest('Delete press release without token (should fail)', false, error.message);
    }
  }
}

async function runPressTests() {
  console.log('🧪 Starting Press Releases API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testGetAllPressReleases();
  await testGetPressReleaseBySlug();
  const pressReleaseId = await testCreatePressRelease();
  await testUpdatePressRelease(pressReleaseId);
  await testDeletePressRelease();

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
  runPressTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runPressTests, results };

