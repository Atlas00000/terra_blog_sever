/**
 * Soft Deletes Test Script
 * Tests: Post and Comment soft delete behavior
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

async function testPostSoftDelete() {
  console.log('\n📝 Testing Post Soft Delete...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Post soft delete tests (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Create a post
  let postId: string | null = null;
  let postSlug: string | null = null;
  try {
    const { status, data } = await makeRequest(
      'POST',
      '/posts',
      {
        title: `Soft Delete Test Post ${Date.now()}`,
        slug: `soft-delete-test-${Date.now()}`,
        content: 'This post will be soft deleted',
        status: 'PUBLISHED',
      },
      adminToken
    );

    if (status === 201 && data.data) {
      postId = data.data.id;
      postSlug = data.data.slug;
      logTest('Create post for soft delete test', true);
    } else {
      logTest('Create post for soft delete test', false, `Status: ${status}`);
      return;
    }
  } catch (error: any) {
    logTest('Create post for soft delete test', false, error.message);
    return;
  }

  if (!postId || !postSlug) {
    return;
  }

  // Test 2: Post is visible before deletion
  try {
    const { status, data } = await makeRequest('GET', `/posts/${postSlug}`);
    
    if (status === 200 && data.data && data.data.id === postId) {
      logTest('Post is visible before soft delete', true);
    } else {
      logTest('Post is visible before soft delete', false, `Status: ${status}, Data: ${JSON.stringify(data).substring(0, 100)}`);
    }
  } catch (error: any) {
    logTest('Post is visible before soft delete', false, error.message);
  }

  // Test 3: Delete post (soft delete)
  try {
    const { status, data } = await makeRequest('DELETE', `/posts/${postId}`, undefined, adminToken);
    
    if (status === 200 && data.message) {
      logTest('Post soft delete succeeds', true);
    } else {
      logTest('Post soft delete succeeds', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Post soft delete succeeds', false, error.message);
  }

  // Test 4: Post is not visible after soft delete (public endpoint)
  try {
    const { status, data } = await makeRequest('GET', `/posts/${postSlug}`);
    
    if (status === 404 && data.error?.code === 'POST_NOT_FOUND') {
      logTest('Post is hidden from public after soft delete', true);
    } else {
      logTest('Post is hidden from public after soft delete', false, `Status: ${status}, Data: ${JSON.stringify(data).substring(0, 100)}`);
    }
  } catch (error: any) {
    logTest('Post is hidden from public after soft delete', false, error.message);
  }

  // Test 5: Post is not in list after soft delete
  try {
    const { status, data } = await makeRequest('GET', '/posts?page=1&limit=100');
    
    if (status === 200 && data.data) {
      const found = data.data.find((p: any) => p.id === postId);
      if (!found) {
        logTest('Post is not in list after soft delete', true);
      } else {
        logTest('Post is not in list after soft delete', false, 'Post still in list');
      }
    } else {
      logTest('Post is not in list after soft delete', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Post is not in list after soft delete', false, error.message);
  }
}

async function testCommentSoftDelete() {
  console.log('\n💬 Testing Comment Soft Delete...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Comment soft delete tests (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Get a post to comment on
  let postId: string | null = null;
  try {
    const { status, data } = await makeRequest('GET', '/posts?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      postId = data.data[0].id;
    }
  } catch (error) {
    // Ignore
  }

  if (!postId) {
    logTest('Comment soft delete tests (skipped)', false, 'No post available');
    return;
  }

  // Test 1: Create a comment
  let commentId: string | null = null;
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: 'Test Commenter',
      authorEmail: `test-comment-soft-delete-${Date.now()}@example.com`,
      content: 'This comment will be soft deleted',
    });

    if (status === 201 && data.data) {
      commentId = data.data.id;
      logTest('Create comment for soft delete test', true);
    } else {
      logTest('Create comment for soft delete test', false, `Status: ${status}`);
      return;
    }
  } catch (error: any) {
    logTest('Create comment for soft delete test', false, error.message);
    return;
  }

  if (!commentId) {
    return;
  }

  // Test 2: Comment is visible before deletion
  try {
    const { status, data } = await makeRequest('GET', `/comments/${commentId}`);
    
    if (status === 200 && data.data && data.data.id === commentId) {
      logTest('Comment is visible before soft delete', true);
    } else {
      logTest('Comment is visible before soft delete', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Comment is visible before soft delete', false, error.message);
  }

  // Test 3: Delete comment (soft delete via status change)
  try {
    const { status, data } = await makeRequest('DELETE', `/comments/${commentId}`, undefined, adminToken);
    
    if (status === 200 && data.message) {
      logTest('Comment soft delete succeeds', true);
    } else {
      logTest('Comment soft delete succeeds', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Comment soft delete succeeds', false, error.message);
  }

  // Test 4: Comment is not visible after soft delete (public endpoint)
  try {
    const { status, data } = await makeRequest('GET', `/comments/${commentId}`);
    
    // Comment might still be accessible but with REJECTED status
    // The middleware should filter it out from public lists
    if (status === 200) {
      // Check if status is REJECTED
      if (data.data && data.data.status === 'REJECTED') {
        logTest('Comment status changed to REJECTED after soft delete', true);
      } else {
        logTest('Comment status changed to REJECTED after soft delete', false, 'Status not REJECTED');
      }
    } else {
      logTest('Comment status changed to REJECTED after soft delete', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Comment status changed to REJECTED after soft delete', false, error.message);
  }

  // Test 5: Comment is not in public list after soft delete
  try {
    const { status, data } = await makeRequest('GET', `/comments?postId=${postId}`);
    
    if (status === 200 && data.data) {
      const found = data.data.find((c: any) => c.id === commentId);
      if (!found) {
        logTest('Comment is not in public list after soft delete', true);
      } else {
        logTest('Comment is not in public list after soft delete', false, 'Comment still in list');
      }
    } else {
      logTest('Comment is not in public list after soft delete', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Comment is not in public list after soft delete', false, error.message);
  }
}

async function runSoftDeleteTests() {
  console.log('🧪 Starting Soft Delete Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testPostSoftDelete();
  await testCommentSoftDelete();

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
  runSoftDeleteTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runSoftDeleteTests, results };

