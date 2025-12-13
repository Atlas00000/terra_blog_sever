/**
 * Contact API Test Script
 * Tests: submit, list, status update
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

async function testSubmitContact() {
  console.log('\n📝 Testing Submit Contact Form...');

  // Test 1: Submit contact form (public)
  try {
    const { status, data } = await makeRequest('POST', '/contact', {
      name: 'Test User',
      email: `test-contact-${Date.now()}@example.com`,
      subject: 'Test Subject',
      message: 'This is a test contact message',
    });
    
    if (status === 201 && data.data && data.data.id) {
      logTest('Submit contact form (public)', true);
      return data.data.id;
    } else {
      logTest('Submit contact form (public)', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Submit contact form (public)', false, error.message);
  }

  // Test 2: Submit with invalid data
  try {
    const { status, data } = await makeRequest('POST', '/contact', {
      name: '', // Invalid: empty name
      email: 'test@example.com',
      subject: 'Test',
      message: 'Test message',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Submit contact form with invalid data (should fail)', true);
    } else {
      logTest('Submit contact form with invalid data (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Submit contact form with invalid data (should fail)', false, error.message);
  }

  // Test 3: Submit with short message
  try {
    const { status, data } = await makeRequest('POST', '/contact', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test',
      message: 'Short', // Too short
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Submit contact form with short message (should fail)', true);
    } else {
      logTest('Submit contact form with short message (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Submit contact form with short message (should fail)', false, error.message);
  }

  return null;
}

async function testGetAllSubmissions() {
  console.log('\n📋 Testing Get All Contact Submissions...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Get all submissions (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Test 1: Get all submissions as admin
  try {
    const { status, data } = await makeRequest('GET', '/contact?page=1&limit=10', undefined, adminToken);
    
    if (status === 200 && data.data && Array.isArray(data.data) && data.pagination) {
      logTest('Get all submissions as admin', true);
    } else {
      logTest('Get all submissions as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get all submissions as admin', false, error.message);
  }

  // Test 2: Get submissions without token (should fail)
  try {
    const { status, data } = await makeRequest('GET', '/contact');
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Get submissions without token (should fail)', true);
    } else {
      logTest('Get submissions without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get submissions without token (should fail)', false, error.message);
  }

  // Test 3: Get submissions with pagination
  try {
    const { status, data } = await makeRequest('GET', '/contact?page=1&limit=1', undefined, adminToken);
    
    if (status === 200 && data.pagination && data.pagination.limit === 1) {
      logTest('Get submissions with pagination', true);
    } else {
      logTest('Get submissions with pagination', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Get submissions with pagination', false, error.message);
  }
}

async function testUpdateStatus() {
  console.log('\n✏️ Testing Update Submission Status...');

  const adminToken = await getToken(ADMIN_EMAIL, ADMIN_PASSWORD);
  if (!adminToken) {
    logTest('Update status (skipped - no admin token)', false, 'No admin token available');
    return;
  }

  // Create a submission first
  let submissionId: string | null = null;
  try {
    const { status, data } = await makeRequest('POST', '/contact', {
      name: 'Test User',
      email: `test-status-${Date.now()}@example.com`,
      subject: 'Test Subject',
      message: 'This is a test message for status update',
    });
    
    if (status === 201 && data.data) {
      submissionId = data.data.id;
    }
  } catch (error) {
    // Ignore
  }

  if (!submissionId) {
    logTest('Update status (skipped)', false, 'Could not create test submission');
    return;
  }

  // Test 1: Update status as admin
  try {
    const { status, data } = await makeRequest(
      'PUT',
      `/contact/${submissionId}/status`,
      {
        status: 'RESPONDED',
      },
      adminToken
    );
    
    if (status === 200 && data.data && data.data.status === 'RESPONDED') {
      logTest('Update submission status as admin', true);
    } else {
      logTest('Update submission status as admin', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Update submission status as admin', false, error.message);
  }

  // Test 2: Update status without token (should fail)
  try {
    const { status, data } = await makeRequest('PUT', `/contact/${submissionId}/status`, {
      status: 'RESPONDED',
    });
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Update status without token (should fail)', true);
    } else {
      logTest('Update status without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Update status without token (should fail)', false, error.message);
  }
}

async function runContactTests() {
  console.log('🧪 Starting Contact API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testSubmitContact();
  await testGetAllSubmissions();
  await testUpdateStatus();

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
  runContactTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runContactTests, results };

