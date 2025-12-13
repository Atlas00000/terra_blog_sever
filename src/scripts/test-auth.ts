/**
 * Authentication API Test Script
 * Tests: register, login, invalid credentials, token validation
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

async function testRegister() {
  console.log('\n📝 Testing Registration...');
  
  // Test 1: Register new user
  try {
    const { status, data } = await makeRequest('POST', '/auth/register', {
      email: `test-${Date.now()}@example.com`,
      password: 'test12345',
      name: 'Test User',
    });
    
    if (status === 201 && data.data?.user && data.data?.token) {
      logTest('Register new user', true);
      return data.data.token;
    } else {
      logTest('Register new user', false, `Status: ${status}, Data: ${JSON.stringify(data)}`);
    }
  } catch (error: any) {
    logTest('Register new user', false, error.message);
  }

  // Test 2: Register with existing email
  try {
    const { status, data } = await makeRequest('POST', '/auth/register', {
      email: ADMIN_EMAIL,
      password: 'test12345',
      name: 'Duplicate User',
    });
    
    if (status === 409 && data.error?.code === 'USER_EXISTS') {
      logTest('Register with existing email (should fail)', true);
    } else {
      logTest('Register with existing email (should fail)', false, `Expected 409, got ${status}`);
    }
  } catch (error: any) {
    logTest('Register with existing email (should fail)', false, error.message);
  }

  // Test 3: Register with invalid email
  try {
    const { status, data } = await makeRequest('POST', '/auth/register', {
      email: 'invalid-email',
      password: 'test12345',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Register with invalid email (should fail)', true);
    } else {
      logTest('Register with invalid email (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Register with invalid email (should fail)', false, error.message);
  }

  // Test 4: Register with short password
  try {
    const { status, data } = await makeRequest('POST', '/auth/register', {
      email: 'test2@example.com',
      password: 'short',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Register with short password (should fail)', true);
    } else {
      logTest('Register with short password (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Register with short password (should fail)', false, error.message);
  }

  return null;
}

async function testLogin() {
  console.log('\n🔐 Testing Login...');
  let adminToken: string | null = null;
  let authorToken: string | null = null;

  // Test 1: Login with admin credentials
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    
    if (status === 200 && data.data?.user && data.data?.token) {
      if (data.data.user.role === 'ADMIN') {
        logTest('Login with admin credentials', true);
        adminToken = data.data.token;
      } else {
        logTest('Login with admin credentials', false, 'User role is not ADMIN');
      }
    } else {
      logTest('Login with admin credentials', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Login with admin credentials', false, error.message);
  }

  // Test 2: Login with author credentials
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email: AUTHOR_EMAIL,
      password: AUTHOR_PASSWORD,
    });
    
    if (status === 200 && data.data?.user && data.data?.token) {
      if (data.data.user.role === 'AUTHOR') {
        logTest('Login with author credentials', true);
        authorToken = data.data.token;
      } else {
        logTest('Login with author credentials', false, 'User role is not AUTHOR');
      }
    } else {
      logTest('Login with author credentials', false, `Status: ${status}`);
    }
  } catch (error: any) {
    logTest('Login with author credentials', false, error.message);
  }

  // Test 3: Login with invalid email
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email: 'nonexistent@example.com',
      password: 'password123',
    });
    
    if (status === 401 && data.error?.code === 'INVALID_CREDENTIALS') {
      logTest('Login with invalid email (should fail)', true);
    } else {
      logTest('Login with invalid email (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Login with invalid email (should fail)', false, error.message);
  }

  // Test 4: Login with wrong password
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email: ADMIN_EMAIL,
      password: 'wrongpassword',
    });
    
    if (status === 401 && data.error?.code === 'INVALID_CREDENTIALS') {
      logTest('Login with wrong password (should fail)', true);
    } else {
      logTest('Login with wrong password (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Login with wrong password (should fail)', false, error.message);
  }

  // Test 5: Login with invalid email format
  try {
    const { status, data } = await makeRequest('POST', '/auth/login', {
      email: 'invalid-email',
      password: 'password123',
    });
    
    if (status === 400 && data.error?.code === 'VALIDATION_ERROR') {
      logTest('Login with invalid email format (should fail)', true);
    } else {
      logTest('Login with invalid email format (should fail)', false, `Expected 400, got ${status}`);
    }
  } catch (error: any) {
    logTest('Login with invalid email format (should fail)', false, error.message);
  }

  return { adminToken, authorToken };
}

async function testGetMe(adminToken: string | null, authorToken: string | null) {
  console.log('\n👤 Testing Get Current User...');

  // Test 1: Get current user with admin token
  if (adminToken) {
    try {
      const { status, data } = await makeRequest('GET', '/auth/me', undefined, adminToken);
      
      if (status === 200 && data.data?.email === ADMIN_EMAIL && data.data?.role === 'ADMIN') {
        logTest('Get current user with admin token', true);
      } else {
        logTest('Get current user with admin token', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Get current user with admin token', false, error.message);
    }
  }

  // Test 2: Get current user with author token
  if (authorToken) {
    try {
      const { status, data } = await makeRequest('GET', '/auth/me', undefined, authorToken);
      
      if (status === 200 && data.data?.email === AUTHOR_EMAIL && data.data?.role === 'AUTHOR') {
        logTest('Get current user with author token', true);
      } else {
        logTest('Get current user with author token', false, `Status: ${status}`);
      }
    } catch (error: any) {
      logTest('Get current user with author token', false, error.message);
    }
  }

  // Test 3: Get current user without token
  try {
    const { status, data } = await makeRequest('GET', '/auth/me');
    
    if (status === 401 && data.error?.code === 'UNAUTHORIZED') {
      logTest('Get current user without token (should fail)', true);
    } else {
      logTest('Get current user without token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get current user without token (should fail)', false, error.message);
  }

  // Test 4: Get current user with invalid token
  try {
    const { status, data } = await makeRequest('GET', '/auth/me', undefined, 'invalid-token');
    
    if (status === 401 && data.error?.code === 'INVALID_TOKEN') {
      logTest('Get current user with invalid token (should fail)', true);
    } else {
      logTest('Get current user with invalid token (should fail)', false, `Expected 401, got ${status}`);
    }
  } catch (error: any) {
    logTest('Get current user with invalid token (should fail)', false, error.message);
  }
}

async function runAuthTests() {
  console.log('🧪 Starting Authentication API Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testRegister();
  const tokens = await testLogin();
  await testGetMe(tokens.adminToken, tokens.authorToken);

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
  runAuthTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runAuthTests, results };

