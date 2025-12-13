/**
 * Comments API Test Script
 * Tests: CRUD operations, moderation, threading
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

async function getPostId(): Promise<string | null> {
  try {
    const { status, data } = await makeRequest('GET', '/posts?page=1&limit=1');
    if (status === 200 && data.data && data.data.length > 0) {
      return data.data[0].id;
    }
  } catch (error) {
    // Ignore
  }
  return null;
}

async function testGetAllComments() {
  console.log('\n📋 Testing Get All Comments...');

  // Test 1: Get all comments (public)
  try {
    const { status, data } = await makeRequest('GET', '/comments?page=1&limit=10');
    
    if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
      logTest('Get all comments (public)', true);
    } else {
      logTest('Get all comments (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get all comments (public)', false, error.message);
  }

  // Test 2: Get comments by postId
  const postId = await getPostId();
  if (postId) {
    try {
      const { status, data } = await makeRequest('GET', `/comments?postId=${postId}`);
      
      if (status === 200 && Array.isArray(data.data)) {
        logTest('Get comments by postId', true);
      } else {
        logTest('Get comments by postId', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Get comments by postId', false, error.message);
    }
  }

  // Test 3: Get comments with pagination
  try {
    const { status, data } = await makeRequest('GET', '/comments?page=1&limit=1');
    
    if (status === 200 && data.pagination && data.pagination.limit === 1) {
      logTest('Get comments with pagination', true);
    } else {
      logTest('Get comments with pagination', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get comments with pagination', false, error.message);
  }
}

async function testCreateComment() {
  console.log('\n➕ Testing Create Comment...');

  const postId = await getPostId();
  if (!postId) {
    logTest('Create comment (skipped)', false, 'No post ID available');
    return null;
  }

  // Test 1: Create comment (public)
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: 'Test Commenter',
      authorEmail: `test-commenter-${Date.now()}@example.com`,
      content: 'This is a test comment',
    });
    
    if (status === 201 && data.data && data.data.id) {
      logTest('Create comment (public)', true);
      return data.data.id;
    } else {
      logTest('Create comment (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Create comment (public)', false, error.message);
  }

  // Test 2: Create comment with invalid postId
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId: 'invalid-post-id',
      authorName: 'Test Commenter',
      authorEmail: 'test@example.com',
      content: 'Test comment',
    });
    
    if (status === 400 || status === 404) {
      logTest('Create comment with invalid postId (should fail)', true);
    } else {
      logTest('Create comment with invalid postId (should fail)', false, `Expected 400/404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create comment with invalid postId (should fail)', false, error.message);
  }

  // Test 3: Create comment with invalid data
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: '', // Invalid: empty name
      authorEmail: 'test@example.com',
      content: 'Test comment',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Create comment with invalid data (should fail)', true);
    } else {
      logTest('Create comment with invalid data (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Create comment with invalid data (should fail)', false, error.message);
  }

  return null;
}

async function testUpdateComment(commentId: string | null) {
  console.log('\n✏️ Testing Update Comment...');

  if (!commentId) {
    logTest('Update comment (skipped)', false, 'No comment ID available');
    return;
  }

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Update comment (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Update comment as admin
  try {
    const { status, data } = await makeRequest(
      'PUT',
      `/comments/${commentId}`,
      {
        content: 'Updated comment content',
      },
      adminToken
    );
    
    if (status === 200 && data.data && data.data.content === 'Updated comment content') {
      logTest('Update comment as admin', true);
    } else {
      logTest('Update comment as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Update comment as admin', false, error.message);
  }

  // Test 2: Update comment without token (should fail)
  try {
    const { status, data } = await makeRequest('PUT', `/comments/${commentId}`, {
      content: 'Test',
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Update comment without token (should fail)', true);
    } else {
      logTest('Update comment without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Update comment without token (should fail)', false, error.message);
  }
}

async function testModerateComment() {
  console.log('\n🛡️ Testing Comment Moderation...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Moderate comment (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Create a comment first
  const postId = await getPostId();
  if (!postId) {
    logTest('Moderate comment (skipped)', false, 'No post ID available');
    return;
  }

  let commentId: string | null = null;
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: 'Test Commenter',
      authorEmail: `test-moderate-${Date.now()}@example.com`,
      content: 'Comment to moderate',
    });
    
    if (status === 201 && data.data) {
      commentId = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (!commentId) {
    logTest('Moderate comment (skipped)', false, 'Could not create test comment');
    return;
  }

  // Test 1: Moderate comment (approve)
  try {
    const { status, data } = await makeRequest(
      'PUT',
      `/comments/${commentId}/moderate`,
      {
        status: 'APPROVED',
      },
      adminToken
    );
    
    if (status === 200 && data.data && data.data.status === 'APPROVED') {
      logTest('Moderate comment (approve)', true);
    } else {
      logTest('Moderate comment (approve)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Moderate comment (approve)', false, error.message);
  }

  // Test 2: Moderate comment without token (should fail)
  try {
    const { status, data } = await makeRequest('PUT', `/comments/${commentId}/moderate`, {
      status: 'REJECTED',
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Moderate comment without token (should fail)', true);
    } else {
      logTest('Moderate comment without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Moderate comment without token (should fail)', false, error.message);
  }
}

async function testDeleteComment() {
  console.log('\n🗑️ Testing Delete Comment...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Delete comment (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Create a comment first
  const postId = await getPostId();
  if (!postId) {
    logTest('Delete comment (skipped)', false, 'No post ID available');
    return;
  }

  let commentId: string | null = null;
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: 'Test Commenter',
      authorEmail: `test-delete-${Date.now()}@example.com`,
      content: 'Comment to delete',
    });
    
    if (status === 201 && data.data) {
      commentId = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (!commentId) {
    logTest('Delete comment (skipped)', false, 'Could not create test comment');
    return;
  }

  // Test 1: Delete comment as admin
  try {
    const { status, data } = await makeRequest('DELETE', `/comments/${commentId}`, undefined, adminToken);
    
    if (status === 200 && data.message) {
      logTest('Delete comment as admin', true);
    } else {
      logTest('Delete comment as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Delete comment as admin', false, error.message);
  }

  // Test 2: Delete comment without token (should fail)
  // Create another comment
  let commentId2: string | null = null;
  try {
    const { status, data } = await makeRequest('POST', '/comments', {
      postId,
      authorName: 'Test Commenter 2',
      authorEmail: `test-delete-2-${Date.now()}@example.com`,
      content: 'Comment to delete 2',
    });
    
    if (status === 201 && data.data) {
      commentId2 = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (commentId2) {
    try {
      const { status, data } = await makeRequest('DELETE', `/comments/${commentId2}`);
      
      if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
        logTest('Delete comment without token (should fail)', true);
      } else {
        logTest('Delete comment without token (should fail)', false, `Expected 401, got ${status}`);
      }
    } catch (error: any) {
      logTest('Delete comment without token (should fail)', false, error.message);
    }
  }
}

async function runCommentTests() {
  console.log('🧪 Starting Comments API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testGetAllComments();
  const commentId = await testCreateComment();
  await testUpdateComment(commentId);
  await testModerateComment();
  await testDeleteComment();

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
  runCommentTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runCommentTests, results };

