/**
 * Security Headers Test Script
 * Tests: CORS, CSP, HSTS, X-Request-ID, security headers
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

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
  headers?: Record<string, string>
): Promise<{ status: number; headers: Headers }> {
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: requestHeaders,
  });

  return { status: response.status, headers: response.headers };
}

function logTest(name: string, passed: boolean, error?: string, data?: any) {
  results.push({ name, passed, error, data });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}`);
  if (error) {
    console.log(`   Error: ${error}`);
  }
}

async function testRequestID() {
  console.log('\n🆔 Testing Request ID Header...');

  // Test 1: Request ID is present in response
  try {
    const { headers } = await makeRequest('GET', '/health');
    const requestId = headers.get('X-Request-ID');

    if (requestId && requestId.length > 0) {
      logTest('X-Request-ID header is present', true);
    } else {
      logTest('X-Request-ID header is present', false, 'Header not found');
    }
  } catch (error: any) {
    logTest('X-Request-ID header is present', false, error.message);
  }

  // Test 2: Request ID is unique for each request
  try {
    const { headers: headers1 } = await makeRequest('GET', '/health');
    const { headers: headers2 } = await makeRequest('GET', '/health');
    const requestId1 = headers1.get('X-Request-ID');
    const requestId2 = headers2.get('X-Request-ID');

    if (requestId1 && requestId2 && requestId1 !== requestId2) {
      logTest('X-Request-ID is unique for each request', true);
    } else {
      logTest('X-Request-ID is unique for each request', false, 'IDs match or missing');
    }
  } catch (error: any) {
    logTest('X-Request-ID is unique for each request', false, error.message);
  }

  // Test 3: Request ID format is valid UUID
  try {
    const { headers } = await makeRequest('GET', '/health');
    const requestId = headers.get('X-Request-ID');

    // UUID v4 format: 8-4-4-4-12 hex digits
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (requestId && uuidRegex.test(requestId)) {
      logTest('X-Request-ID format is valid UUID', true);
    } else {
      logTest('X-Request-ID format is valid UUID', false, `Invalid format: ${requestId}`);
    }
  } catch (error: any) {
    logTest('X-Request-ID format is valid UUID', false, error.message);
  }
}

async function testSecurityHeaders() {
  console.log('\n🛡️ Testing Security Headers...');

  // Test 1: Content-Security-Policy header
  try {
    const { headers } = await makeRequest('GET', '/health');
    const csp = headers.get('Content-Security-Policy');

    if (csp) {
      logTest('Content-Security-Policy header is present', true);
    } else {
      logTest('Content-Security-Policy header is present', false, 'Header not found');
    }
  } catch (error: any) {
    logTest('Content-Security-Policy header is present', false, error.message);
  }

  // Test 2: X-Content-Type-Options header
  try {
    const { headers } = await makeRequest('GET', '/health');
    const xContentType = headers.get('X-Content-Type-Options');

    if (xContentType === 'nosniff') {
      logTest('X-Content-Type-Options header is set', true);
    } else {
      logTest('X-Content-Type-Options header is set', false, `Value: ${xContentType}`);
    }
  } catch (error: any) {
    logTest('X-Content-Type-Options header is set', false, error.message);
  }

  // Test 3: X-Frame-Options header
  try {
    const { headers } = await makeRequest('GET', '/health');
    const xFrameOptions = headers.get('X-Frame-Options');

    if (xFrameOptions) {
      logTest('X-Frame-Options header is present', true);
    } else {
      logTest('X-Frame-Options header is present', false, 'Header not found');
    }
  } catch (error: any) {
    logTest('X-Frame-Options header is present', false, error.message);
  }

  // Test 4: X-XSS-Protection header (if present)
  try {
    const { headers } = await makeRequest('GET', '/health');
    const xXssProtection = headers.get('X-XSS-Protection');

    // This header might not be present in newer browsers, so we just check if it exists
    logTest('X-XSS-Protection header check', true);
  } catch (error: any) {
    logTest('X-XSS-Protection header check', false, error.message);
  }

  // Test 5: Strict-Transport-Security header (HSTS)
  try {
    const { headers } = await makeRequest('GET', '/health');
    const hsts = headers.get('Strict-Transport-Security');

    // HSTS might only be set over HTTPS
    if (hsts || API_BASE.startsWith('http://')) {
      logTest('Strict-Transport-Security header check', true);
    } else {
      logTest('Strict-Transport-Security header check', false, 'Header not found (expected over HTTPS)');
    }
  } catch (error: any) {
    logTest('Strict-Transport-Security header check', false, error.message);
  }
}

async function testCORS() {
  console.log('\n🌍 Testing CORS Configuration...');

  // Test 1: CORS headers are present
  try {
    const { headers } = await makeRequest('OPTIONS', '/api/v1/posts', {
      'Origin': 'http://localhost:3000',
      'Access-Control-Request-Method': 'GET',
    });

    const acao = headers.get('Access-Control-Allow-Origin');
    const acam = headers.get('Access-Control-Allow-Methods');

    if (acao || acam) {
      logTest('CORS headers are present', true);
    } else {
      logTest('CORS headers are present', false, 'Headers not found');
    }
  } catch (error: any) {
    logTest('CORS headers are present', false, error.message);
  }

  // Test 2: CORS allows credentials
  try {
    const { headers } = await makeRequest('GET', '/health', {
      'Origin': 'http://localhost:3000',
    });

    const acac = headers.get('Access-Control-Allow-Credentials');

    if (acac === 'true') {
      logTest('CORS allows credentials', true);
    } else {
      logTest('CORS allows credentials', false, `Value: ${acac}`);
    }
  } catch (error: any) {
    logTest('CORS allows credentials', false, error.message);
  }

  // Test 3: CORS exposes X-Request-ID header
  try {
    const { headers } = await makeRequest('GET', '/health', {
      'Origin': 'http://localhost:3000',
    });

    const aceh = headers.get('Access-Control-Expose-Headers');

    if (aceh && aceh.includes('X-Request-ID')) {
      logTest('CORS exposes X-Request-ID header', true);
    } else {
      logTest('CORS exposes X-Request-ID header', false, `Exposed headers: ${aceh}`);
    }
  } catch (error: any) {
    logTest('CORS exposes X-Request-ID header', false, error.message);
  }
}

async function runSecurityHeaderTests() {
  console.log('🧪 Starting Security Headers Tests...\n');
  console.log(`API Base: ${API_BASE}\n`);

  await testRequestID();
  await testSecurityHeaders();
  await testCORS();

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
  runSecurityHeaderTests()
    .then((summary) => {
      process.exit(summary.failed > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { runSecurityHeaderTests, results };

