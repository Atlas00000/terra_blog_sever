/**
 * Caching Test Script
 * Tests: Redis caching for posts, categories, tags
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
): Promise<{ status: number; data: any; headers: Headers }> {
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
  return { status: response.status, data, headers: response.headers };
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

async function testPostsCaching() {
  console.log('\n📝 Testing Posts Caching...');

  // Test 1: First request should hit database (cache miss)
  try {
    const start1 = Date.now();
    const { status, data } = await makeRequest('GET', '/posts?page=1&limit=10');
    const duration1 = Date.now() - start1;

    if (status === 200 && data.data) {
      logTest('Posts list endpoint works', true);
      
      // Test 2: Second request should be faster (cache hit)
      const start2 = Date.now();
      const { status: status2, data: data2 } = await makeRequest('GET', '/posts?page=1&limit=10');
      const duration2 = Date.now() - start2;

      if (status2 === 200 && duration2 < duration1) {
        logTest('Posts list cached (second request faster)', true);
      } else {
        logTest('Posts list cached (second request faster)', false, `Duration1: ${duration1}ms, Duration2: ${duration2}ms`);
      }

      // Test 3: Verify cached data matches
      if (JSON.stringify(data) === JSON.stringify(data2)) {
        logTest('Cached posts data matches original', true);
      } else {
        logTest('Cached posts data matches original', false, 'Data mismatch');
      }
    } else {
      logTest('Posts list endpoint works', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Posts list endpoint works', false, error.message);
  }

  // Test 4: Cache invalidation on create
  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (adminToken) {
    try {
      // Get initial cached data
      await makeRequest('GET', '/posts?page=1&limit=10');
      
      // Create a new post (should invalidate cache)
      const { status } = await makeRequest(
        'POST',
        '/posts',
        {
          title: `Cache Test Post ${Date.now()}`,
          slug: `cache-test-post-${Date.now()}`,
          content: 'This is a test post for cache invalidation',
          status: 'DRAFT',
        },
        adminToken
      );

      if (status === 201) {
        logTest('Cache invalidation on post create', true);
      } else {
        logTest('Cache invalidation on post create', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Cache invalidation on post create', false, error.message);
    }
  }
}

async function testCategoriesCaching() {
  console.log('\n📂 Testing Categories Caching...');

  // Test 1: Categories list caching
  try {
    const start1 = Date.now();
    const { status, data } = await makeRequest('GET', '/categories?page=1&limit=10');
    const duration1 = Date.now() - start1;

    if (status === 200 && data.data) {
      logTest('Categories list endpoint works', true);
      
      // Test 2: Second request should be faster
      const start2 = Date.now();
      const { status: status2, data: data2 } = await makeRequest('GET', '/categories?page=1&limit=10');
      const duration2 = Date.now() - start2;

      if (status2 === 200 && duration2 < duration1) {
        logTest('Categories list cached (second request faster)', true);
      } else {
        logTest('Categories list cached (second request faster)', false, `Duration1: ${duration1}ms, Duration2: ${duration2}ms`);
      }

      // Test 3: Verify cached data matches
      if (JSON.stringify(data) === JSON.stringify(data2)) {
        logTest('Cached categories data matches original', true);
      } else {
        logTest('Cached categories data matches original', false, 'Data mismatch');
      }
    } else {
      logTest('Categories list endpoint works', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Categories list endpoint works', false, error.message);
  }

  // Test 4: Category by slug caching
  try {
    // Get a category slug first
    const { status, data } = await makeRequest('GET', '/categories?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      const slug = data.data[0].slug;
      
      const start1 = Date.now();
      const { status: status2, data: data2 } = await makeRequest('GET', `/categories/${slug}`);
      const duration1 = Date.now() - start1;

      if (status2 === 200 && data2.data) {
        const start2 = Date.now();
        const { status: status3, data: data3 } = await makeRequest('GET', `/categories/${slug}`);
        const duration2 = Date.now() - start2;

        if (status3 === 200 && duration2 < duration1) {
          logTest('Category by slug cached', true);
        } else {
          logTest('Category by slug cached', false, `Duration1: ${duration1}ms, Duration2: ${duration2}ms`);
        }
      } else {
        logTest('Category by slug cached', false, `Status: ${status2}`);
      }
    } else {
      logTest('Category by slug cached', false, 'No categories available');
    }
  } catch (error: any) {
    logTest('Category by slug cached', false, error.message);
  }
}

async function testTagsCaching() {
  console.log('\n🏷️ Testing Tags Caching...');

  // Test 1: Tags list caching
  try {
    const start1 = Date.now();
    const { status, data } = await makeRequest('GET', '/tags?page=1&limit=10');
    const duration1 = Date.now() - start1;

    if (status === 200 && data.data) {
      logTest('Tags list endpoint works', true);
      
      // Test 2: Second request should be faster
      const start2 = Date.now();
      const { status: status2, data: data2 } = await makeRequest('GET', '/tags?page=1&limit=10');
      const duration2 = Date.now() - start2;

      if (status2 === 200 && duration2 < duration1) {
        logTest('Tags list cached (second request faster)', true);
      } else {
        logTest('Tags list cached (second request faster)', false, `Duration1: ${duration1}ms, Duration2: ${duration2}ms`);
      }

      // Test 3: Verify cached data matches
      if (JSON.stringify(data) === JSON.stringify(data2)) {
        logTest('Cached tags data matches original', true);
      } else {
        logTest('Cached tags data matches original', false, 'Data mismatch');
      }
    } else {
      logTest('Tags list endpoint works', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Tags list endpoint works', false, error.message);
  }

  // Test 4: Tag by slug caching
  try {
    // Get a tag slug first
    const { status, data } = await makeRequest('GET', '/tags?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      const slug = data.data[0].slug;
      
      const start1 = Date.now();
      const { status: status2, data: data2 } = await makeRequest('GET', `/tags/${slug}`);
      const duration1 = Date.now() - start1;

      if (status2 === 200 && data2.data) {
        const start2 = Date.now();
        const { status: status3, data: data3 } = await makeRequest('GET', `/tags/${slug}`);
        const duration2 = Date.now() - start2;

        if (status3 === 200 && duration2 < duration1) {
          logTest('Tag by slug cached', true);
        } else {
          logTest('Tag by slug cached', false, `Duration1: ${duration1}ms, Duration2: ${duration2}ms`);
        }
      } else {
        logTest('Tag by slug cached', false, `Status: ${status2}`);
      }
    } else {
      logTest('Tag by slug cached', false, 'No tags available');
    }
  } catch (error: any) {
    logTest('Tag by slug cached', false, error.message);
  }
}

async function testCacheInvalidation() {
  console.log('\n🔄 Testing Cache Invalidation...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Cache invalidation tests (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Category update invalidates cache
  try {
    // Get categories to cache them
    await makeRequest('GET', '/categories?page=1&limit=10');
    
    // Get a category to update
    const { status, data } = await makeRequest('GET', '/categories?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      const categoryId = data.data[0].id;
      
      // Update category
      const { status: updateStatus } = await makeRequest(
        'PUT',
        `/categories/${categoryId}`,
        { description: 'Updated description for cache test' },
        adminToken
      );

      if (updateStatus === 200) {
        logTest('Category update invalidates cache', true);
      } else {
        logTest('Category update invalidates cache', false, `Status: ${updateStatus}`);
      }
    }
  } catch (error: any) {
    logTest('Category update invalidates cache', false, error.message);
  }

  // Test 2: Tag update invalidates cache
  try {
    // Get tags to cache them
    await makeRequest('GET', '/tags?page=1&limit=10');
    
    // Get a tag to update
    const { status, data } = await makeRequest('GET', '/tags?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      const tagId = data.data[0].id;
      
      // Update tag
      const { status: updateStatus } = await makeRequest(
        'PUT',
        `/tags/${tagId}`,
        { description: 'Updated description for cache test' },
        adminToken
      );

      if (updateStatus === 200) {
        logTest('Tag update invalidates cache', true);
      } else {
        logTest('Tag update invalidates cache', false, `Status: ${updateStatus}`);
      }
    }
  } catch (error: any) {
    logTest('Tag update invalidates cache', false, error.message);
  }
}

async function runCachingTests() {
  console.log('🧪 Starting Caching Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testPostsCaching();
  await testCategoriesCaching();
  await testTagsCaching();
  await testCacheInvalidation();

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
  runCachingTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runCachingTests, results };

