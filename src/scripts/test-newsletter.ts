/**
 * Newsletter API Test Script
 * Tests: subscribe, confirm, unsubscribe, preferences
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

async function testSubscribe() {
  console.log('\n📧 Testing Newsletter Subscribe...');

  const testEmail = `test-newsletter-${Date.now()}@example.com`;

  // Test 1: Subscribe new email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/subscribe', {
      email: testEmail,
    });
    
    if (status === 201 && data.message && data.requiresConfirmation) {
      logTest('Subscribe new email', true);
      return testEmail;
    } else {
      logTest('Subscribe new email', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Subscribe new email', false, error.message);
  }

  // Test 2: Subscribe with duplicate email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/subscribe', {
      email: testEmail,
    });
    
    if (status === 409 && (data.error?.code === 'ALREADY_SUBSCRIBED' || data.error?.code === 'PENDING_CONFIRMATION')) {
      logTest('Subscribe with duplicate email (should fail)', true);
    } else {
      logTest('Subscribe with duplicate email (should fail)', false, `Expected 409, got ${status}`);
    }
  } catch (error: any) {
    logTest('Subscribe with duplicate email (should fail)', false, error.message);
  }

  // Test 3: Subscribe with invalid email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/subscribe', {
      email: 'invalid-email',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Subscribe with invalid email (should fail)', true);
    } else {
      logTest('Subscribe with invalid email (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Subscribe with invalid email (should fail)', false, error.message);
  }

  return null;
}

async function testConfirm(email: string | null) {
  console.log('\n✅ Testing Newsletter Confirm...');

  if (!email) {
    logTest('Confirm subscription (skipped)', false, 'No email available');
    return;
  }

  // Test 1: Confirm subscription
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/confirm', {
      email,
    });
    
    if (status === 200 && data.message) {
      logTest('Confirm subscription', true);
    } else {
      logTest('Confirm subscription', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Confirm subscription', false, error.message);
  }

  // Test 2: Confirm already confirmed email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/confirm', {
      email,
    });
    
    if (status === 200 && data.message) {
      logTest('Confirm already confirmed email', true);
    } else {
      logTest('Confirm already confirmed email', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Confirm already confirmed email', false, error.message);
  }

  // Test 3: Confirm non-existent email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/confirm', {
      email: 'nonexistent@example.com',
    });
    
    if (status === 404 && data.error?.code === 'SUBSCRIBER_NOT_FOUND') {
      logTest('Confirm non-existent email (should fail)', true);
    } else {
      logTest('Confirm non-existent email (should fail)', false, `Expected 404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Confirm non-existent email (should fail)', false, error.message);
  }
}

async function testUnsubscribe(email: string | null) {
  console.log('\n🚫 Testing Newsletter Unsubscribe...');

  if (!email) {
    logTest('Unsubscribe (skipped)', false, 'No email available');
    return;
  }

  // Test 1: Unsubscribe
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/unsubscribe', {
      email,
    });
    
    if (status === 200 && data.message) {
      logTest('Unsubscribe', true);
    } else {
      logTest('Unsubscribe', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Unsubscribe', false, error.message);
  }

  // Test 2: Unsubscribe already unsubscribed email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/unsubscribe', {
      email,
    });
    
    if (status === 200 && data.message) {
      logTest('Unsubscribe already unsubscribed email', true);
    } else {
      logTest('Unsubscribe already unsubscribed email', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Unsubscribe already unsubscribed email', false, error.message);
  }

  // Test 3: Unsubscribe non-existent email
  try {
    const { status, data } = await makeRequest('POST', '/newsletter/unsubscribe', {
      email: 'nonexistent@example.com',
    });
    
    if (status === 404 && data.error?.code === 'SUBSCRIBER_NOT_FOUND') {
      logTest('Unsubscribe non-existent email (should fail)', true);
    } else {
      logTest('Unsubscribe non-existent email (should fail)', false, `Expected 404, got ${status}`);
    }
  } catch (error: any) {
    logTest('Unsubscribe non-existent email (should fail)', false, error.message);
  }
}

async function testGetAll() {
  console.log('\n📋 Testing Get All Subscribers...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Get all subscribers (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Get all subscribers as admin
  try {
    const { status, data } = await makeRequest('GET', '/newsletter?page=1&limit=10', undefined, adminToken);
    
    if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
      logTest('Get all subscribers as admin', true);
    } else {
      logTest('Get all subscribers as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get all subscribers as admin', false, error.message);
  }

  // Test 2: Get subscribers without token (should fail)
  try {
    const { status, data } = await makeRequest('GET', '/newsletter');
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Get subscribers without token (should fail)', true);
    } else {
      logTest('Get subscribers without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get subscribers without token (should fail)', false, error.message);
  }

  // Test 3: Get subscribers with pagination
  try {
    const { status, data } = await makeRequest('GET', '/newsletter?page=1&limit=1', undefined, adminToken);
    
    if (status === 200 && data.pagination && data.pagination.limit === 1) {
      logTest('Get subscribers with pagination', true);
    } else {
      logTest('Get subscribers with pagination', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get subscribers with pagination', false, error.message);
  }
}

async function runNewsletterTests() {
  console.log('🧪 Starting Newsletter API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  const email = await testSubscribe();
  await testConfirm(email);
  await testUnsubscribe(email);
  await testGetAll();

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
  runNewsletterTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runNewsletterTests, results };

