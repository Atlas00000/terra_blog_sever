/**
 * Tags API Test Script
 * Tests: CRUD operations, permissions, validation
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

async function testGetAllTags() {
  console.log('\n📋 Testing Get All Tags...');

  // Test 1: Get all tags (public)
  try {
    const { status, data } = await makeRequest('GET', '/tags?page=1&limit=10');
    
    if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
      logTest('Get all tags (public)', true);
    } else {
      logTest('Get all tags (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get all tags (public)', false, error.message);
  }

  // Test 2: Get tags with pagination
  try {
    const { status, data } = await makeRequest('GET', '/tags?page=1&limit=1');
    
    if (status === 200 && data.pagination && data.pagination.limit === 1) {
      logTest('Get tags with pagination', true);
    } else {
      logTest('Get tags with pagination', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get tags with pagination', false, error.message);
  }

  // Test 3: Search tags
  try {
    const { status, data } = await makeRequest('GET', '/tags?search=AI');
    
    if (status === 200 && Array.isArray(data.data)) {
      logTest('Search tags', true);
    } else {
      logTest('Search tags', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Search tags', false, error.message);
  }
}

async function testGetTagBySlug() {
  console.log('\n🔍 Testing Get Tag By Slug...');

  // Test 1: Get tag by slug (public)
  try {
    const { status, data } = await makeRequest('GET', '/tags/ai-autonomous');
    
    if (status === 200 && data.data && data.data.slug === 'ai-autonomous') {
      logTest('Get tag by slug (public)', true);
    } else {
      logTest('Get tag by slug (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get tag by slug (public)', false, error.message);
  }

  // Test 2: Get non-existent tag
  try {
    const { status, data } = await makeRequest('GET', '/tags/non-existent-tag');
    
    if (status === 404 && data.error?.code === 'TAG_NOT_FOUND') {
      logTest('Get non-existent tag (should fail)', true);
    } else {
      logTest('Get non-existent tag (should fail)', false, `Expected 404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get non-existent tag (should fail)', false, error.message);
  }
}

async function testCreateTag() {
  console.log('\n➕ Testing Create Tag...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Create tag (skipped - no admin token)', false, 'No admin token available');
    return null;
  }

  const testSlug = `test-tag-${Date.now()}`;
  const testName = `Test Tag ${Date.now()}`;

  // Test 1: Create tag as admin
  try {
    const { status, data } = await makeRequest(
      'POST',
      '/tags',
      {
        name: testName,
        slug: testSlug,
        description: 'Test tag description',
      },
      adminToken
    );
    
    if (status === 201 && data.data && data.data.slug === testSlug) {
      logTest('Create tag as admin', true);
      return data.data.id;
    } else {
      logTest('Create tag as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Create tag as admin', false, error.message);
  }

  // Test 2: Create tag as author (should fail)
  const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
  if (authorToken) {
    try {
      const { status, data } = await makeRequest(
        'POST',
        '/tags',
        {
          name: 'Test Tag 2',
          slug: `test-tag-2-${Date.now()}`,
        },
        authorToken
      );
      
      if (status === 403 && data.error?.code === 'FORBIDDEN') {
        logTest('Create tag as author (should fail)', true);
      } else {
        logTest('Create tag as author (should fail)', false, `Expected 403, got ${status}`);
      }
    } catch (error: any) {
      logTest('Create tag as author (should fail)', false, error.message);
    }
  }

  // Test 3: Create tag without token (should fail)
  try {
    const { status, data } = await makeRequest('POST', '/tags', {
      name: 'Test Tag 3',
      slug: `test-tag-3-${Date.now()}`,
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Create tag without token (should fail)', true);
    } else {
      logTest('Create tag without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create tag without token (should fail)', false, error.message);
  }

  // Test 4: Create tag with duplicate name (use the name we just created)
  if (testName) {
    try {
      const { status, data } = await makeRequest(
        'POST',
        '/tags',
        {
          name: testName,
          slug: `test-tag-4-${Date.now()}`,
        },
        adminToken
      );
      
      if (status === 409 && data.error?.code === 'TAG_NAME_EXISTS') {
        logTest('Create tag with duplicate name (should fail)', true);
      } else {
        logTest('Create tag with duplicate name (should fail)', false, `Expected 409, got ${status}`);
      }
    } catch (error: any) {
      logTest('Create tag with duplicate name (should fail)', false, error.message);
    }
  }

  // Test 5: Create tag with duplicate slug (use the slug we just created)
  if (testSlug) {
    try {
      const { status, data } = await makeRequest(
        'POST',
        '/tags',
        {
          name: `Test Tag 5 ${Date.now()}`,
          slug: testSlug,
        },
        adminToken
      );
      
      if (status === 409 && data.error?.code === 'TAG_SLUG_EXISTS') {
        logTest('Create tag with duplicate slug (should fail)', true);
      } else {
        logTest('Create tag with duplicate slug (should fail)', false, `Expected 409, got ${status}`);
      }
    } catch (error: any) {
      logTest('Create tag with duplicate slug (should fail)', false, error.message);
    }
  }

  // Test 6: Create tag with invalid slug format
  try {
    const { status, data } = await makeRequest(
      'POST',
      '/tags',
      {
        name: 'Test Tag 6',
        slug: 'Invalid Slug Format!',
      },
      adminToken
    );
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Create tag with invalid slug format (should fail)', true);
    } else {
      logTest('Create tag with invalid slug format (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create tag with invalid slug format (should fail)', false, error.message);
  }

  return null;
}

async function testUpdateTag(adminToken: string | null, tagId: string | null) {
  console.log('\n✏️ Testing Update Tag...');

  if (!adminToken || !tagId) {
    logTest('Update tag (skipped)', false, 'No admin token or tag ID available');
    return;
  }

  // Test 1: Update tag as admin
  try {
    const { status, data } = await makeRequest(
      'PUT',
      `/tags/${tagId}`,
      {
        description: 'Updated description',
      },
      adminToken
    );
    
    if (status === 200 && data.data && data.data.description === 'Updated description') {
      logTest('Update tag as admin', true);
    } else {
      logTest('Update tag as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Update tag as admin', false, error.message);
  }

  // Test 2: Update tag with invalid ID
  try {
    const { status } = await makeRequest(
      'PUT',
      '/tags/invalid-id',
      { name: 'Test' },
      adminToken
    );
    
    if (status === 400 || status === 404) {
      logTest('Update tag with invalid ID (should fail)', true);
    } else {
      logTest('Update tag with invalid ID (should fail)', false, `Expected 400/404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Update tag with invalid ID (should fail)', false, error.message);
  }

  // Test 3: Update tag without token (should fail)
  try {
    const { status, data } = await makeRequest('PUT', `/tags/${tagId}`, {
      description: 'Test',
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Update tag without token (should fail)', true);
    } else {
      logTest('Update tag without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Update tag without token (should fail)', false, error.message);
  }
}

async function testDeleteTag(adminToken: string | null) {
  console.log('\n🗑️ Testing Delete Tag...');

  if (!adminToken) {
    logTest('Delete tag (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Create a test tag to delete
  const testSlug = `delete-test-${Date.now()}`;
  let tagId: string | null = null;

  try {
    const { status, data } = await makeRequest(
      'POST',
      '/tags',
      {
        name: 'Delete Test Tag',
        slug: testSlug,
        description: 'This tag will be deleted',
      },
      adminToken
    );
    
    if (status === 201 && data.data) {
      tagId = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (!tagId) {
    logTest('Delete tag (skipped)', false, 'Could not create test tag');
    return;
  }

  // Test 1: Delete tag as admin
  try {
    const { status, data } = await makeRequest('DELETE', `/tags/${tagId}`, undefined, adminToken);
    
    if (status === 200 && data.message) {
      logTest('Delete tag as admin', true);
    } else {
      logTest('Delete tag as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Delete tag as admin', false, error.message);
  }

  // Test 2: Delete tag as author (should fail)
  const authorToken = await getToken(AUTHOR_EMAIL, AUTHOR_PASSWORD);
  if (authorToken) {
    // Create another test tag
    const testSlug2 = `delete-test-2-${Date.now()}`;
    let tagId2: string | null = null;

    try {
      const { status, data } = await makeRequest(
        'POST',
        '/tags',
        {
          name: 'Delete Test Tag 2',
          slug: testSlug2,
        },
        adminToken
      );
      
      if (status === 201 && data.data) {
        tagId2 = data.data.id;
      }
    } catch (error) {
      // Ignore
    }

    if (tagId2) {
      try {
        const { status, data } = await makeRequest('DELETE', `/tags/${tagId2}`, undefined, authorToken);
        
        if (status === 403 && data.error?.code === 'FORBIDDEN') {
          logTest('Delete tag as author (should fail)', true);
        } else {
          logTest('Delete tag as author (should fail)', false, `Expected 403, got ${status}`);
        }
      } catch (error: any) {
        logTest('Delete tag as author (should fail)', false, error.message);
      }
    }
  }

  // Test 3: Delete tag with posts (should fail)
  // Try to delete a tag that has posts (ai-autonomous)
  try {
    const { status, data } = await makeRequest('GET', '/tags/ai-autonomous');
    if (status === 200 && data.data) {
      const tagWithPostsId = data.data.id;
      
      const deleteResponse = await makeRequest('DELETE', `/tags/${tagWithPostsId}`, undefined, adminToken);
      
      if (deleteResponse.status === 409 && deleteResponse.data.error?.code === 'TAG_HAS_POSTS') {
        logTest('Delete tag with posts (should fail)', true);
      } else {
        logTest('Delete tag with posts (should fail)', false, `Expected 409, got ${deleteResponse.status}`);
      }
    }
  } catch (error: any) {
    logTest('Delete tag with posts (should fail)', false, error.message);
  }
}

async function runTagTests() {
  console.log('🧪 Starting Tags API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testGetAllTags();
  await testGetTagBySlug();
  const tagId = await testCreateTag();
  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  await testUpdateTag(adminToken, tagId);
  await testDeleteTag(adminToken);

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
  runTagTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runTagTests, results };

